import VerificationToken from "../models/verificationTokenModel.js";

const verificationTokenRepo = {
    saveToken: async (tokenData) => {
        return await VerificationToken.create(tokenData);
    },
    findToken: async (token) => {
        return await VerificationToken.findOne({ token: token });
    }
}

export default verificationTokenRepo;