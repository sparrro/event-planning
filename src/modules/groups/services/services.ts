import mongoose from "mongoose";
import userGroupRepo from "../repositories/userGroupRepo";
import userGroupType from "../../../types/modelTypes/userGroup";


const groupService = {

    createGroup: async (groupData: { creatorId: mongoose.Types.ObjectId, name: string }) => {
        try {
            const { creatorId, name } = groupData;
            //kolla om gruppnamnet är upptaget
            const groupNameTaken = await userGroupRepo.findGroupByName(name);
            if (groupNameTaken) return { success: false, message: "Group name already in use" };
            
            //formattera datan
            const groupCreationInput: userGroupType = {
                creator: creatorId,
                members: [creatorId],
                startedAt: Date.now(),
                name: name
            };
            
            //skapa gruppen
            const result = await userGroupRepo.createGroup(groupCreationInput);

            //skicka svar
            return { success: true, message: "Group created", data: { userGroup: result } };

        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unkown error" };
        }
    },

    joinGroup: async (groupId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
        try {
            if (await userGroupRepo.findUserInGroup(groupId, userId)) return { success: false, message: "User already in group" };

            const group = await userGroupRepo.addUserToGroup(groupId, userId);
            return { success: true, message: "User added to group", data: { group } };

        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        }
    },

    leaveGroup: async (groupId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
        try {
            const checkGroup = await userGroupRepo.findGroup(groupId);
            if (checkGroup?.creator == userId) {
                return { success: false, message: "Founder of a group may not leave" }
            };
            const group = await userGroupRepo.removeUserFromGroup(groupId, userId);
            return { success: true, message: "User removed from group", data: { group } };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        }
    },

    getAllGroups: async () => {
        try {
            const groups = await userGroupRepo.getAllGroups();
            return { success: true, message: "Groups got", data: { groups } };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        }
    },

    getGroupsByFounder: async (id: mongoose.Types.ObjectId) => {
        try {
            const groups = await userGroupRepo.getGroupsByFounder(id);
            return { success: true, message: "Groups got", data: { groups } };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        }
    },

    getGroupsByMembership: async (id: mongoose.Types.ObjectId) => {
        try {
            const groups = await userGroupRepo.getGroupsByMembership(id);
            return { success: true, message: "Groups got", data: { groups } };
        } catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        }
    }

};

export default groupService;