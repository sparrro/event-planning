import mongoose from "mongoose";

type verificationTokenType = {
    token: string,
    userId: mongoose.Types.ObjectId,
    expiresAt: number | NativeDate
};

export default verificationTokenType;