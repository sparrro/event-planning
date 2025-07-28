"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resetTokenModel_1 = __importDefault(require("../models/resetTokenModel"));
const resetTokenRepo = {
    saveToken: async (tokenData) => {
        return await resetTokenModel_1.default.create(tokenData);
    },
    findToken: async (token) => {
        return await resetTokenModel_1.default.findOne({ token: token });
    },
    deleteToken: async (token) => {
        return await resetTokenModel_1.default.deleteOne({ token: token });
    }
};
exports.default = resetTokenRepo;
