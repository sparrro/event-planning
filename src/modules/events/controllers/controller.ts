import eventService from "../services/services";
import {
    Request,
    Response
} from "express";
import mongoose from "mongoose";
import eventType from "../../../types/modelTypes/event";
import Joi from "joi";
import eventCreationInputData from "../../../types/eventInputData";
import eventRepo from "../repositories/eventRepo";

const eventController = {

    create: async (req: Request, res: Response) => {

        const { user } = req;
        const data = req.body;

        const eventSchema = Joi.object({
            name: Joi.string().required(),
            place: Joi.string().required(),
            startDate: Joi.date().required(),
            endDate: Joi.date().required(),
            groupId: Joi.string()
        });
        const { error } = eventSchema.validate(data);
        if (error) return res.status(400).json({ success: false, message: error.message });

        const inputData: eventCreationInputData = {
            ...data,
            creatorId: user!.id,
        }

        try {
            const result = await eventService.create(inputData);
            if (result.success) {
                return res.status(201).json(result);
            } else return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        };

    },

    delete: async (req: Request, res: Response) => {

        const { user } = req;
        const { eventId } = req.params;

        const event = await eventRepo.find(eventId as unknown as mongoose.Types.ObjectId);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        try {
            const result = await eventService.delete(eventId as unknown as mongoose.Types.ObjectId, user!.id);
            if (result.success) {
                return res.status(200).json(result);
            } else return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },

    joinAsGroup: async (req: Request, res: Response) => {

        const { user } = req;
        const { eventId } = req.params;
        const { groupId } = req.body;

        const event = await eventRepo.find(eventId as unknown as mongoose.Types.ObjectId);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        try {
            const result = await eventService.joinAsGroup(groupId, eventId as unknown as mongoose.Types.ObjectId, user!.id);
            if (result.success) {
                return res.status(200).json(result);
            } else return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        };

    },

    joinAsIndividual: async (req: Request, res: Response) => {

        const { user } = req;
        const { eventId } = req.params;

        const event = await eventRepo.find(eventId as unknown as mongoose.Types.ObjectId);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        try {
            const result = await eventService.joinAsIndividual(user!.id, eventId as unknown as mongoose.Types.ObjectId);
            if (result.success) {
                return res.status(200).json(result);
            } else return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        };
    },

    leave: async (req: Request, res: Response) => {

        const { user } = req;
        const { eventId } = req.params;

        const event = await eventRepo.find(eventId as unknown as mongoose.Types.ObjectId);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        try {
            const result = await eventService.leave(eventId as unknown as mongoose.Types.ObjectId, user!.id);
            if (result.success) {
                return res.status(200).json(result);
            } else return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },

};

export default eventController;