import {
    Request,
    Response,
    NextFunction
} from "express";
import { interpretErrorsHttp } from "../utils/errorsToHttp";

export const handleErrors = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const { status, body } = interpretErrorsHttp(err);
    return res.status(status).json(body);
};