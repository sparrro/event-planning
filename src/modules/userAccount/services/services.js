import bcrypt from "bcrypt";
import userAccountRepo from "../repositories/userAccountRepo.js";
import { SALTROUNDS } from "../../../config/environment.js";
import crypto from "crypto";
import verificationTokenRepo from "../repositories/verificationTokenRepo.js";
import { sendVerificationMail } from "../../../utils/mailjet.js";
import { giveAccessToken, giveRefreshToken, verifyRefreshToken } from "../../../utils/jwt.js";

const userAccountService = {
    logIn: async (credentials) => {
        try {
            const { username, email, password, keepMeLoggedIn } = credentials;
            let account;
            if (username) {
                account = await userAccountRepo.findUserByName(username);
            } else account = await userAccountRepo.findUserByEmail(email);
            if (!account) return {success: false, message: "No account found"}

            const correctPassword = await bcrypt.compare(password, account.hashedPassword);
            if (!correctPassword) return {success: false, message: "Incorrect password"}

            const payload = {
                id: account._id,
                username: account.username,
            }
            const accessToken = giveAccessToken(payload);
            const refreshToken = giveRefreshToken(payload);
            if (keepMeLoggedIn) {
                account.refreshToken = refreshToken;
                await account.save();
            }
            return {success: true, message: "Logged in successfully", data: {accessToken, refreshToken}}
            
        } catch (error) {
            return {success: false, message: error.message}
        }

    },
    logOut: async (id) => {
        try {
            const account = await userAccountRepo.findUserById(id);
            account.refreshToken = undefined;
            await account.save();
            return {success: true, message: "Logged out succesfully"}
        } catch (error) {
            return {success: false, message: error.message}
        }
    },
    signUp: async (userData) => {
        try {
            const { username, email, password } = userData;
            const hashedPassword = await bcrypt.hash(password, SALTROUNDS);
            const registeredAt = Date.now();
            const accountData = {
                username: username,
                email: email,
                hashedPassword: hashedPassword,
                registeredAt: registeredAt
            }
            const result = await userAccountRepo.registerUser(accountData);
            const verificationToken = {
                token: crypto.randomBytes(32).toString("hex"),
                expiresAt: Date.now() + 1000 * 60 * 60 * 24,
                userId: result._id
            };
            await verificationTokenRepo.saveToken(verificationToken);
            const emailResult = await sendVerificationMail(userData.email, userData.username, verificationToken.token);
            if (emailResult.success) {
                return {success: true, message: "Account created", data: {account: result}}
            } else return {success: false, message: "Error sending verification email", error: emailResult.error}
        } catch (error) {
            return {success: false, message: error.message}
        }
    },
    verify: async (token) => {

        try {
            const tokenResult = await verificationTokenRepo.findToken(token);
            if (!tokenResult) return {success: false, message: "No token found"}
            const now = Date.now();
            if (now > tokenResult.expiresAt) {
                const newToken = {
                    token: crypto.randomBytes(32).toString("hex"),
                    expiresAt: Date.now() + 1000 * 60 * 60 * 24,
                    userId: tokenResult.userId
                };
                await verificationTokenRepo.saveToken(newToken);
                await verificationTokenRepo.deleteToken(tokenResult.token);
                const accountResult = await userAccountRepo.findUserById(newToken.userId);
                await sendVerificationMail(accountResult.email, accountResult.username, newToken.token);
                return {success: true, message: "Token expired. A new verification email has been sent."}
            }
            const accountResult = await userAccountRepo.verifyUser(tokenResult.userId);
            return {success: true, message: "Account verified", data: {account: accountResult}}
        } catch (error) {
            return {success: false, message: error.message}
        }
    },
    refresh: async (token) => {
        try {

            const decoded = verifyRefreshToken(token);
            const account = await userAccountRepo.findUserById(decoded.id);
            if (!decoded || !account || account.refreshToken !== token) return {success:false, message: "Invalid token"};
            const newAccessToken = giveAccessToken({id: account._id, username: account.username});
            return {success: true, message: "Token refreshed", data: {accessToken: newAccessToken}}

        } catch (error) {
            return {success: false, message: error.message}
        }
    }
}

export default userAccountService;