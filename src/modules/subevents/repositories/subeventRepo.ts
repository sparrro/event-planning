import Subevent from "../models/subeventModel";
import subeventType from "../../../types/modelTypes/subevent";
import mongoose, { deleteModel } from "mongoose";

const subeventRepo = {
    add: async (subeventData: subeventType) => {
        return await Subevent.create(subeventData);
    },
    getByUser: async (userId: mongoose.Types.ObjectId) => { //delendum
        return await Subevent.find({ participants: userId });
    },
    findEvent: async (eventId: mongoose.Types.ObjectId) => { //delendum
        return await Subevent.findById(eventId);
    },
    findManyEvents: async (subeventIds: mongoose.Types.ObjectId[]) => {
        return await Subevent.find({ _id: { $in: subeventIds } });
    },
    findSubevent: async (subeventId: mongoose.Types.ObjectId) => {
        return await Subevent.findById(subeventId);
    },
    delete: async (subeventId: mongoose.Types.ObjectId) => {
        return await Subevent.findByIdAndDelete(subeventId);
    },
};

export default subeventRepo;