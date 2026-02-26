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

    if (err instanceof Errors.JoiValidationError) {
        return errorReturner(400, err.message);
    };
    if (err instanceof Errors.ObjectIdValidationError) {
        return errorReturner(400, err.message);
    };
    if (err instanceof Errors.MissingObjectIdError) {
        return errorReturner(400, err.message);
    };
    if (err instanceof Errors.MissingGroupNameError) {
        return errorReturner(400, err.message);
    };
    if (err instanceof Errors.MissingEmailError) {
        return errorReturner(400, err.message);
    };
    if (err instanceof Errors.InvalidEmailFormatError) {
        return errorReturner(400, err.message);
    };
    if (err instanceof Errors.MissingVerificationTokenError) {
        return errorReturner(400, err.message);
    };
    if (err instanceof Errors.MissingRefreshTokenError) {
        return errorReturner(400, err.message);
    };
    if (err instanceof Errors.MissingPasswordResetTokenError) {
        return errorReturner(400, err.message);
    };
    if (err instanceof Errors.MissingNewPasswordError) {
        return errorReturner(400, err.message);
    };

    return errorReturner(500, "Internal server error");
};