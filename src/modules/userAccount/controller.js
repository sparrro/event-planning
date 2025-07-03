import Joi from "joi";
import userAccountService from "./services";

const userAccountController = {

    logIn: async (req, res) => {
        try {

        } catch (error) {
            return res.status(500).json({message: "Server error", error: error});
        }
    },

    signUp: async (req, res) => {
        try {

            const data = req.body;
            const userSchema = Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required(),
                email: Joi.string().required(),
            });
            const { error } = userSchema.validate(data);
            if (error) return res.status(400).json({message: "Invalid user data"});

            const result = await userAccountService.signUp(data);
            if (result.success) {
                return res.status(201).json(result);
            } else return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json({message: "Server error", error: error});
        }
    },

    verify: async (req, res) => {
        try {

        } catch (error) {
            return res.status(500).json({message: "Server error", error: error});
        }
    },

}

export default userAccountController;