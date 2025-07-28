import Joi from "joi";
import userAccountService from "../services/services";
import {
    Request,
    Response
} from "express";
import mongoose from "mongoose";

const userAccountController = {

    logIn: async (req: Request, res: Response) => {

        const credentials = req.body;
        const credentialSchema = Joi.object({
            username: Joi.string(),
            email: Joi.string(),
            password: Joi.string().required(),
            keepMeLoggedIn: Joi.boolean().required(),
        }).or("username", "email");
        const { error } = credentialSchema.validate(credentials);
        if (error) return res.status(400).json({ success: false, message: error.message });

        try {
            const result = await userAccountService.logIn(credentials);
            if (result.success) {
                return res.status(200).json(result);
            } else return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },

    logout: async (req: Request, res: Response) => {
        const { id } = req.body;
        if (!id) return res.status(400).json({success:false, message: "No id provided"});
        try {
            const result = await userAccountService.logOut(id);
            if (result.success) {
                return res.status(200).json(result);
            } else return res.status(400).json({ success: false, message: "Failed to delete refresh token" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },

    signUp: async (req: Request, res: Response) => {

        const data = req.body;
        const userSchema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
            email: Joi.string().required(),
        });
        const { error } = userSchema.validate(data);
        if (error) return res.status(400).json({ success: false, message: "Invalid user data provided" });

        try {
            const result = await userAccountService.signUp(data);
            if (result.success) {
                return res.status(201).json(result);
            } else return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },

    verify: async (req: Request, res: Response) => {

        const { token } = req.query;
        if (!token) return res.status(400).json({ success: false, message: "No token provided" });

        try {
            const result = await userAccountService.verify(token as string);
            if (result.success) {
                return res.status(200).json(result);
            } else return res.status(404).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },

    refresh: async (req: Request, res: Response) => {

        const { refreshToken } = req.params;

        try {
            const result = await userAccountService.refresh(refreshToken);
            if (result.success) {
                return res.status(200).json(result);
            } else return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },

    delete: async (req: Request, res: Response) => {

        const id = req.params.userId as unknown as mongoose.Types.ObjectId;

        try {
            const result = await userAccountService.delete(id);
            if (result.success) {
                return res.status(200).json(result);
            } else return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        };

    },

    forgotPassword: async (req: Request, res: Response) => {

        const { email } = req.body;

        try {
            const result = await userAccountService.forgotPassword(email);
            if (result.success) {
                return res.status(200).json(result);
            } else return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }

    },

    resetPassword: async (req: Request, res: Response) => {

        //inputdata
        const { token } = req.body;

        //try-catch
        try {} catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }

    }

}

export default userAccountController;