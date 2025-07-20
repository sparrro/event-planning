import VerificationToken from "../models/verificationTokenModel";
import verificationTokenType from "../../../types/modelTypes/verificationToken"

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
}

export default verificationTokenRepo;