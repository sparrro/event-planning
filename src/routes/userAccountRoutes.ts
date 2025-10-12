import express from "express";
import userAccountController from "../modules/userAccount/controllers/controller";
import { authenticate, checkSameUser, checkVerified } from "../middlewares/authentication";

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
);

userRoutes.delete(
    "/delete/:userId",
    authenticate,
    checkSameUser,
    userAccountController.delete
);

userRoutes.post(
    "/password/sendEmail",
    userAccountController.forgotPassword
);

userRoutes.post(
    "/password/reset/:token",
    userAccountController.resetPassword
);

userRoutes.post(
    "/test",
    authenticate,
    (req, res) => {
        return res.status(200).json({success: true, message: "Test successful", data: { id: req.user }});
    }
);

export default userRoutes;