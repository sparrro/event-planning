import mongoose from "mongoose";

const eventParticipationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    eventId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
});

export default mongoose.model("EventParticipation", eventParticipationSchema);