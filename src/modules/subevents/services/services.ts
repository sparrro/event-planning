import {
    UserAlreadySignedUpToSubeventError
} from "../../../errors/errors";
import subeventType from "../../../types/modelTypes/subevent";
import subeventCreationInputData from "../../../types/subeventInputData";
import eventRepo from "../../events/repositories/eventRepo";
import subeventParticipationRepo from "../repositories/subeventParticipaitonRepo";
import subeventRepo from "../repositories/subeventRepo";
import mongoose from "mongoose";

const subeventService = {

    add: async (input: subeventCreationInputData) => {
        const subeventData: subeventType = { ...input }
        const subevent = await subeventRepo.add(subeventData);
        await subeventParticipationRepo.add(input.userId, subevent._id);
        return { success: true, message: "Subevent added", data: { subevent } };
    },

    getByUser: async (userId: mongoose.Types.ObjectId) => {
        const subevents = await subeventParticipationRepo.getSubeventsByParticipation(userId);
        return { success: true, message: "Subevents retrieved", data: { subevents } };
    },

    getbyEventAndUser: async (userId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId) => {
        const subevents = await subeventParticipationRepo.getSubeventByEventAndUser(userId, eventId);
        return { success: true, message: "Subevents retrieved", data: { subevents } };
    },

    signUp: async (userId: mongoose.Types.ObjectId, subeventId: mongoose.Types.ObjectId) => {
        const alreadySignedUp = await subeventParticipationRepo.findParticipation(userId, subeventId);
        if (alreadySignedUp) {
            throw new UserAlreadySignedUpToSubeventError(subeventId);
        };
        const participation = await subeventParticipationRepo.add(userId, subeventId);
        return { success: true, message: "Signed up succesfully", data: { participation } }
    },

    delete: async (subeventId: mongoose.Types.ObjectId) => {
        const deletedSubevent = await subeventRepo.delete(subeventId);
        await subeventParticipationRepo.deleteAllParticipationsBySubevent(subeventId);
        return { success: true, message: "Subevent deleted", data: { deletedSubevent } }
    },

    leave: async (userId: mongoose.Types.ObjectId, subeventId: mongoose.Types.ObjectId) => {
        await subeventParticipationRepo.deleteOneParticipation(userId, subeventId);
        return { success: true, message: "Participation cancelled" };
    },

};

export default subeventService;