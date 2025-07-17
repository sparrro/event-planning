import jsonwebtoken from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../config/environment.js";

export const authenticate = (req, res, next) => {
    const authorization = req.headers["authorization"];
    const token = authorization && authorization.split(" ")[1];
    if (!token) return res.status(401).json({success: false, message: "No valid token provided"});
    jsonwebtoken.verify(token, JWT_ACCESS_SECRET, (error, user) => {
        if (error) return res.status(401).json({success: false, message: "Failed to authenticate token"});
        const now = Date.now();
        if (now > user.exp) return res.status(401).json({success: false, message: "Access token expired"});
        req.body.user = user;
        next();
    });
}