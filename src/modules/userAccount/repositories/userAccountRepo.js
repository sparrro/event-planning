import UserAccount from "../models/userAccountModel.js";

const userAccountRepo = {
    registerUser: async (userData) => {
        return await UserAccount.create(userData);
    }
}

export default userAccountRepo;