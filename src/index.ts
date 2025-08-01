import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {
    DB_URI,
    PORT,
} from "./config/environment";
import userRoutes from "./routes/userAccountRoutes";

const app = express();

app.use(cors({origin: "*", optionsSuccessStatus: 200}));
app.use(express.json());

app.use("/user", userRoutes);

const connectToDatabase = () => {
    if (!DB_URI) return;
    mongoose.connect(DB_URI);

    mongoose.connection.once("open", () => {
        console.log("Connected to database");
        app.listen(PORT, () => {
            console.log(`Server running at http://127.0.0.1:${PORT}`);
        });
    });    
}

connectToDatabase();