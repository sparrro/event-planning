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
    "/join/:groupId",
    authenticate,
    groupController.joinGroup,
);

groupRoutes.put(
    "/leave/:groupId",
    authenticate,
    groupController.leaveGroup,
);

groupRoutes.get(
    "/",
    groupController.getAllGroups,
);

export default groupRoutes;