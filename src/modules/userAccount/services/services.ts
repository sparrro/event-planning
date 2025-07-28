import bcrypt from "bcrypt";
import userAccountRepo from "../repositories/userAccountRepo";
import { SALTROUNDS } from "../../../config/environment";
import crypto from "crypto";
import verificationTokenRepo from "../repositories/verificationTokenRepo";
import resetTokenRepo from "../repositories/resetTokenRepo";
import {
    sendVerificationMail,
    sendPasswordResetEmail,
} from "../../../utils/mailjet";
import {
    giveAccessToken,
    giveRefreshToken,
    verifyRefreshToken
} from "../../../utils/jwt";
import jwtPayload from "../../../types/jwtPayload";
import loginCredentials from "../../../types/loginCredentials";
import mongoose from "mongoose";
import signupData from "../../../types/signupData";

const userAccountService = {
    logIn: async (credentials: loginCredentials) => {
        try {
            const { username, email, password, keepMeLoggedIn } = credentials;
            if (!username && !email) return { success: false, message: "Username or email must be provided" }

            let account;
            if (username) {
                account = await userAccountRepo.findUserByName(username);
            } else account = await userAccountRepo.findUserByEmail(email!);
            if (!account) return { success: false, message: "Incorrect login credentials" }

            const correctPassword = await bcrypt.compare(password, account.hashedPassword);
            if (!correctPassword) return { success: false, message: "Incorrect login credentials" }

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
            return { success: true, message: "Logged in successfully", data: { accessToken, refreshToken } }
            
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message }
            } else return { success: false, message: "Unknown error" }
        }

    },
    logOut: async (id: mongoose.Types.ObjectId) => {
        try {
            const account = await userAccountRepo.findUserById(id);
            if (account) {
                account.refreshToken = undefined;
                await account.save();
                return { success: true, message: "Logged out succesfully" }
            } else return { success: false, message: "Failed to delete refreshToken" }
            
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message }
            } else return { success: false, message: "Unknown error" }
        }
    },
    signUp: async (userData: signupData) => {
        try {
            const { username, email, password } = userData;
            const userNameTaken = await userAccountRepo.findUserByName(username);
            const emailInUse = await userAccountRepo.findUserByEmail(email);
            if (userNameTaken || emailInUse) return { success: false, message: "Email or username already taken" }

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
                return { success: true, message: "Account created", data: { account: result } }
            } else return { success: false, message: "Error sending verification email", error: emailResult.error }
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message }
            } else return { success: false, message: "Unknown error" }
        }
    },
    verify: async (token: string) => {

        try {
            const tokenResult = await verificationTokenRepo.findToken(token);
            if (!tokenResult) return {success: false, message: "No token found"};
            const now = Date.now();
            if (now > Number(tokenResult.expiresAt)) {
                const newToken = {
                    token: crypto.randomBytes(32).toString("hex"),
                    expiresAt: Date.now() + 1000 * 60 * 60 * 24,
                    userId: tokenResult.userId,
                };
                await verificationTokenRepo.saveToken(newToken);
                await verificationTokenRepo.deleteToken(tokenResult.token);
                const accountResult = await userAccountRepo.findUserById(newToken.userId);
                if (accountResult) {
                    await sendVerificationMail(accountResult.email, accountResult.username, newToken.token);
                    return { success: true, message: "Token expired, a new verification email has been sent" };
                } else return { success: false, message: "Refresh token expired but failed to send new email" };
            }
            const accountResult = await userAccountRepo.verifyUser(tokenResult.userId);
            if (!accountResult) return { success: false, message: "Failed to verify account" };
            await verificationTokenRepo.deleteToken(token);
            return { success: true, message: "Account verified", data: { account: accountResult } };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        };
    },
    refresh: async (token: string) => {
        try {

            const decoded: jwtPayload | undefined = verifyRefreshToken(token);
            if (!decoded) return { success: false, message: "Invalid token" };

            const account = await userAccountRepo.findUserById(decoded.id);
            if (!account || account.refreshToken !== token) return { success:false, message: "Invalid token" };

            const newAccessToken = giveAccessToken({ id: account._id, username: account.username });
            return { success: true, message: "Token refreshed", data: { accessToken: newAccessToken } };

        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message }
            } else return { success: false, message: "Unknown error" }
        }
    },
    delete: async (id: mongoose.Types.ObjectId) => {

        try {
            const deletionResult = await userAccountRepo.deleteUser(id);
            if (deletionResult && !deletionResult.verified) {
                await verificationTokenRepo.deleteTokenByUserId(deletionResult._id);
            }
            return { success: true, message: "Account deleted", data: { account: deletionResult } }
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        };
        
    },
    forgotPassword: async (email: string) => {

        try {
            //hämta användaren
            const account = await userAccountRepo.findUserByEmail(email);
            if (!account) return { success: false, message: "Could not find user account" };

            //skapa ett tidsbegränsat token och spara i databasen
            const token = crypto.randomBytes(32).toString("hex");
            const resetToken = {
                token: token,
                expiresAt: Date.now() + 1000 * 60 * 15,
                userId: account._id,
            };
            await resetTokenRepo.saveToken(resetToken);

            //skicka ett mejl till användaren med en länk med tokenet som parameter
            const emailResult = await sendPasswordResetEmail(email, account.username, token);

            if (emailResult.success) {
                return { success: true, message: "Email sent" };
            } else return { success: false, message: "Error sending password reset email" };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        }

    },
    resetPassword: async () => {},
}

export default userAccountService;