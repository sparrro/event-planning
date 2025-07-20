"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = require("./config/environment");
const db = async () => {
    if (!environment_1.DB_URI)
        return;
    try {
        await mongoose_1.default.connect(environment_1.DB_URI);
        console.log("Connected to database");
    }
    catch (error) {
        console.log("Error connecting to database: " + error);
    }
    mongoose_1.default.connection.on("disconnected", () => {
        console.log("Database connection ended");
    });
};
exports.default = db;
