import mongoose from "mongoose";

const userGroupSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    members: {
        type: [mongoose.Types.ObjectId],
        required: true,
    },
    startedBy: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    startedAt: {
        type: Date,
        default: Date.now,
    },
    name: {
        type: String,
        required: true,
    }
});

export default mongoose.model("UserGroup", userGroupSchema);