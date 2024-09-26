import Joi from "joi";
import { USER_ROLE_ENUM } from "../../utils/enums.utils.js";

export const loginStartSchema = Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string()
        .valid(...Object.values(USER_ROLE_ENUM))
        .required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    role: Joi.string()
        .valid(...Object.values(USER_ROLE_ENUM))
        .required(),
});
