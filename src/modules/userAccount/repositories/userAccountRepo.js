import UserAccount from "../models/userAccountModel.js";

const userAccountRepo = {
    registerUser: async (userData) => {
        return await UserAccount.create(userData);
    },
    findUserById: async (id) => {
        return await UserAccount.findById(id);
    },
    verifyUser: async (id) => {
        return await UserAccount.findByIdAndUpdate(id, {verified: true}, {new: true});
    }
}

export default userAccountRepo;