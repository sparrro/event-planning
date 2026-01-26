import mongoose from "mongoose";
import eventType from "../../../types/modelTypes/event";
import Event from "../models/eventModel";

const eventRepo = {
    create: async (eventData: eventType) => {
        return await Event.create(eventData);
    },
    find: async (id: mongoose.Types.ObjectId) => {
        return await Event.findById(id);
    },
    findUserInEvent: async (userId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId) => {
        return await Event.exists({ _id: eventId, participants: userId });
    },
    findGroupInEvent: async (groupId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId) => {
        return await Event.exists({ _id: eventId, groups: groupId });
    },
    addIndividual: async (userId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId) => {
        return await Event.findByIdAndUpdate(eventId, { $addToSet: { participants: userId } }, { new: true });
    },
    addGroup: async (groupId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId, members: mongoose.Types.ObjectId[]) => {
        return await Event.findByIdAndUpdate(eventId, { $addToSet: { participants: { $each: members }, groups: groupId } }, { new: true });
    },
    removeIndividual: async (userId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId) => {
        return await Event.findByIdAndUpdate(eventId, { $pull: { participants: userId } }, { new: true });
    },
    delete: async (eventId: mongoose.Types.ObjectId) => {
        return await Event.findByIdAndDelete(eventId);
    },
    findEventWithFounder: async (userId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId) => {
        return await Event.exists({ _id: eventId, organiser: userId });
    },
};

export default eventRepo;