import mongoose from "mongoose";
import EventParticipation from "../models/eventParticipaitonModel";

const eventParticipationRepo = {
    create: async (userId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId) => {
        return await EventParticipation.create({ userId, eventId });
    },
    findUserInEvent: async (userId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId) => {
        return await EventParticipation.findOne({ userId, eventId });
    },
    deleteOne: async (userId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId) => {
        return await EventParticipation.findOneAndDelete({ userId, eventId });
    },
    deleteAll: async (eventId: mongoose.Types.ObjectId) => {
        return await EventParticipation.deleteMany({ eventId });
    }
};

export default eventParticipationRepo;