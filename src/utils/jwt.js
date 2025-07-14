import jsonwebtoken from "jsonwebtoken";
import {
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET
 } from "../config/environment";

export const giveAccessToken = (payload) => {
    return jsonwebtoken.sign(
        payload,
        JWT_ACCESS_SECRET,
        {expiresIn: "30m"}
    )
}

export const giveRefreshToken = (payload) => {
    return jsonwebtoken.sign(
        payload,
        JWT_REFRESH_SECRET,
        {expiresIn: "14d"}
    )
}