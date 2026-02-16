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

export class EventNotFoundError extends Error {
    public readonly name = "eventNotFound";

    constructor(eventId: mongoose.Types.ObjectId) {
        super(`Event ${eventId} not found`);
    };
};

export class SubeventNotFoundError extends Error {
    public readonly name = "subeventNotFound";

    constructor(subeventId: mongoose.Types.ObjectId) {
        super(`Subevent ${subeventId} not found`);
    };
};

//controller errors
export class JoiValidationError extends Error {
    public readonly name = "joiValidation";

    constructor(msg: string) {
        super(msg);
    };
};

export class ObjectIdValidationError extends Error {
    public readonly name = "objectIdValidation";

    constructor(idType: ("group" | "event" | "subevent" | "user"), id: string) {
        super(`${id} is not a valid ${idType} objectId`);
    };
};

export class MissingObjectIdError extends Error {
    public readonly name = "missingObjectId";

    constructor(idType: string) {
        super(`Missing objectId for ${idType}`);
    };
};

export class MissingGroupNameError extends Error {
    public readonly name = "missingGroupName";

    constructor() {
        super("Missing group name");
    };
};

export class MissingEmailError extends Error {
    public readonly name = "missingEmail";

    constructor() {
        super("Missing email");
    };
};

export class InvalidEmailFormatError extends Error {
    public readonly name = "invalidEmailFormat";

    constructor() {
        super("Invalid email format");
    };
};

export class MissingVerificationTokenError extends Error {
    public readonly name = "missingVerificationToken";

    constructor() {
        super("Missing verification token");
    };
};

export class MissingRefreshTokenError extends Error {
    public readonly name = "missingRefreshTokenError";

    constructor() {
        super("Missing refresh token");
    };
};

export class MissingPasswordResetTokenError extends Error {
    public readonly name = "missingPasswordResetToken";

    constructor() {
        super("Missing password reset token");
    };
};

export class MissingNewPasswordError extends Error {
    public readonly name = "missingNewPassword";

    constructor() {
        super("Missing new password");
    };
};

//account service errors
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


//event service errors
export class UserIsNotParticipantInEventError extends Error {
    public readonly name = "userIsNotParticipantInEvent";

    constructor(eventId: mongoose.Types.ObjectId) {
        super(`User is not signed up to event ${eventId}`);
    };
};

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

//subevent service errors
export class UserAlreadySignedUpToSubeventError extends Error {
    public readonly name = "userAlreadySignedUpToSubevent";

    constructor(subeventId: mongoose.Types.ObjectId) {
        super(`User already signed up to subevent ${subeventId}`);
    };
};

//group service errors
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