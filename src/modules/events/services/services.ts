import eventCreationInputData from "../../../types/eventInputData";
import eventType from "../../../types/modelTypes/event";
import userGroupRepo from "../../groups/repositories/userGroupRepo";
import mongoose from "mongoose";
import eventRepo from "../repositories/eventRepo";
import eventParticipationRepo from "../repositories/eventParticipationRepo";
import * as Errors from "../../../errors/errors";

const eventService = {

    create: async (data: eventCreationInputData) => {
        let eventData: eventType = {
            ...data,
            organiser: data.creatorId,
        };
        if (data.groupId) {
            const group = await userGroupRepo.findGroup(data.groupId);
            if (!group) {
                throw new Errors.GroupNotFoundError(data.groupId);
            };
            eventData.groups = [data.groupId];
        };
        const event = await eventRepo.create(eventData);
        await eventParticipationRepo.create(data.creatorId, event._id);
        return { success: true, message: "Event created", data: { event } };
    },

    joinAsIndividual: async (userId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId) => {

        const eventExists = await eventRepo.find(eventId);
        if (!eventExists) {
            throw new Errors.EventNotFoundError(eventId);
        };

        const userInEvent = await eventParticipationRepo.findUserInEvent(userId, eventId);
        if (userInEvent) {
            throw new Errors.UserAlreadySignedUpToEventError(eventId);
        };
        const event = await eventParticipationRepo.create(userId, eventId);
        return { success: true, message: "User signed up for event", data: { event } };
    },

    joinAsGroup: async (groupId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
        
        const eventExists = await eventRepo.find(eventId);
        if (!eventExists) {
            throw new Errors.EventNotFoundError(eventId);
        };
        
        const groupAlreadyInEvent = await eventRepo.findGroupInEvent(groupId, eventId);
        if (groupAlreadyInEvent) {
            throw new Errors.GroupAlreadySignedUpToEventError(groupId, eventId);
        };
        const group = await userGroupRepo.findGroup(groupId);
        if (!group) {
            throw new Errors.GroupNotFoundError(groupId);
        };
        const members = group.members as unknown as mongoose.Types.ObjectId[];
        if (!members.includes(userId)) {
            throw new Errors.UserNotInGroupError(groupId);
        };
        const event = await eventRepo.addGroup(groupId, eventId, group.members as unknown as mongoose.Types.ObjectId[]);
        return { success: true, message: "Group signed up for event", data: { event } };
    },

    leave: async (eventId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {

        const eventExists = await eventRepo.find(eventId);
        if (!eventExists) {
            throw new Errors.EventNotFoundError(eventId);
        };

        const userIsOrganiser = await eventRepo.findEventWithFounder(userId, eventId);
        if (userIsOrganiser) {
            throw new Errors.UserIsOrganiserError(eventId);
        };
        await eventParticipationRepo.deleteOne(userId, eventId);
        return { success: true, message: "User removed from event"};
    },

    delete: async (eventId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {

        const event = await eventRepo.find(eventId);
        if (!event) {
            throw new Errors.EventNotFoundError(eventId);
        }

        const userIsFounder = await eventRepo.findEventWithFounder(userId, eventId);
        if (!userIsFounder) {
            throw new Errors.UserIsNotOrganiserError(eventId);
        };
        const deletedEvent = await eventRepo.delete(eventId);
        await eventParticipationRepo.deleteAll(eventId);
        return { success: true, message: "Event deleted", data: { deletedEvent } };
    },

};

export default eventService;