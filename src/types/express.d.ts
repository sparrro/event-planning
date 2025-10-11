import { Request } from "express";
import jwtPayload from "./jwtPayload";

declare module "express-serve-static-core" {
    interface Request {
        user?: jwtPayload
    }
}