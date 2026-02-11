import mongoose from "mongoose";

export class ResourceNotFoundError extends Error {
    public readonly name = "resourceNotFound";

    constructor(public readonly resource: mongoose.Types.ObjectId) {
        super(`Resource ${resource} not found`);
    }
};