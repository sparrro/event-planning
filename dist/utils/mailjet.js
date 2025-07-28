"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendVerificationMail = void 0;
const node_mailjet_1 = __importDefault(require("node-mailjet"));
const environment_1 = require("../config/environment");
const mjml_1 = require("./mjml");
const mailjet = node_mailjet_1.default.apiConnect(environment_1.MAILJET_API_KEY, environment_1.MAILJET_SECRET_KEY);
const sendVerificationMail = async (userEmail, username, token) => {
    try {
        const request = mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: {
                        Email: environment_1.EMAIL,
                        Name: "",
                    },
                    To: [
                        {
                            Email: userEmail,
                            Name: username,
                        }
                    ],
                    Subject: "Account verification",
                    TextPart: "",
                    HTMLPart: (0, mjml_1.renderEmail)({ name: "verify", variables: { url: `http://127.0.0.1:3000/user/verify?token=${token}` } }), //kom ihåg att byta till basurlen
                }
            ]
        });
        const result = await request;
        const body = result.body;
        if (body.Messages[0].Status === "success") {
            return { success: true };
        }
        else
            return { success: false };
    }
    catch (error) {
        return { success: false, error: error };
    }
};
exports.sendVerificationMail = sendVerificationMail;
const sendPasswordResetEmail = async (userEmail, username, token) => {
    try {
        const request = mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: {
                        Email: environment_1.EMAIL,
                        Name: "",
                    },
                    To: [
                        {
                            Email: userEmail,
                            Name: username,
                        }
                    ],
                    Subject: "Reset password",
                    TextPart: "",
                    HTMLPart: (0, mjml_1.renderEmail)({ name: "resetPassword", variables: { url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ` } }), //kom ihåg att byta till basurlen
                }
            ]
        });
        const result = await request;
        const body = result.body;
        if (body.Messages[0].Status === "success") {
            return { success: true };
        }
        else
            return { success: false };
    }
    catch (error) {
        return { success: false, error: error };
    }
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
