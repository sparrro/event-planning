import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

export default mongoose.model("VerificationToken", verificationTokenSchema);