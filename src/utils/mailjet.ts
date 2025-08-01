import Mailjet from "node-mailjet";
import {
    MAILJET_API_KEY,
    MAILJET_SECRET_KEY,
    EMAIL,
    BASE_URL
} from "../config/environment";
import { renderEmail } from "./mjml";
import { RequestData } from "node-mailjet/declarations/request/Request";

const mailjet = Mailjet.apiConnect(MAILJET_API_KEY as string, MAILJET_SECRET_KEY as string);

type mailjetResponse = RequestData & {
    Messages: {Status: string}[]
}

const sendVerificationMail = async (userEmail: string, username: string, token: string) => {
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
                    HTMLPart: renderEmail({ name: "verify", variables: { url: `http://127.0.0.1:3000/user/verify?token=${token}` }}), //kom ihåg att byta till basurlen
                }
            ]
        });
        const result = await request;
        const body = result.body as mailjetResponse;
        if (body.Messages[0].Status === "success") {
            return { success: true }
        } else return { success: false }
    } catch (error) {
        return { success: false, error: error };
    }
}

const sendPasswordResetEmail = async (userEmail: string, username: string, token: string) => {
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
                    Subject: "Reset password",
                    TextPart: "",
                    HTMLPart: renderEmail({ name: "resetPassword", variables: { url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ` }}), //få igång frontenden och gör en sida för det här
                }
            ]
        });
        const result = await request;
        const body = result.body as mailjetResponse;
        if (body.Messages[0].Status === "success") {
            return { success: true }
        } else return { success: false }
    } catch (error) {
        return { success: false, error: error };
    }
}

export { sendVerificationMail, sendPasswordResetEmail }
