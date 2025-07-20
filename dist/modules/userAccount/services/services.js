"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const userAccountRepo_1 = __importDefault(require("../repositories/userAccountRepo"));
const environment_1 = require("../../../config/environment");
const crypto_1 = __importDefault(require("crypto"));
const verificationTokenRepo_1 = __importDefault(require("../repositories/verificationTokenRepo"));
const mailjet_1 = require("../../../utils/mailjet");
const jwt_1 = require("../../../utils/jwt");
const userAccountService = {
    logIn: async (credentials) => {
        try {
            const { username, email, password, keepMeLoggedIn } = credentials;
            if (!username && !email)
                return { success: false, message: "Username or email must be provided" };
            let account;
            if (username) {
                account = await userAccountRepo_1.default.findUserByName(username);
            }
            else
                account = await userAccountRepo_1.default.findUserByEmail(email);
            if (!account)
                return { success: false, message: "Incorrect login credentials" };
            const correctPassword = await bcrypt_1.default.compare(password, account.hashedPassword);
            if (!correctPassword)
                return { success: false, message: "Incorrect login credentials" };
            const payload = {
                id: account._id,
                username: account.username,
            };
            const accessToken = (0, jwt_1.giveAccessToken)(payload);
            const refreshToken = (0, jwt_1.giveRefreshToken)(payload);
            if (keepMeLoggedIn) {
                account.refreshToken = refreshToken;
                await account.save();
            }
            return { success: true, message: "Logged in successfully", data: { accessToken, refreshToken } };
        }
        catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            }
            else
                return { success: false, message: "Unknown error" };
        }
    },
    logOut: async (id) => {
        try {
            const account = await userAccountRepo_1.default.findUserById(id);
            if (account) {
                account.refreshToken = undefined;
                await account.save();
                return { success: true, message: "Logged out succesfully" };
            }
            else
                return { success: false, message: "Failed to delete refreshToken" };
        }
        catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            }
            else
                return { success: false, message: "Unknown error" };
        }
    },
    signUp: async (userData) => {
        try {
            const { username, email, password } = userData;
            const userNameTaken = await userAccountRepo_1.default.findUserByName(username);
            const emailInUse = await userAccountRepo_1.default.findUserByEmail(email);
            if (userNameTaken || emailInUse)
                return { success: false, message: "Email or username already taken" };
            const hashedPassword = await bcrypt_1.default.hash(password, environment_1.SALTROUNDS);
            const registeredAt = Date.now();
            const accountData = {
                username: username,
                email: email,
                hashedPassword: hashedPassword,
                registeredAt: registeredAt
            };
            const result = await userAccountRepo_1.default.registerUser(accountData);
            const verificationToken = {
                token: crypto_1.default.randomBytes(32).toString("hex"),
                expiresAt: Date.now() + 1000 * 60 * 60 * 24,
                userId: result._id
            };
            await verificationTokenRepo_1.default.saveToken(verificationToken);
            const emailResult = await (0, mailjet_1.sendVerificationMail)(userData.email, userData.username, verificationToken.token);
            if (emailResult.success) {
                return { success: true, message: "Account created", data: { account: result } };
            }
            else
                return { success: false, message: "Error sending verification email", error: emailResult.error };
        }
        catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            }
            else
                return { success: false, message: "Unknown error" };
        }
    },
    verify: async (token) => {
        try {
            const tokenResult = await verificationTokenRepo_1.default.findToken(token);
            if (!tokenResult)
                return { success: false, message: "No token found" };
            const now = Date.now();
            if (now > Number(tokenResult.expiresAt)) {
                const newToken = {
                    token: crypto_1.default.randomBytes(32).toString("hex"),
                    expiresAt: Date.now() + 1000 * 60 * 60 * 24,
                    userId: tokenResult.userId
                };
                await verificationTokenRepo_1.default.saveToken(newToken);
                await verificationTokenRepo_1.default.deleteToken(tokenResult.token);
                const accountResult = await userAccountRepo_1.default.findUserById(newToken.userId);
                if (accountResult) {
                    await (0, mailjet_1.sendVerificationMail)(accountResult.email, accountResult.username, newToken.token);
                    return { success: true, message: "Token expired, a new verification email has been sent" };
                }
                else
                    return { success: false, message: "Refresh token expired but failed to send new email" };
            }
            const accountResult = await userAccountRepo_1.default.verifyUser(tokenResult.userId);
            return { success: true, message: "Account verified", data: { account: accountResult } };
        }
        catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            }
            else
                return { success: false, message: "Unknown error" };
        }
    },
    refresh: async (token) => {
        try {
            const decoded = (0, jwt_1.verifyRefreshToken)(token);
            if (!decoded)
                return { success: false, message: "Invalid token" };
            const account = await userAccountRepo_1.default.findUserById(decoded.id);
            if (!account || account.refreshToken !== token)
                return { success: false, message: "Invalid token" };
            const newAccessToken = (0, jwt_1.giveAccessToken)({ id: account._id, username: account.username });
            return { success: true, message: "Token refreshed", data: { accessToken: newAccessToken } };
        }
        catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            }
            else
                return { success: false, message: "Unknown error" };
        }
    }
};
exports.default = userAccountService;
