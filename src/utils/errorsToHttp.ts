import * as Errors from "../errors/errors";

const errorReturner = (code: number, msg: string) => {
    return {
        status: code,
        body: {
            success: false,
            message: msg
        }
    }
};

export const interpretErrorsHttp = (err: unknown) => {
    if (err instanceof Errors.GroupNotFoundError) {
        return errorReturner(404, err.message);
    };
    if (err instanceof Errors.UserNotFoundError) {
        return errorReturner(404, err.message);
    };
    if (err instanceof Errors.EventNotFoundError) {
        return errorReturner(404, err.message);
    };
    if (err instanceof Errors.SubeventNotFoundError) {
        return errorReturner(404, err.message);
    };
};