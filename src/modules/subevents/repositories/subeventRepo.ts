import Subevent from "../models/subeventModel";
import subeventType from "../../../types/modelTypes/subevent";
import mongoose from "mongoose";

const subeventRepo = {
    add: async (subeventData: subeventType) => {
        return await Subevent.create(subeventData);
    },
    getByUser: async (userId: mongoose.Types.ObjectId) => { //delendum
        return await Subevent.find({ participants: userId });
    },
    findEvent: async (eventId: mongoose.Types.ObjectId) => { //är inte det fel med eventId istället för subeventId?
        return await Subevent.findById(eventId);
    },
    findManyEvents: async (subeventIds: mongoose.Types.ObjectId[]) => {
        return await Subevent.find({ _id: { $in: subeventIds } });
    },
};

export default subeventRepo;