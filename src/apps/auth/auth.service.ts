import type { UserDocument, UserEntity } from "../../models/user.model.js";

function removeSensitiveUserData(user: UserDocument): Partial<UserEntity> {
    const { password, tokenIds, forgotUuid, forgotUuidExpiry, ...rest } =
        user.toObject();
    return rest;
}

export { removeSensitiveUserData };
