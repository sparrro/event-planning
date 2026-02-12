import mongoose from "mongoose";
import userGroupRepo from "../repositories/userGroupRepo";
import userGroupType from "../../../types/modelTypes/userGroup";
import userAccountRepo from "../../userAccount/repositories/userAccountRepo";
import { 
    GroupNameAlreadyTakenError,
    GroupNotFoundError,
    UserAlreadyInGroupError,
    UserIsFounderError,
    UserNotFoundError
} from "../../../errors/errors";


const groupService = {

    createGroup: async (groupData: { creatorId: mongoose.Types.ObjectId, name: string }) => {
        const { creatorId, name } = groupData;
        //kolla om gruppnamnet är upptaget
        const groupNameTaken = await userGroupRepo.findGroupByName(name);
        if (groupNameTaken) {
            throw new GroupNameAlreadyTakenError();
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
            throw new UserAlreadyInGroupError(groupId);
        };
        const group = await userGroupRepo.addUserToGroup(groupId, userId);
        return { success: true, message: "User added to group", data: { group } };
    },

    leaveGroup: async (groupId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
        const checkGroup = await userGroupRepo.findGroup(groupId);
        if (!checkGroup) {
            throw new GroupNotFoundError(groupId);
        };
        if (checkGroup.creator == userId) {
            throw new UserIsFounderError(groupId);
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
            throw new UserNotFoundError(userId);
        }
        const groups = await userGroupRepo.getGroupsByMembership(userId);
        return { success: true, message: "Groups got", data: { groups } };
    }

};

export default groupService;