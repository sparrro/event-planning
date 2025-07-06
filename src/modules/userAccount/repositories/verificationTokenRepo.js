import VerificationToken from "../models/verificationTokenModel.js";

const verificationTokenRepo = {
    saveToken: async (tokenData) => {
        return await VerificationToken.create(tokenData);
    }
}

export default verificationTokenRepo;