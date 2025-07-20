import mongoose from "mongoose"

type jwtPayload = {
    username: string,
    id: mongoose.Types.ObjectId,
    exp?: number,

}

export default jwtPayload;