import eventCreationInputData from "../../../types/eventInputData";
import eventType from "../../../types/modelTypes/event";
import userGroupRepo from "../../groups/repositories/userGroupRepo";
import mongoose from "mongoose";
import eventRepo from "../repositories/eventRepo";

const eventService = {

    create: async (data: eventCreationInputData) => {
        try {
            let eventData: eventType = {
                ...data,
                organiser: data.creatorId,
                subevents: [],
                participants: [],
            };
            if (data.groupId) {
                const group = await userGroupRepo.findGroup(data.groupId);
                if (!group) return { success: false, message: "Invalid group id provided" };
                eventData.participants = group.members as unknown as mongoose.Types.ObjectId[];
                eventData.groups = [data.groupId];
            } else {
                eventData.participants = [data.creatorId];
            };
            const event = await eventRepo.create(eventData);
            return { success: true, message: "Event created", data: { event } };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        };
    },

    joinAsIndividual: async (userId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId) => {
        try {
            const userInEvent = await eventRepo.findUserInEvent(userId, eventId);
            if (userInEvent) return { success: false, message: "User already participant in event" };
            const event = await eventRepo.addIndividual(userId, eventId);
            return { success: true, message: "User signed up for event", data: { event } };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        };
    },

};

export default eventService;