import express from "express";
import { authenticate } from "../middlewares/authentication";
import eventController from "../modules/events/controllers/controller";

const eventRoutes = express.Router();

eventRoutes.post(
    "/create",
    authenticate,
    eventController.create
);

eventRoutes.delete(
    "/:eventId",
    authenticate,
    eventController.delete
);

eventRoutes.put(
    "/:eventId/groupjoin",
    authenticate,
    eventController.joinAsGroup
)

eventRoutes.put(
    "/:eventId/join",
    authenticate,
    eventController.joinAsIndividual
);

eventRoutes.put(
    "/:eventId/leave",
    authenticate,
    eventController.leave
)

export default eventRoutes;