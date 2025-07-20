import jsonwebtoken from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../config/environment";
import {
    NextFunction,
    Request,
    Response
} from "express";
import jwtPayload from "../types/jwtPayload";

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

}