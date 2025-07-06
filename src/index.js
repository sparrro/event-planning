import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {
    DB_URI,
    PORT,
    BASE_URL,
    MAILJET_API_KEY,
    MAILJET_SECRET_KEY
} from "./config/index.js";
import userRoutes from "./routes/userAccountRoutes.js";
import Mailjet from "node-mailjet";

const app = express();

app.use(cors({origin: "*", optionsSuccessStatus: 200}));
app.use(express.json());

app.use("/user", userRoutes);
app.get("/test", (req, res) => {
    return res.status(200).json({success: true, message: "test successful"})
});

const mailjet = Mailjet.apiConnect(MAILJET_API_KEY, MAILJET_SECRET_KEY);
app.post("/send", async (req, res) => {
    try {
        const request = mailjet
        .post("send", {version: "v3.1"})
        .request({
            Messages: [
                {
                    From: {
                        Email: "noreply@planr.cc",
                        Name: "The Cringe Love Letter Website"
                    },
                    To: [
                        {
                            Email: "hrothi.wulfaz@gmail.com",
                            Name: "Myself?"
                        }
                    ],
                    Subject: "Test email",
                    TextPart: "Just checking it works",
                    HTMLPart: "<h1>Hello!</h1><p>This is a test email sent via <b>Mailjet</b> and Node.js</p>"
                }
            ]
        });
        const result = await request;
        res.status(200).json({success: true, message: "Email succesfully sent", data: result.body});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Server error"})
    }
});

mongoose.connect(DB_URI);

mongoose.connection.once("open", () => {
    console.log("Connected to database");
    app.listen(PORT, () => {
        console.log(`Server running at http://127.0.0.1:${PORT}`);
    });
});