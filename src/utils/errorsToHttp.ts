import { ResourceNotFoundError } from "./errors";

export const interpretErrorsHttp = (err: unknown) => {
    if (err instanceof ResourceNotFoundError) {
        return {
            status: 404,
            body: { success: false, message: err.message }
        };
    };

    return {
        status: 500,
        body: { success: false, message: "Server error" }
    };
};