import mongoose from "mongoose";

//document not found errors
export class GroupNotFoundError extends Error {
    public readonly name = "groupNotFound";

    constructor(groupId: mongoose.Types.ObjectId) {
        super(`Group ${groupId} not found`);
    };
};

export class UserNotFoundError extends Error {
    public readonly name = "userNotFound";

    constructor(userId?: mongoose.Types.ObjectId) {
        super(userId ? `User ${userId} not found` : "User not found");
    };
};

//account errors
export class NoUsernameOrEmailProvidedError extends Error {
    public readonly name = "noUsernameOrEmailProvided";

    constructor() {
        super("No username or email provided");
    };
};

export class IncorrectLoginError extends Error {
    public readonly name = "incorrectLogin";

    constructor() {
        super("Incorrect login credentials provided");
    };
};

export class FailedToDeleteRefreshTokenError extends Error {
    public readonly name = "failedToDeleteRefreshToken";

    constructor() {
        super("Failed to delete refresh token");
    };
};

export class EmailAlreadyInUseError extends Error {
    public readonly name = "emailAlreadyInUse";

    constructor() {
        super("Email is already in use");
    };
};

export class UsernameAlreadyInUseError extends Error {
    public readonly name = "usernameAlreadyInUse";

    constructor() {
        super("Username is already in use");
    };
};

export class FailedToSendVerificationEmailError extends Error {
    public readonly name = "failedToSendVerificationEmail";

    constructor() {
        super("Failed to send verification email");
    };
};

export class NoTokenProvidedError extends Error {
    public readonly name = "noTokenProvided";

    constructor() {
        super("No valid token provided");
    };
};

export class TokenExpiredError extends Error {
    public readonly name = "tokenExpired";

    constructor() {
        super("Token expired but failed to send new verification email");
    };
};

export class FailedToVerifyAccountError extends Error {
    public readonly name = "failedToVerifyAccount";

    constructor() {
        super("Failed to verify account");
    };
};

export class FailedToSendPasswordResetEmailError extends Error {
    public readonly name = "failedToSendPasswordResetEmail";

    constructor() {
        super("Failed to send password reset email");
    };
};

export class FailedToChangePasswordError extends Error {
    public readonly name = "failedToChangePassword";

    constructor() {
        super("Failed to change password");
    };
};

//event errors
export class UserAlreadySignedUpToEventError extends Error {
    public readonly name = "userAlreadySignedUpToEvent";

    constructor(eventId: mongoose.Types.ObjectId) {
        super(`User already signed up to event ${eventId}`);
    };
};

export class GroupAlreadySignedUpToEventError extends Error {
    public readonly name = "groupAlreadySignedUpToEvent";

    constructor(groupId: mongoose.Types.ObjectId, eventId: mongoose.Types.ObjectId) {
        super(`Group ${groupId} already signed up to event ${eventId}`);
    };
};

export class UserIsOrganiserError extends Error {
    public readonly name = "userIsOrganiser";

    constructor(eventId: mongoose.Types.ObjectId) {
        super(`User is organiser of event ${eventId}`);
    };
};

export class UserIsNotOrganiserError extends Error {
    public readonly name = "userIsNotOrganiser";

    constructor(eventId: mongoose.Types.ObjectId) {
        super(`User is not organiser of event ${eventId}`);
    };
};

//subevent errors
export class UserAlreadySignedUpToSubeventError extends Error {
    public readonly name = "userAlreadySignedUpToSubevent";

    constructor(subeventId: mongoose.Types.ObjectId) {
        super(`User already signed up to subevent ${subeventId}`);
    };
};

//group errors
export class UserNotInGroupError extends Error {
    public readonly name = "userNotInGroup";

    constructor(groupId: mongoose.Types.ObjectId) {
        super(`User not in group ${groupId}`);
    };
};

export class UserAlreadyInGroupError extends Error {
    public readonly name = "userAlreadyInGroup";

    constructor(groupId: mongoose.Types.ObjectId) {
        super(`User already in group ${groupId}`);
    };
};

export class GroupNameAlreadyTakenError extends Error {
    public readonly name = "groupNameAlreadyTaken";

    constructor() {
        super("Group name is already in use");
    };
};

export class UserIsFounderError extends Error {
    public readonly name = "userIsFounder";

    constructor(groupId: mongoose.Types.ObjectId) {
        super(`User is founder of group ${groupId}`);
    };
};