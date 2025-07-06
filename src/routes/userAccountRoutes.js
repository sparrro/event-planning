import express from "express";
import userAccountController from "../modules/userAccount/controllers/controller.js";

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
    "/verify",
    userAccountController.verify
)

export default userRoutes;