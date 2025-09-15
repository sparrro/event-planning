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

    joinGroup: async (groupId: mongoose.Types.ObjectId) => {
        try {} catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        }
    },

    leaveGroup: async (groupId: mongoose.Types.ObjectId) => {
        try {} catch (error) {
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else return { success: false, message: "Unknown error" };
        }
    }

};

export default groupService;