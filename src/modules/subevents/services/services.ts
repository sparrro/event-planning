import subeventType from "../../../types/modelTypes/subevent";
import subeventCreationInputData from "../../../types/subeventInputData";
import eventRepo from "../../events/repositories/eventRepo";
import subeventParticipationRepo from "../repositories/subeventParticipaitonRepo";
import subeventRepo from "../repositories/subeventRepo";
import mongoose from "mongoose";

const subeventService = {

    add: async (input: subeventCreationInputData) => {
        try {
            const subeventData: subeventType = { ...input }
            const subevent = await subeventRepo.add(subeventData);
            await subeventParticipationRepo.add(input.userId, subevent._id);
            return { success: true, message: "Subevent added", data: { subevent } };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        }
    },

    getByUser: async (userId: mongoose.Types.ObjectId) => {
        try {
            const subevents = await subeventParticipationRepo.getSubeventsByParticipation(userId);
            return { success: true, message: "Subevents retrieved", data: { subevents } };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        }
    },

    getbyEventAndUser: async (userId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId) => {
        try {
            const subevents = await subeventParticipationRepo.getSubeventByEventAndUser(userId, eventId);
            return { success: true, message: "Subevents retrieved", data: { subevents } };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        };
    },

};

export default subeventService;