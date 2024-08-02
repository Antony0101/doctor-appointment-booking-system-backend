const USER_ROLE_ENUM = {
    ADMIN: "admin",
    USER: "user",
    HOSPITAL: "hospital",
} as const;

type UserRoleEnumType = (typeof USER_ROLE_ENUM)[keyof typeof USER_ROLE_ENUM];

export { USER_ROLE_ENUM, UserRoleEnumType };
