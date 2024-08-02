import Joi from "joi";
import { USER_ROLE_ENUM } from "../../utils/enums.utils.js";

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNo: Joi.string()
        .regex(/^[0-9]{10}$/)
        .required(),
});

export const forgotPasswordStartSchema = Joi.object({
    email: Joi.string().email().required(),
});

export const forgotPasswordCompleteSchema = Joi.object({
    email: Joi.string().email().required(),
    forgotUuid: Joi.string().required(),
    password: Joi.string().required(),
});
