import * as Errors from "../errors/errors";

export const interpretErrorsHttp = (err: unknown) => {
    if (err instanceof Errors.GroupNotFoundError) {
        return {
            status: 404,
            body: { success: false, message: err.message }
        };
    };

    if (err instanceof Errors.JoiValidationError) {
        return {
            status: 400,
            body: { success: false, message: err.message}
        };
    };

    if (err instanceof Errors.InvalidEmailFormatError) {
        return {
            status: 400,
            body: { success: false, message: err.message }
        };
    };

    return {
        status: 500,
        body: { success: false, message: "Server error" }
    };
};