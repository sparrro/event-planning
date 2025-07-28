import jsonwebtoken from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../config/environment";
import {
    NextFunction,
    Request,
    Response
} from "express";
import jwtPayload from "../types/jwtPayload";
import userAccountRepo from "../modules/userAccount/repositories/userAccountRepo";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {

    const authorization = req.headers["authorization"];
    const token = authorization && authorization.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No valid token provided" });

    if (!JWT_ACCESS_SECRET) return res.status(400).json({ success: false, message: "Failed to authenticate token" });
    jsonwebtoken.verify(token, JWT_ACCESS_SECRET, (error, user) => {
        if (error || !user) return res.status(401).json({ success: false, message: "Failed to authenticate token" });
        const now = Math.floor(Date.now() / 1000);
        if (now > (user as jwtPayload).exp!) return res.status(401).json({ success: false, message: "Access token expired" });
        req.body.user = user;
        next();
    });

};

export const checkVerified = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;
    const account = await userAccountRepo.findUserById(user.id);
    if (!account?.verified) return res.status(401).json({ success: false, message: "User not verified" });
    next();
};

export const checkSameUser = async (req: Request, res: Response, next: NextFunction) => {
    const { authenticatedUserId } = req.body.user.id;
    const { userId } = req.params; //håll urler standardiserade efter detta
    if (authenticatedUserId != userId) return res.status(403).json({ success: false, message: "Can only access own account" });
    next();
};