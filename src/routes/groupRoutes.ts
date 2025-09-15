import express from "express";
import groupController from "../modules/groups/controllers/controller";
import { authenticate } from "../middlewares/authentication";

const groupRoutes = express.Router();

groupRoutes.post(
    "/create",
    authenticate,
    groupController.createGroup,
);

groupRoutes.put(
    "/join",
    authenticate,
    groupController.joinGroup,
);

groupRoutes.put(
    "/leave",
    authenticate,
    groupController.leaveGroup,
);