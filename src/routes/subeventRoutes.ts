import express from "express";
import { authenticate } from "../middlewares/authentication";
import subEventController from "../modules/subevents/controllers/controller";

const subeventRoutes = express.Router();

subeventRoutes.post(
    "/add",
    authenticate,
    subEventController.add
);

export default subeventRoutes;