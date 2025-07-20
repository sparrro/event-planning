"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("../modules/userAccount/controllers/controller"));
const authentication_1 = require("../middlewares/authentication");
const userRoutes = express_1.default.Router();
userRoutes.post("/signup", controller_1.default.signUp);
userRoutes.post("/login", controller_1.default.logIn);
userRoutes.post("/logout", authentication_1.authenticate, controller_1.default.logout);
userRoutes.get("/verify", controller_1.default.verify);
userRoutes.post("/refresh/:refreshToken", controller_1.default.refresh);
userRoutes.post("/test", authentication_1.authenticate, (req, res) => {
    return res.status(200).json({ success: true, message: "Test successful" });
});
exports.default = userRoutes;
