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
    //404 errors
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

    //controller errors
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

    //account service errors
    if (err instanceof Errors.NoUsernameOrEmailProvidedError) {
        return errorReturner(401, err.message);
    };
    if (err instanceof Errors.IncorrectLoginError) {
        return errorReturner(401, err.message);
    };
    if (err instanceof Errors.FailedToDeleteRefreshTokenError) {
        return errorReturner(200, err.message); //kanske borde ändras till att inte vara ett fel alls
    };
    if (err instanceof Errors.EmailAlreadyInUseError) {
        return errorReturner(409, err.message);
    };
    if (err instanceof Errors.UsernameAlreadyInUseError) {
        return errorReturner(409, err.message);
    };
    if (err instanceof Errors.FailedToSendVerificationEmailError) {
        return errorReturner(201, err.message); //se till att man kan försöka igen på något sätt
    };
    if (err instanceof Errors.NoTokenProvidedError) {
        return errorReturner(401, err.message);
    };
    if (err instanceof Errors.TokenExpiredError) {
        return errorReturner(401, err.message);
    };
    if (err instanceof Errors.FailedToVerifyAccountError) {
        return errorReturner(400, err.message);
    };
    if (err instanceof Errors.FailedToSendPasswordResetEmailError) {
        return errorReturner(500, err.message);
    };
    if (err instanceof Errors.FailedToChangePasswordError) {
        return errorReturner(500, err.message);
    };

    //fallback
    return errorReturner(500, "Internal server error");
};