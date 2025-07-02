import mongoose from "mongoose";
import { DB_URI } from "./config/index.js";

const db = async () => {
    if (!DB_URI) return;

    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to database");
    } catch (error) {
        console.log("Error connecting to database: " + error);
    }

    mongoose.connection.on("disconnected", () => {
        console.log("Database connection ended");
    });

}

export default db;