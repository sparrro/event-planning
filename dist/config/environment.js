"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL = exports.MAILJET_SECRET_KEY = exports.MAILJET_API_KEY = exports.JWT_REFRESH_SECRET = exports.JWT_ACCESS_SECRET = exports.SALTROUNDS = exports.BASE_URL = exports.PORT = exports.DB_URI = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DB_URI = process.env.MONGODB_URI;
exports.PORT = Number(process.env.PORT);
exports.BASE_URL = process.env.BASE_URL;
exports.SALTROUNDS = Number(process.env.SALTROUNDS);
exports.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
exports.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
exports.MAILJET_API_KEY = process.env.MAILJET_API_KEY;
exports.MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY;
exports.EMAIL = process.env.EMAIL;
