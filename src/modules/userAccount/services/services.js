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
            //hämta användarnamn, mejl och lösenord
            const { username, email, password, keepMeLoggedIn } = credentials;

            //hämta kontot efter namn eller mejl
            let account;
            if (username) {
                account = await userAccountRepo.findUserByName(username);
            } else account = await userAccountRepo.findUserByEmail(email);
            if (!account) return {success: false, message: "No account found"}

            //jämför lösenordet mot kontot
            const correctPassword = await bcrypt.compare(password, account.hashedPassword);
            if (!correctPassword) return {success: false, message: "Incorrect password"}

            //generera token med användarens id och skicka i svar
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
    signUp: async (userData) => {
        try {
            //hasha lösenordet och lägg till datum
            const { username, email, password } = userData;
            const hashedPassword = await bcrypt.hash(password, SALTROUNDS);
            const registeredAt = Date.now();
            const accountData = {
                username: username,
                email: email,
                hashedPassword: hashedPassword,
                registeredAt: registeredAt
            }
            //spara kontot till databasen
            const result = await userAccountRepo.registerUser(accountData);
            //generera verifieringstoken och spara det till databasen
            const verificationToken = {
                token: crypto.randomBytes(32).toString("hex"),
                expiresAt: Date.now() + 1000 * 60 * 60 * 24,
                userId: result._id
            };
            await verificationTokenRepo.saveToken(verificationToken);
            //skicka mejl med länk till verifieringsändpunkten med tokenet i
            const emailResult = await sendVerificationMail(userData.email, userData.username, verificationToken.token);
            //svara 200, det skapade kontot och tokenet i databasen
            if (emailResult.success) {
                return {success: true, message: "Account created", data: {account: result}}
            } else return {success: false, message: "Error sending verification email", error: emailResult.error}
        } catch (error) {
            return {success: false, message: error.message}
        }
    },
    verify: async (token) => {

        try {
            //hitta tokenet i databasen
            const tokenResult = await verificationTokenRepo.findToken(token);
            if (!tokenResult) return {success: false, message: "No token found"}
            //dekryptera det och kolla att det inte gått ut - det är inte krypterat!!!!!!!
            const now = Date.now();
            if (now > tokenResult.expiresAt) return {success: false, message: "Token expired"} //TODO: skicka ett nytt mejl
            //hitta motsvarande kontot och markera det som verifierat
            const accountResult = await userAccountRepo.verifyUser(tokenResult.userId);
            //skicka svar 200
            return {success: true, message: "Account verified", data: {account: result}}
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