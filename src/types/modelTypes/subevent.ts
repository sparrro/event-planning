import mongoose from "mongoose";

type subeventType = {
    name: string,
    desc?: string,
    place: string,
    startDate: Date,
    participants: mongoose.Types.ObjectId[],
    eventId: mongoose.Types.ObjectId,
};

export default subeventType