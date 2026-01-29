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
)

export default subeventRoutes;