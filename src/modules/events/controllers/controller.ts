import eventService from "../services/services";
import {
    Request,
    Response
} from "express";
import mongoose from "mongoose";
import Joi from "joi";
import eventCreationInputData from "../../../types/eventInputData";
import * as Errors from "../../../errors/errors";

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
        if (error) {
            throw new Errors.JoiValidationError(error.message);
        };
        if (data.groupId) {
            const validGroupId = mongoose.Types.ObjectId.isValid(data.groupId);
            if (!validGroupId) {
                throw new Errors.ObjectIdValidationError("group", data.groupId);
            };
        };

        const inputData: eventCreationInputData = {
            ...data,
            creatorId: user!.id,
        };

        const result = await eventService.create(inputData);
        return res.status(201).json(result);

    },

    delete: async (req: Request, res: Response) => {

        const { user } = req;
        const { eventId } = req.params;
        
        const validEventId = mongoose.Types.ObjectId.isValid(eventId);
        if (!validEventId) {
            throw new Errors.ObjectIdValidationError("event", eventId);
        };

        const result = await eventService.delete(eventId as unknown as mongoose.Types.ObjectId, user!.id);
        return res.status(200).json(result);
        
    },

    joinAsGroup: async (req: Request, res: Response) => {

        const { user } = req;
        const { eventId } = req.params;
        const { groupId } = req.body;

        const validEventId = mongoose.Types.ObjectId.isValid(eventId);
        const validGroupId = mongoose.Types.ObjectId.isValid(groupId);
        if (!validEventId) {
            throw new Errors.ObjectIdValidationError("event", eventId);
        };
        if (!validGroupId) {
            throw new Errors.ObjectIdValidationError("group", groupId);
        };

        const result = await eventService.joinAsGroup(groupId, eventId as unknown as mongoose.Types.ObjectId, user!.id);
        return res.status(200).json(result);

    },

    joinAsIndividual: async (req: Request, res: Response) => {

        const { user } = req;
        const { eventId } = req.params;

        const validEventId = mongoose.Types.ObjectId.isValid(eventId);
        if (!validEventId) {
            throw new Errors.ObjectIdValidationError("event", eventId);
        };

        const result = await eventService.joinAsIndividual(user!.id, eventId as unknown as mongoose.Types.ObjectId);
        return res.status(200).json(result);

    },

    leave: async (req: Request, res: Response) => {

        const { user } = req;
        const { eventId } = req.params;

        const validEventId = mongoose.Types.ObjectId.isValid(eventId);
        if (!validEventId) {
            throw new Errors.ObjectIdValidationError("event", eventId);
        };

        const result = await eventService.leave(eventId as unknown as mongoose.Types.ObjectId, user!.id);
        return res.status(200).json(result);

    },

};

export default eventController;