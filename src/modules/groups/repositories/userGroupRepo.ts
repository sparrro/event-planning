import mongoose from "mongoose";
import UserGroup from "../models/groupModel";
import userGroupType from "../../../types/modelTypes/userGroup"

const userGroupRepo = {
    findGroup: async (id: mongoose.Types.ObjectId) => {
        return await UserGroup.findById(id);
    },
    findUserInGroup: async (groupId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
        return await UserGroup.exists({ _id: groupId, members: userId });
    },
    findGroupByName: async (name: string) => {
        return await UserGroup.findOne({ name: name });
    },
    createGroup: async (groupData: userGroupType) => {
        return await UserGroup.create(groupData);
    },
    addUserToGroup: async (groupId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
        return await UserGroup.findByIdAndUpdate(groupId, { $addToSet: { members: userId } }, { new: true });
    },
    removeUserFromGroup: async (groupId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
        return await UserGroup.findByIdAndUpdate(groupId, { $pull: { members: userId } }, { new: true });
    },
};

export default userGroupRepo;