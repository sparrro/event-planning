import mongoose from "mongoose";

const subeventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
    },
    place: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        min: Date.now(),
        required: true,
    },
    participants: [{
        type: mongoose.Types.ObjectId,
        ref: "UserAccount",
    }],
});

export default mongoose.model("Subevent", subeventSchema);