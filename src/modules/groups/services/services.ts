import mongoose from "mongoose";
import userGroupRepo from "../repositories/userGroupRepo";
import userGroupType from "../../../types/modelTypes/userGroup";
import userAccountRepo from "../../userAccount/repositories/userAccountRepo";
import * as Errors from "../../../errors/errors";


const groupService = {

    createGroup: async (groupData: { creatorId: mongoose.Types.ObjectId, name: string }) => {
        const { creatorId, name } = groupData;
        //kolla om gruppnamnet är upptaget
        const groupNameTaken = await userGroupRepo.findGroupByName(name);
        if (groupNameTaken) {
            throw new Errors.GroupNameAlreadyTakenError();
        };
        
        //formattera datan
        const groupCreationInput: userGroupType = {
            creator: creatorId,
            members: [creatorId],
            startedAt: Date.now(),
            name: name
        };
        
        //skapa gruppen
        const group = await userGroupRepo.createGroup(groupCreationInput);

        //skicka svar
        return { success: true, message: "Group created", data: { group } };
    },

    joinGroup: async (groupId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
        if (await userGroupRepo.findUserInGroup(groupId, userId)) {
            throw new Errors.UserAlreadyInGroupError(groupId);
        };
        const group = await userGroupRepo.addUserToGroup(groupId, userId);
        return { success: true, message: "User added to group", data: { group } };
    },

    leaveGroup: async (groupId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
        const groupExists = await userGroupRepo.findGroup(groupId);
        if (!groupExists) {
            throw new Errors.GroupNotFoundError(groupId);
        };
        if (groupExists.creator == userId) {
            throw new Errors.UserIsFounderError(groupId);
        };
        const group = await userGroupRepo.removeUserFromGroup(groupId, userId);
        return { success: true, message: "User removed from group", data: { group } };
    },

    getAllGroups: async () => {
        const groups = await userGroupRepo.getAllGroups();
        return { success: true, message: "Groups got", data: { groups } };
        
    },

    getGroupsByFounder: async (id: mongoose.Types.ObjectId) => {
        const groups = await userGroupRepo.getGroupsByFounder(id);
        return { success: true, message: "Groups got", data: { groups } };
    },

    getGroupsByMembership: async (userId: mongoose.Types.ObjectId) => {
        const user = await userAccountRepo.findUserById(userId);
        if (!user) {
            throw new Errors.UserNotFoundError(userId);
        }
        const groups = await userGroupRepo.getGroupsByMembership(userId);
        return { success: true, message: "Groups got", data: { groups } };
    }

};

export default groupService;