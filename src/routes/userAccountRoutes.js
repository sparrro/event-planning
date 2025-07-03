import express from "express";
import userAccountController from "../modules/userAccount/controller.js";

const userRoutes = express.Router();

userRoutes.post(
    "/signUp",
    userAccountController.signUp
);

userRoutes.post(
    "/logIn",
    userAccountController.logIn
);

userRoutes.post(
    "/verify",
    userAccountController.verify
)

export default userRoutes;