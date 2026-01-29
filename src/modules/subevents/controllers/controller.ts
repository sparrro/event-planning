import subeventService from "../services/services";
import {
    Request,
    Response
} from "express";
import eventRepo from "../../events/repositories/eventRepo";
import Joi from "joi";
import subeventCreationInputData from "../../../types/subeventInputData";

const subEventController = {

    add: async (req: Request, res: Response) => {

        const { user } = req;
        const { data } = req.body;

        const subEventSchema = Joi.object({
            name: Joi.string().required(),
            desc: Joi.string(),
            place: Joi.string().required(),
            startDate: Joi.date().required(),
            eventId: Joi.string().required()
        });
        const { error } = subEventSchema.validate(data);
        if (error) return res.status(400).json({ success: false, message: error.message });

        const event = await eventRepo.findUserInEvent(user!.id, data.eventId);
        if (!event) return res.status(401).json({ success: false, message: "Must be participant in event to add subevent" });

        const inputData: subeventCreationInputData = {
            ...data,
            userId: user!.id
        };

        try {
            const result = await subeventService.add(inputData);
            if (result.success) {
                return res.status(201).json(result);
            } else return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },

    getByUser: async (req: Request, res: Response) => {

        const { user } = req;

        try {
            const result = await subeventService.getByUser(user!.id);
            if (result.success) {
                return res.status(200).json(result);
            } else return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },

};

export default subEventController;