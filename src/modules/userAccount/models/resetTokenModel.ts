import mongoose from "mongoose";

const resetTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "UserAccount"
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

export default mongoose.model("ResetToken", resetTokenSchema);