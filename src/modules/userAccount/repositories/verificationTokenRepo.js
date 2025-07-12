import VerificationToken from "../models/verificationTokenModel.js";

const verificationTokenRepo = {
    saveToken: async (tokenData) => {
        return await VerificationToken.create(tokenData);
    },
    findToken: async (token) => {
        return await VerificationToken.find({ token: token });
    }
}

export default verificationTokenRepo;