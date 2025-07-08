import Mailjet from "node-mailjet";
import {
    MAILJET_API_KEY,
    MAILJET_SECRET_KEY,
    EMAIL,
    BASE_URL
} from "../config/environment.js";
import { renderEmail } from "./mjml.js";

const mailjet = Mailjet.apiConnect(MAILJET_API_KEY, MAILJET_SECRET_KEY);

export const sendVerificationMail = async (userEmail, username, token) => {
    try {
        const request = mailjet.post("send", {version: "v3.1"}).request({
            Messages: [
                {
                    From: {
                        Email: EMAIL,
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
                    HTMLPart: renderEmail("verify", { url: `http://127.0.0.1:3000/user/verify/${token}` }), //kom ihåg att byta till basurlen
                }
            ]
        });
        const result = await request;
        if (result.body.Messages[0].Status === "success") {
            return { success: true, data: result.body.Messages[0] }
        } else return { success: false, error: "placeholder value" } //hitta om man får något felmeddelande
    } catch (error) {
        return { success: false, error: error };
    }
}