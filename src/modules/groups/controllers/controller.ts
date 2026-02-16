import groupService from "../services/services";
import {
    Request,
    Response
} from "express";
import mongoose from "mongoose";
import * as Errors from "../../../errors/errors";

const groupController = {

    createGroup: async (req: Request, res: Response) => {
        
        const data = req.body;
        const { user } = req;
        if (!data.groupName || typeof data.groupName != "string") {
            throw new Errors.MissingGroupNameError();
        };

        const result = await groupService.createGroup({ creatorId: user!.id, name: data.groupName });
        return res.status(201).json(result);
    },

    joinGroup: async (req: Request, res: Response) => {
        
        const { user } = req;
        const { groupId } = req.params;
        const validGroupId = mongoose.Types.ObjectId.isValid(groupId);
        if (!validGroupId) {
            throw new Errors.ObjectIdValidationError("group", groupId);
        };

        const result = await groupService.joinGroup(groupId as unknown as mongoose.Types.ObjectId, user!.id);
        return res.status(200).json(result);
    },

    leaveGroup: async (req: Request, res: Response) => {
        
        const { user } = req;
        const { groupId } = req.params;
        const validGroupId = mongoose.Types.ObjectId.isValid(groupId);
        if (!validGroupId) {
            throw new Errors.ObjectIdValidationError("group", groupId);
        };

        const result = await groupService.leaveGroup(groupId as unknown as mongoose.Types.ObjectId, user!.id);
        return res.status(200).json(result);
    },

    getAllGroups: async (_req: Request, res: Response) => {
        const result = await groupService.getAllGroups();
        return res.status(200).json(result);
    },

    getGroupsByFounder: async (req: Request, res: Response) => {
        const { user } = req;
        const result = await groupService.getGroupsByFounder(user!.id);
        return res.status(200).json(result);
    },

    getGroupsByMembership: async (req: Request, res: Response) => {
        const { userId } = req.params;
        const validUserId = mongoose.Types.ObjectId.isValid(userId);
        if (!validUserId) {
            throw new Errors.ObjectIdValidationError("user", userId);
        };

        const result = await groupService.getGroupsByMembership(userId as unknown as mongoose.Types.ObjectId);
        return res.status(200).json(result);
    },

};

export default groupController;