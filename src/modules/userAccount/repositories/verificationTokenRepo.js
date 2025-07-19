import VerificationToken from "../models/verificationTokenModel.js";

const verificationTokenRepo = {
    saveToken: async (tokenData) => {
        return await VerificationToken.create(tokenData);
    },
    findToken: async (token) => {
        return await VerificationToken.findOne({ token: token });
    },
    deleteToken: async (token) => {
        return await VerificationToken.deleteOne({ token: token })
    },
}

export default verificationTokenRepo;