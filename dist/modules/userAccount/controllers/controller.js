"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const services_1 = __importDefault(require("../services/services"));
const userAccountController = {
    logIn: async (req, res) => {
        const credentials = req.body;
        const credentialSchema = joi_1.default.object({
            username: joi_1.default.string(),
            email: joi_1.default.string(),
            password: joi_1.default.string().required(),
            keepMeLoggedIn: joi_1.default.boolean().required(),
        }).or("username", "email");
        const { error } = credentialSchema.validate(credentials);
        if (error)
            return res.status(400).json({ success: false, message: error.message });
        try {
            const result = await services_1.default.logIn(credentials);
            if (result.success) {
                return res.status(200).json(result);
            }
            else
                return res.status(400).json(result);
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },
    logout: async (req, res) => {
        const { id } = req.body;
        if (!id)
            return res.status(400).json({ success: false, message: "No id provided" });
        try {
            const result = await services_1.default.logOut(id);
            if (result.success) {
                return res.status(200).json(result);
            }
            else
                return res.status(400).json({ success: false, message: "Failed to delete refresh token" });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },
    signUp: async (req, res) => {
        const data = req.body;
        const userSchema = joi_1.default.object({
            username: joi_1.default.string().required(),
            password: joi_1.default.string().required(),
            email: joi_1.default.string().required(),
        });
        const { error } = userSchema.validate(data);
        if (error)
            return res.status(400).json({ success: false, message: "Invalid user data provided" });
        try {
            const result = await services_1.default.signUp(data);
            if (result.success) {
                return res.status(201).json(result);
            }
            else
                return res.status(400).json(result);
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },
    verify: async (req, res) => {
        const { token } = req.query;
        if (!token)
            return res.status(400).json({ success: false, message: "No token provided" });
        try {
            const result = await services_1.default.verify(token);
            if (result.success) {
                return res.status(200).json(result);
            }
            else
                return res.status(404).json(result);
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },
    refresh: async (req, res) => {
        const { refreshToken } = req.params;
        try {
            const result = await services_1.default.refresh(refreshToken);
            if (result.success) {
                return res.status(200).json(result);
            }
            else
                return res.status(400).json(result);
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },
    delete: async (req, res) => {
        const id = req.params.userId;
        try {
            const result = await services_1.default.delete(id);
            if (result.success) {
                return res.status(200).json(result);
            }
            else
                return res.status(400).json(result);
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
        ;
    },
    forgotPassword: async (req, res) => {
        const { email } = req.body;
        try {
            const result = await services_1.default.forgotPassword(email);
            if (result.success) {
                return res.status(200).json(result);
            }
            else
                return res.status(400).json(result);
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },
    resetPassword: async (req, res) => {
        const { token } = req.params;
        console.log(req.params);
        const { newPassword } = req.body;
        try {
            const result = await services_1.default.resetPassword(token, newPassword);
            if (result.success) {
                return res.status(200).json(result);
            }
            else
                return res.status(400).json(result);
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }
};
exports.default = userAccountController;
