import mongoose from "mongoose";

type eventType = {
    name: string,
    organiser: mongoose.Types.ObjectId,
    place: string,
    groups?: mongoose.Types.ObjectId[],
    participants: mongoose.Types.ObjectId[],
    startDate: Date,
    endDate: Date
};

export default eventType;