import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    organiser: {
        type: mongoose.Types.ObjectId,
        ref: "UserAccount",
        required: true,
    },
    place: {
        type: String,
    },
    groups: [{
        type: mongoose.Types.ObjectId,
        ref: "UserGroup",
    }],
    participants: [{
        type: mongoose.Types.ObjectId,
        ref: "UserAccount"
    }],
    startDate: {
        type: Date,
        min: Date.now() + 1000 * 60 * 60 * 24,
        required: true,
    },
    endDate: {
        type: Date,
        min: Date.now() + 1000 * 60 * 60 * 48,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model("Event", groupSchema);