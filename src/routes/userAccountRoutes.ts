import express from "express";
import userAccountController from "../modules/userAccount/controllers/controller";
import { authenticate } from "../middlewares/authentication";

const userRoutes = express.Router();

userRoutes.post(
    "/signup",
    userAccountController.signUp
);

userRoutes.post(
    "/login",
    userAccountController.logIn
);

userRoutes.post(
    "/logout",
    authenticate,
    userAccountController.logout
)

userRoutes.get(
    "/verify",
    userAccountController.verify
);

userRoutes.post(
    "/refresh/:refreshToken",
    userAccountController.refresh
)

userRoutes.post(
    "/test",
    authenticate,
    (req, res) => {
        return res.status(200).json({success: true, message: "Test successful"});
    }
)

export default userRoutes;