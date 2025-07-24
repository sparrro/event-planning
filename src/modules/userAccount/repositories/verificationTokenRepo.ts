import VerificationToken from "../models/verificationTokenModel";
import verificationTokenType from "../../../types/modelTypes/verificationToken"
import mongoose from "mongoose";

const verificationTokenRepo = {
    saveToken: async (tokenData: verificationTokenType) => {
        return await VerificationToken.create(tokenData);
    },
    findToken: async (token: string) => {
        return await VerificationToken.findOne({ token: token });
    },
    deleteToken: async (token: string) => {
        return await VerificationToken.deleteOne({ token: token });
    },
    deleteTokenByUserId: async (id: mongoose.Types.ObjectId) => {
        return await VerificationToken.deleteOne({ userId: id })
    }
}

export default verificationTokenRepo;