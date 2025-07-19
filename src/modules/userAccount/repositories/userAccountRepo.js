import UserAccount from "../models/userAccountModel.js";

const userAccountRepo = {
    registerUser: async (userData) => {
        return await UserAccount.create(userData);
    },
    findUserById: async (id) => {
        return await UserAccount.findById(id);
    },
    findUserByName: async (username) => {
        return await UserAccount.findOne({username: username});
    },
    findUserByEmail: async (email) => {
        return await UserAccount.findOne({email: email});
    },
    verifyUser: async (id) => {
        return await UserAccount.findByIdAndUpdate(id, {verified: true}, {new: true});
    },
}

export default userAccountRepo;