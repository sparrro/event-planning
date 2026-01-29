import Subevent from "../models/subeventModel";
import subeventType from "../../../types/modelTypes/subevent";
import mongoose from "mongoose";

const subeventRepo = {
    add: async (subeventData: subeventType) => {
        return await Subevent.create(subeventData);
    },
    getByUser: async (userId: mongoose.Types.ObjectId) => {
        return await Subevent.find({ participants: userId });
    }
};

export default subeventRepo;