import * as Errors from "../../../errors/errors";
import subeventType from "../../../types/modelTypes/subevent";
import subeventCreationInputData from "../../../types/subeventInputData";
import eventParticipationRepo from "../../events/repositories/eventParticipationRepo";
import eventRepo from "../../events/repositories/eventRepo";
import subeventParticipationRepo from "../repositories/subeventParticipaitonRepo";
import subeventRepo from "../repositories/subeventRepo";
import mongoose from "mongoose";

const subeventService = {

    add: async (input: subeventCreationInputData) => {

        const eventExists = await eventRepo.find(input.eventId);
        if (!eventExists) {
            throw new Errors.EventNotFoundError(input.eventId);
        };

        const userIsParticipantInEvent = await eventParticipationRepo.findUserInEvent(input.userId, input.eventId);
        if (!userIsParticipantInEvent) {
            throw new Errors.UserIsNotParticipantInEventError(input.eventId);
        };

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

        const eventExists = await eventRepo.find(eventId);
        if (!eventExists) {
            throw new Errors.EventNotFoundError(eventId);
        };
        const userIsParticipantInEvent = await eventParticipationRepo.findUserInEvent(userId, eventId);
        if (!userIsParticipantInEvent) {
            throw new Errors.UserIsNotParticipantInEventError(eventId);
        };

        const subevents = await subeventParticipationRepo.getSubeventByEventAndUser(userId, eventId);
        return { success: true, message: "Subevents retrieved", data: { subevents } };
    },

    join: async (userId: mongoose.Types.ObjectId, subeventId: mongoose.Types.ObjectId) => {

        const subeventExists = await subeventRepo.findSubevent(subeventId);
        if (!subeventExists) {
            throw new Errors.SubeventNotFoundError(subeventId);
        };

        const alreadySignedUp = await subeventParticipationRepo.findParticipation(userId, subeventId);
        if (alreadySignedUp) {
            throw new Errors.UserAlreadySignedUpToSubeventError(subeventId);
        };
        const participation = await subeventParticipationRepo.add(userId, subeventId);
        return { success: true, message: "Signed up succesfully", data: { participation } }
    },

    delete: async (subeventId: mongoose.Types.ObjectId) => { //kanske begränsa till den som skapat aktiviteten

        const subeventExists = await subeventRepo.findSubevent(subeventId);
        if (!subeventExists) {
            throw new Errors.SubeventNotFoundError(subeventId);
        };

        const deletedSubevent = await subeventRepo.delete(subeventId);
        await subeventParticipationRepo.deleteAllParticipationsBySubevent(subeventId);
        return { success: true, message: "Subevent deleted", data: { deletedSubevent } }
    },

    leave: async (userId: mongoose.Types.ObjectId, subeventId: mongoose.Types.ObjectId) => {

        const subeventExists = await subeventRepo.findSubevent(subeventId);
        if (!subeventExists) {
            throw new Errors.SubeventNotFoundError(subeventId);
        };

        await subeventParticipationRepo.deleteOneParticipation(userId, subeventId);
        return { success: true, message: "Participation cancelled" };
    },

};

export default subeventService;