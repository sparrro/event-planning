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
    addIndividual: async (userId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId) => {
        return await Event.findByIdAndUpdate(eventId, { $addToSet: { participants: userId } }, { new: true });
    },
};

export default eventRepo;