import Joi from "joi";
import userAccountService from "../services/services.js";

const userAccountController = {

    logIn: async (req, res) => {

        const credentials = req.body;
        const credentialSchema = Joi.object({
            username: Joi.string(),
            email: Joi.string(),
            password: Joi.string().required(),
        }).or("username", "email");
        const { error } = credentialSchema.validate(credentials);
        if (error) return res.status(400).json({success: false, message: "Missing login credentials"});

        try {
            const result = await userAccountService.logIn(credentials);
            if (result.success) {
                return res.status(200).json(result);
            } else return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json({success: false, message: "Server error"});
        }
    },

    signUp: async (req, res) => {

        const data = req.body;
        const userSchema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
            email: Joi.string().required(),
        });
        const { error } = userSchema.validate(data);
        if (error) return res.status(400).json({success: false, message: "Invalid user data provided"});

        try {
            const result = await userAccountService.signUp(data); //returnera {success: boolean, message: string, data: objekt eller array}
            if (result.success) {
                return res.status(201).json(result);
            } else return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json({success: false, message: "Server error"});
        }
    },

    verify: async (req, res) => {

        const token = req.params.token;

        try {
            const result = await userAccountService.verify(token);
            if (result.success) {
                return res.status(200).json(result);
            } else return res.status(404).json(result);
        } catch (error) {
            return res.status(500).json({success: false, message: "Server error"});
        }
    },

}

export default userAccountController;