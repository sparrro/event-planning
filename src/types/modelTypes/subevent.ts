import mongoose from "mongoose";

type subeventType = {
    name: string,
    desc?: string,
    place: string,
    startDate: Date,
    eventId: mongoose.Types.ObjectId,
};

export default subeventType