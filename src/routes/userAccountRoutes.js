import express from "express";

const userRoutes = express.Router();

userRoutes.post(
    "/signUp",
    //add middlewares!
    //add controllers, services
);

userRoutes.post(
    "/logIn",
);

export default userRoutes;