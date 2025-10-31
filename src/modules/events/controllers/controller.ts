import eventService from "../services/services";
import {
    Request,
    Response
} from "express";
import mongoose from "mongoose";
import eventType from "../../../types/modelTypes/event";
import Joi from "joi";

const eventController = {

    create: async (req: Request, res: Response) => {

        const { user } = req;
        const data = req.body;
        const eventSchema = Joi.object({
            name: Joi.string().required(),
            place: Joi.string().required(),
            startDate: Joi.date().required(),
            endDate: Joi.date().required(),
        });
        const { error } = eventSchema.validate(data);
        if (error) return res.status(400).json({ success:false, message: error.message });
    
        try {} catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }

    },

    delete: async (req: Request, res: Response) => {

        const { user } = req;
    },

    joinAsGroup: async (req: Request, res: Response) => {

        const { user } = req;
    },

    joinAsIndividual: async (req: Request, res: Response) => {

        const { user } = req;
    },

    leave: async (req: Request, res: Response) => {

        const { user } = req;
    },

};

export default eventController;