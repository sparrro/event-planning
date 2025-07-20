"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../config/environment");
const authenticate = (req, res, next) => {
    const authorization = req.headers["authorization"];
    const token = authorization && authorization.split(" ")[1];
    if (!token)
        return res.status(401).json({ success: false, message: "No valid token provided" });
    if (!environment_1.JWT_ACCESS_SECRET)
        return res.status(400).json({ success: false, message: "Failed to authenticate token" });
    jsonwebtoken_1.default.verify(token, environment_1.JWT_ACCESS_SECRET, (error, user) => {
        if (error || !user)
            return res.status(401).json({ success: false, message: "Failed to authenticate token" });
        const now = Math.floor(Date.now() / 1000);
        if (now > user.exp)
            return res.status(401).json({ success: false, message: "Access token expired" });
        req.body.user = user;
        next();
    });
};
exports.authenticate = authenticate;
