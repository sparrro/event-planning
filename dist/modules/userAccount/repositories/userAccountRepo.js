"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userAccountModel_1 = __importDefault(require("../models/userAccountModel"));
const userAccountRepo = {
    registerUser: async (userData) => {
        return await userAccountModel_1.default.create(userData);
    },
    findUserById: async (id) => {
        return await userAccountModel_1.default.findById(id);
    },
    findUserByName: async (username) => {
        return await userAccountModel_1.default.findOne({ username: username });
    },
    findUserByEmail: async (email) => {
        return await userAccountModel_1.default.findOne({ email: email });
    },
    verifyUser: async (id) => {
        return await userAccountModel_1.default.findByIdAndUpdate(id, { verified: true }, { new: true });
    },
    deleteUser: async (id) => {
        return await userAccountModel_1.default.findOneAndDelete({ _id: id });
    }
};
exports.default = userAccountRepo;
