import Joi from "joi";
import userAccountService from "../services/services";
import {
    Request,
    Response
} from "express";
import mongoose from "mongoose";
import * as Errors from "../../../errors/errors";
import { validate } from "email-validator";

const userAccountController = {

    logIn: async (req: Request, res: Response) => {

        const data = req.body;
        const credentialSchema = Joi.object({
            username: Joi.string(),
            email: Joi.string(),
            password: Joi.string().required(),
            keepMeLoggedIn: Joi.boolean().required(),
        }).or("username", "email");
        const { error } = credentialSchema.validate(data);
        if (error) {
            throw new Errors.JoiValidationError(error.message);
        };
        if (data.email) {
            const validEmail = validate(data.email);
            if (!validEmail) {
                throw new Errors.InvalidEmailFormatError();
            };
        };

        const result = await userAccountService.logIn(data);
        return res.status(200).json(result);
    },

    logout: async (req: Request, res: Response) => { //förmodligen delendum
        const { user } = req;
        if (!user) return res.status(400).json({success:false, message: "No id provided"}); //överflödigt väl?
        
        const result = await userAccountService.logOut(user.id);
        return res.status(200).json(result);
        
    },

    signUp: async (req: Request, res: Response) => {

        const data = req.body;
        const userSchema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
            email: Joi.string().required(),
        });
        const { error } = userSchema.validate(data);
        if (error) {
            throw new Errors.JoiValidationError(error.message);
        };
        if (data.email) {
            const validEmail = validate(data.email);
            if (!validEmail) {
                throw new Errors.InvalidEmailFormatError();
            };
        };

        const result = await userAccountService.signUp(data);
        return res.status(201).json(result);
    },

    verify: async (req: Request, res: Response) => {

        const { token } = req.query;
        if (!token) {
            throw new Errors.MissingVerificationTokenError();
        };

        const result = await userAccountService.verify(token as string);
        return res.status(200).json(result);
    },

    refresh: async (req: Request, res: Response) => {

        const { refreshToken } = req.params;
        if (!refreshToken) {
            throw new Errors.MissingRefreshTokenError();
        };

        const result = await userAccountService.refresh(refreshToken);
        return res.status(200).json(result);
    },

    delete: async (req: Request, res: Response) => {

        const { id } = req.params;
        const validUserId = mongoose.Types.ObjectId.isValid(id);
        if (!validUserId) {
            throw new Errors.ObjectIdValidationError("user", id);
        };

        const result = await userAccountService.delete(id as unknown as mongoose.Types.ObjectId);
        return res.status(200).json(result);

    },

    forgotPassword: async (req: Request, res: Response) => {

        const { email } = req.body;
        if (!email) {
            throw new Errors.MissingEmailError();
        } else {
            const validEmail = validate(email);
            if (!validEmail) {
                throw new Errors.InvalidEmailFormatError();
            };
        };
        

        const result = await userAccountService.forgotPassword(email);
        return res.status(200).json(result);

    },

    resetPassword: async (req: Request, res: Response) => {

        const { token } = req.params;
        if (!token) {
            throw new Errors.MissingPasswordResetTokenError();
        };

        const { newPassword } = req.body;
        if (!newPassword) {
            throw new Errors.MissingNewPasswordError();
        };

        const result = await userAccountService.resetPassword(token, newPassword);
        return res.status(200).json(result);

    }

}

export default userAccountController;