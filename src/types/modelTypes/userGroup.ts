import mongoose from "mongoose";

type userGroupType = {
    creator: mongoose.Types.ObjectId,
    members: [mongoose.Types.ObjectId],
    startedAt: number,
    name: string
};

export default userGroupType;