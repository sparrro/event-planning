import mongoose from "mongoose";

const userAccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    registeredAt: {
        type: Date,
        default: Date.now,
    },
    refreshToken: {
        type: String,
    },
});

export default mongoose.model("UserAccount", userAccountSchema);