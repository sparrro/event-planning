import mongoose from "mongoose";
import UserAccount from "../models/userAccountModel";
import userAccountType from "../../../types/modelTypes/userAccount";

const userAccountRepo = {
    registerUser: async (userData: userAccountType) => {
        return await UserAccount.create(userData);
    },
    findUserById: async (id: mongoose.Types.ObjectId) => {
        return await UserAccount.findById(id);
    },
    findUserByName: async (username: string) => {
        return await UserAccount.findOne({ username: username });
    },
    findUserByEmail: async (email: string) => {
        return await UserAccount.findOne({ email: email });
    },
    verifyUser: async (id: mongoose.Types.ObjectId) => {
        return await UserAccount.findByIdAndUpdate(id, { verified: true }, { new: true });
    },
    deleteUser: async (id: mongoose.Types.ObjectId) => {
        return await UserAccount.findOneAndDelete({ _id: id });
    },
    changeUserPassword: async (id: mongoose.Types.ObjectId, newPassword: string) => {
        return await UserAccount.findOneAndUpdate({ _id: id }, { hashedPassword: newPassword }, { new: true });
    }
}

export default userAccountRepo;