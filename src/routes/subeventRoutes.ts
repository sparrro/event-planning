import express from "express";
import { authenticate } from "../middlewares/authentication";
import subEventController from "../modules/subevents/controllers/controller";

const subeventRoutes = express.Router();

subeventRoutes.post(
    "/add",
    authenticate,
    subEventController.add
);

subeventRoutes.get(
    "/",
    authenticate,
    subEventController.getByUser
);

subeventRoutes.get(
    "/:eventId",
    authenticate,
    subEventController.getByEventAndUser
);

subeventRoutes.put(
    "/:subeventId/join",
    authenticate,
    subEventController.join
);

subeventRoutes.delete(
    "/:subeventId",
    authenticate,
    subEventController.delete
)

export default subeventRoutes;