import jsonwebtoken from "jsonwebtoken";
import {
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET
 } from "../config/environment";
import jwtPayload from "../types/jwtPayload";

export const giveAccessToken = (payload: jwtPayload) => {
    if (!JWT_ACCESS_SECRET) return;
    return jsonwebtoken.sign(
        payload,
        JWT_ACCESS_SECRET,
        {expiresIn: "30m"}
    );
}

export const giveRefreshToken = (payload: jwtPayload) => {
    if (!JWT_REFRESH_SECRET) return;
    return jsonwebtoken.sign(
        payload,
        JWT_REFRESH_SECRET,
        {expiresIn: "14d"}
    );
}

export const verifyRefreshToken = (token: string) => {
    if (!JWT_REFRESH_SECRET) return;
    return jsonwebtoken.verify(token, JWT_REFRESH_SECRET) as jwtPayload;
}