import ResetToken from "../models/resetTokenModel";
import verificationTokenType from "../../../types/modelTypes/verificationToken";

const resetTokenRepo = {
    saveToken: async (tokenData: verificationTokenType) => {
        return await ResetToken.create(tokenData);
    },
    findToken: async (token: string) => {
        return await ResetToken.findOne({ token: token });
    },
    deleteToken: async (token: string) => {
        return await ResetToken.deleteOne({ token: token });
    }
}

export default resetTokenRepo;