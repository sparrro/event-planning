"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const resetTokenSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});
exports.default = mongoose_1.default.model("ResetToken", resetTokenSchema);
