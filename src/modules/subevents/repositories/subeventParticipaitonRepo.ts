import SubeventParticipation from "../models/subeventParticipationModel";
import mongoose from "mongoose";

const subeventParticipationRepo = {
    add: async (userId: mongoose.Types.ObjectId, subeventId: mongoose.Types.ObjectId) => {
        return await SubeventParticipation.create({ userId, subeventId });
    },
    getByUser: async (userId: mongoose.Types.ObjectId) => {
        return await SubeventParticipation.find({ userId });
    },
    getSubeventsByParticipation: async (userId: mongoose.Types.ObjectId) => {
        return await SubeventParticipation.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "subevents",
                    localField: "subeventId",
                    foreignField: "_id",
                    as: "subevent"
                }
            },
            {
                $unwind: "$subevent"
            },
            {
                $replaceRoot: {
                    newRoot: "$subevent"
                }
            }
        ]);
    },
    getSubeventByEventAndUser: async (userId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId) => {
        return await SubeventParticipation.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "subevents",
                    localField: "subeventId",
                    foreignField: "_id",
                    as: "subevent"
                }
            },
            {
                $unwind: "$subevent"
            },
            {
                $replaceRoot: {
                    newRoot: "$subevent"
                }
            },
            {
                $match: {
                    eventId: new mongoose.Types.ObjectId(eventId)
                }
            }
        ]);
    }
};

export default subeventParticipationRepo;