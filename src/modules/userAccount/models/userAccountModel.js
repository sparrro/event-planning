import mongoose from "mongoose";

const userAccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("UserAccount", userAccountSchema);