import mongoose from "mongoose";

type subeventCreationInputData = {
    name: string,
    desc?: string,
    place: string,
    startDate: Date,
    eventId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
};

export default subeventCreationInputData;