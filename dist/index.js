"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = require("./config/environment");
const userAccountRoutes_1 = __importDefault(require("./routes/userAccountRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "*", optionsSuccessStatus: 200 }));
app.use(express_1.default.json());
app.use("/user", userAccountRoutes_1.default);
const connectToDatabase = () => {
    if (!environment_1.DB_URI)
        return;
    mongoose_1.default.connect(environment_1.DB_URI);
    mongoose_1.default.connection.once("open", () => {
        console.log("Connected to database");
        app.listen(environment_1.PORT, () => {
            console.log(`Server running at http://127.0.0.1:${environment_1.PORT}`);
        });
    });
};
connectToDatabase();
