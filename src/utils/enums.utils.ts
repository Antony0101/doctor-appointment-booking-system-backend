const USER_ROLE_ENUM = {
    ADMIN: "admin",
    USER: "user",
    DOCTOR: "doctor",
} as const;

type UserRoleEnumType = (typeof USER_ROLE_ENUM)[keyof typeof USER_ROLE_ENUM];

const APPOINTMENT_TYPE_ENUM = {
    NORMAL: "normal",
    OTHER: "other",
} as const;

type AppointmentTypeEnumType =
    (typeof APPOINTMENT_TYPE_ENUM)[keyof typeof APPOINTMENT_TYPE_ENUM];

const APPOINTMENT_STATUS_ENUM = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
    COMPLETED: "completed",
} as const;

type AppointmentStatusEnumType =
    (typeof APPOINTMENT_STATUS_ENUM)[keyof typeof APPOINTMENT_STATUS_ENUM];

const USER_STATUS_ENUM = {
    PROFILE_PENDING: "profile_pending",
    PENDING: "pending",
    ACTIVE: "active",
    INACTIVE: "inactive",
} as const;

type UserStatusEnumType =
    (typeof USER_STATUS_ENUM)[keyof typeof USER_STATUS_ENUM];

const DOCTOR_ACTION_ENUM = {
    ACCEPT: "accept",
    REJECT: "reject",
} as const;

type DoctorActionEnumType =
    (typeof DOCTOR_ACTION_ENUM)[keyof typeof DOCTOR_ACTION_ENUM];

export {
    USER_ROLE_ENUM,
    UserRoleEnumType,
    APPOINTMENT_TYPE_ENUM,
    AppointmentTypeEnumType,
    APPOINTMENT_STATUS_ENUM,
    AppointmentStatusEnumType,
    USER_STATUS_ENUM,
    UserStatusEnumType,
    DOCTOR_ACTION_ENUM,
    DoctorActionEnumType,
};
