import Joi from "joi";
import groupService from "../services/services";
import {
    Request,
    Response
} from "express";
import mongoose from "mongoose";

const groupController = {

    createGroup: async (req: Request, res: Response) => {
        
        const data = req.body;
        if (!data.groupName) return res.status(400).json({ success: false, message: "Missing group name" });

        try {
            const result = await groupService.createGroup({ creatorId: data.user.id, name: data.groupName });
            if (result.success) {
                return res.status(201).json(result);
            } else return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },

    joinGroup: async (req: Request, res: Response) => {
        
        const { user } = req.body;
        const { groupId } = req.params;
        if (!groupId) return res.status(400).json({ success: false, message: "Missing groupId" });

        try {
            const result = await groupService.joinGroup(groupId as unknown as mongoose.Types.ObjectId, user.id);
            if (result.success) {
                return res.status(200).json(result);
            } else return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },

    leaveGroup: async (req: Request, res: Response) => {
        

        try {

        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },

};

export default groupController;