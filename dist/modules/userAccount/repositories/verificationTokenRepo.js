"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verificationTokenModel_1 = __importDefault(require("../models/verificationTokenModel"));
const verificationTokenRepo = {
    saveToken: async (tokenData) => {
        return await verificationTokenModel_1.default.create(tokenData);
    },
    findToken: async (token) => {
        return await verificationTokenModel_1.default.findOne({ token: token });
    },
    deleteToken: async (token) => {
        return await verificationTokenModel_1.default.deleteOne({ token: token });
    },
};
exports.default = verificationTokenRepo;
