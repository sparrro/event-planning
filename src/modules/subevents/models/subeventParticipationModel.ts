import mongoose from "mongoose";

const subEventParticipationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "UserAccount"
    },
    subeventId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Subevent"
    },
});

export default mongoose.model("SubeventParticipation", subEventParticipationSchema);