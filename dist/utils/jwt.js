"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.giveRefreshToken = exports.giveAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../config/environment");
const giveAccessToken = (payload) => {
    if (!environment_1.JWT_ACCESS_SECRET)
        return;
    return jsonwebtoken_1.default.sign(payload, environment_1.JWT_ACCESS_SECRET, { expiresIn: "30m" });
};
exports.giveAccessToken = giveAccessToken;
const giveRefreshToken = (payload) => {
    if (!environment_1.JWT_REFRESH_SECRET)
        return;
    return jsonwebtoken_1.default.sign(payload, environment_1.JWT_REFRESH_SECRET, { expiresIn: "14d" });
};
exports.giveRefreshToken = giveRefreshToken;
const verifyRefreshToken = (token) => {
    if (!environment_1.JWT_REFRESH_SECRET)
        return;
    return jsonwebtoken_1.default.verify(token, environment_1.JWT_REFRESH_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
