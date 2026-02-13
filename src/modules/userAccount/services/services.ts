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
import * as Errors from "../../../errors/errors";

const userAccountService = {
    logIn: async (credentials: loginCredentials) => {
        const { username, email, password, keepMeLoggedIn } = credentials;
        if (!username && !email) {
            throw new Errors.NoUsernameOrEmailProvidedError();
        };

        let account;
        if (username) {
            account = await userAccountRepo.findUserByName(username);
        } else account = await userAccountRepo.findUserByEmail(email!);
        if (!account) {
            throw new Errors.IncorrectLoginError();
        };

        const correctPassword = await bcrypt.compare(password, account.hashedPassword);
        if (!correctPassword) {
            throw new Errors.IncorrectLoginError();
        };

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
    },
    logOut: async (userId: mongoose.Types.ObjectId) => {
        const account = await userAccountRepo.findUserById(userId);
        if (account) {
            account.refreshToken = undefined;
            await account.save();
            return { success: true, message: "Logged out succesfully" }
        } else {
            throw new Errors.FailedToDeleteRefreshTokenError();
        };
    },
    signUp: async (userData: signupData) => {
        const { username, email, password } = userData;
        const usernameTaken = await userAccountRepo.findUserByName(username);
        const emailInUse = await userAccountRepo.findUserByEmail(email);
        if (emailInUse) {
            throw new Errors.EmailAlreadyInUseError();
        };

        if (usernameTaken) {
            throw new Errors.UsernameAlreadyInUseError();
        };

        const hashedPassword = await bcrypt.hash(password, SALTROUNDS);
        const registeredAt = Date.now();
        const accountData = {
            username: username,
            email: email,
            hashedPassword: hashedPassword,
            registeredAt: registeredAt
        };
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
        } else {
            throw new Errors.FailedToSendVerificationEmailError();
        };
    },
    verify: async (token: string) => {
        const tokenResult = await verificationTokenRepo.findToken(token);
        if (!tokenResult) {
            throw new Errors.NoTokenProvidedError();
        };
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
            } else {
                throw new Errors.TokenExpiredError();
            };
        }
        const accountResult = await userAccountRepo.verifyUser(tokenResult.userId);
        if (!accountResult) {
            throw new Errors.FailedToVerifyAccountError();
        };
        await verificationTokenRepo.deleteToken(token);
        return { success: true, message: "Account verified", data: { account: accountResult } };
    },
    refresh: async (token: string) => {
        const decoded: jwtPayload | undefined = verifyRefreshToken(token);
        if (!decoded) {
            throw new Errors.NoTokenProvidedError();
        };

        const account = await userAccountRepo.findUserById(decoded.id);
        if (!account || account.refreshToken !== token) {
            throw new Errors.NoTokenProvidedError();
        };

        const newAccessToken = giveAccessToken({ id: account._id, username: account.username });
        return { success: true, message: "Token refreshed", data: { accessToken: newAccessToken } };
    },
    delete: async (id: mongoose.Types.ObjectId) => {
        const deletionResult = await userAccountRepo.deleteUser(id);
        if (deletionResult && !deletionResult.verified) {
            await verificationTokenRepo.deleteTokenByUserId(deletionResult._id);
        };
        return { success: true, message: "Account deleted", data: { account: deletionResult } };
    },
    forgotPassword: async (email: string) => {
        const account = await userAccountRepo.findUserByEmail(email);
        if (!account) {
            throw new Errors.UserNotFoundError();
        };

        const token = crypto.randomBytes(32).toString("hex");
        const resetToken = {
            token: token,
            expiresAt: Date.now() + 1000 * 60 * 15,
            userId: account._id,
        };
        await resetTokenRepo.saveToken(resetToken);

        const emailResult = await sendPasswordResetEmail(email, account.username, token);

        if (emailResult.success) {
            return { success: true, message: "Email sent" };
        } else {
            throw new Errors.FailedToSendPasswordResetEmailError();
        };
    },
    resetPassword: async (token: string, newPassword: string) => {
            const tokenResult = await resetTokenRepo.findToken(token);
            if (!tokenResult) {
                throw new Errors.NoTokenProvidedError();
            };
            const user = await userAccountRepo.findUserById(tokenResult.userId);
            if (!user) {
                throw new Errors.NoTokenProvidedError();
            };

            const hashedPassword = await bcrypt.hash(newPassword, SALTROUNDS);
            const changeResult = await userAccountRepo.changeUserPassword(user._id, hashedPassword);

            if (changeResult && changeResult.hashedPassword === hashedPassword) {
                return { success: true, message: "Password changed" };
            } else {
                throw new Errors.FailedToChangePasswordError();
            };
    },
}

export default userAccountService;