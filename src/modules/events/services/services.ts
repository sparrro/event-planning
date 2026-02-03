import eventCreationInputData from "../../../types/eventInputData";
import eventType from "../../../types/modelTypes/event";
import userGroupRepo from "../../groups/repositories/userGroupRepo";
import mongoose from "mongoose";
import eventRepo from "../repositories/eventRepo";
import eventParticipationRepo from "../repositories/eventParticipationRepo";

const eventService = {

    create: async (data: eventCreationInputData) => { //ändra så deltagare läggs till i sin egen tabell
        try {
            let eventData: eventType = {
                ...data,
                organiser: data.creatorId,
            };
            if (data.groupId) {
                const group = await userGroupRepo.findGroup(data.groupId);
                if (!group) return { success: false, message: "Invalid group id provided" };
                eventData.groups = [data.groupId];
            };
            const event = await eventRepo.create(eventData);
            await eventParticipationRepo.create(data.creatorId, event._id);
            return { success: true, message: "Event created", data: { event } };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        };
    },

    joinAsIndividual: async (userId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId) => { //lägg till i tabellen istället
        try {
            const userInEvent = await eventParticipationRepo.findUserInEvent(userId, eventId);
            if (userInEvent) return { success: false, message: "User already participant in event" };
            const event = await eventParticipationRepo.create(userId, eventId);
            return { success: true, message: "User signed up for event", data: { event } };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        };
    },

    joinAsGroup: async (groupId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => { //kommer behöva skrivas om om jag vill implementera grupper
        try {
            const groupAlreadyInEvent = await eventRepo.findGroupInEvent(groupId, eventId);
            if (groupAlreadyInEvent) return { success: false, message: "Group already participant in event" };
            const group = await userGroupRepo.findGroup(groupId);
            if (!group) return { success: false, message: "Invalid group id provided" };
            const members = group.members as unknown as mongoose.Types.ObjectId[];
            if (!members.includes(userId)) return { success: false, message: "User not in specified group" };
            const event = await eventRepo.addGroup(groupId, eventId, group.members as unknown as mongoose.Types.ObjectId[]);
            return { success: true, message: "Group signed up for event", data: { event } };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        };
    },

    leave: async (eventId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => { //ta bort från tabellen
        try {
            await eventParticipationRepo.deleteOne(userId, eventId);
            return { success: true, message: "User removed from event"};
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        };
    },

    delete: async (eventId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => { //ta bort alla inlägg i tabellen
        try {
            const userIsFounder = await eventRepo.findEventWithFounder(userId, eventId);
            if (!userIsFounder) return ({ success: false, message: "Event can only be deleted by its organiser" });
            const deletedEvent = await eventRepo.delete(eventId);
            await eventParticipationRepo.deleteAll(eventId);
            return { success: true, message: "Event deleted", data: { deletedEvent } };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        };
    },

};

export default eventService;