import Mailjet from "node-mailjet";
import {
    MAILJET_API_KEY,
    MAILJET_SECRET_KEY,
    EMAIL,
    BASE_URL
} from "../config/environment";
import { renderEmail } from "./mjml";

const mailjet = Mailjet.apiConnect(MAILJET_API_KEY as string, MAILJET_SECRET_KEY as string);
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
        const body = result.body as any;
        if (body.Messages[0].Status === "success") {
            return { success: true }
        } else return { success: false }
    } catch (error) {
        return { success: false, error: error };
    }
}

export { sendVerificationMail }
