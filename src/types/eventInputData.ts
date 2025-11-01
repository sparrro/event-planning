import mongoose from "mongoose";

type eventCreationInputData = {
    name: string,
    place: string,
    startDate: Date,
    endDate: Date,
    groupId?: mongoose.Types.ObjectId,
    creatorId: mongoose.Types.ObjectId,
};

export default eventCreationInputData;