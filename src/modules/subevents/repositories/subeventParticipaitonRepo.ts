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
                    userId: userId
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
};

export default subeventParticipationRepo;