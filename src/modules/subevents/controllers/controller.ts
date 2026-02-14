import subeventService from "../services/services";
import {
    Request,
    Response
} from "express";
import eventRepo from "../../events/repositories/eventRepo";
import Joi from "joi";
import subeventCreationInputData from "../../../types/subeventInputData";
import mongoose from "mongoose";
import subeventRepo from "../repositories/subeventRepo";
import eventParticipationRepo from "../../events/repositories/eventParticipationRepo";
import * as Errors from "../../../errors/errors";

const subEventController = {

    add: async (req: Request, res: Response) => {

        const { user } = req;
        const data = req.body;

        const subEventSchema = Joi.object({
            name: Joi.string().required(),
            desc: Joi.string(),
            place: Joi.string().required(),
            startDate: Joi.date().required(),
            eventId: Joi.string().required()
        });
        const { error } = subEventSchema.validate(data);
        if (error) {
            throw new Errors.JoiValidationError(error.message);
        };
        const validEventId = mongoose.Types.ObjectId.isValid(data.eventId);
        if (!validEventId) {
            throw new Errors.ObjectIdValidationError("event", data.eventId);
        };

        const inputData: subeventCreationInputData = {
            ...data,
            userId: user!.id
        };

        const result = await subeventService.add(inputData);
        return res.status(201).json(result);
    },

    getByUser: async (req: Request, res: Response) => {

        const { user } = req;

        const result = await subeventService.getByUser(user!.id);
        return res.status(200).json(result);
    },

    getByEventAndUser: async (req: Request, res: Response) => {

        const { user } = req;
        const { eventId } = req.params;

        const validEventId = mongoose.Types.ObjectId.isValid(eventId);
        if (!validEventId) {
            throw new Errors.ObjectIdValidationError("event", eventId);
        };

        const result = await subeventService.getbyEventAndUser(user!.id, eventId as unknown as mongoose.Types.ObjectId);
        return res.status(200).json(result);
    },

    join: async (req: Request, res: Response) => {

        const { user } = req;
        const { subeventId } = req.params;

        const validSubeventId = mongoose.Types.ObjectId.isValid(subeventId);
        if (!validSubeventId) {
            throw new Errors.ObjectIdValidationError("subevent", subeventId);
        };

        const result = await subeventService.join(user!.id, subeventId as unknown as mongoose.Types.ObjectId);
        return res.status(200).json(result);
    },

    delete: async (req: Request, res: Response) => {

        const { subeventId } = req.params;

        const validSubeventId = mongoose.Types.ObjectId.isValid(subeventId);
        if (!validSubeventId) {
            throw new Errors.ObjectIdValidationError("subevent", subeventId);
        };

        const result = await subeventService.delete(subeventId as unknown as mongoose.Types.ObjectId);
        return res.status(200).json(result);
    },

    leave: async (req: Request, res: Response) => {

        const { user } = req;
        const { subeventId } = req.params;

        const validSubeventId = mongoose.Types.ObjectId.isValid(subeventId);
        if (!validSubeventId) {
            throw new Errors.ObjectIdValidationError("subevent", subeventId);
        };

        const result = await subeventService.leave(user!.id, subeventId as unknown as mongoose.Types.ObjectId);
        return res.status(200).json(result);

    },

};

export default subEventController;