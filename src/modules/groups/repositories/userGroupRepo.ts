import mongoose from "mongoose";
import UserGroup from "../models/groupModel";
import userGroupType from "../../../types/modelTypes/userGroup"

const userGroupRepo = {
    findGroupByName: async (name: string) => {
        return await UserGroup.findOne({ name: name })
    },
    createGroup: async (groupData: userGroupType) => {
        return await UserGroup.create(groupData);
    }
};

export default userGroupRepo;