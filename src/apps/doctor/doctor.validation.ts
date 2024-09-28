import Joi from "joi";
import { paginationValidationSchema } from "../../lib/joiSchema/pagination.validation";
import { DOCTOR_ACTION_ENUM, USER_STATUS_ENUM } from "../../utils/enums.utils";

export const updateDoctorSchema = Joi.object({
    name: Joi.string().required(),
    clinicName: Joi.string().required(),
    location: Joi.string().required(),
});

export const getDoctorsSchema = Joi.object({
    ...paginationValidationSchema,
    search: Joi.string().allow(""),
    status: Joi.string()
        .valid(...Object.values(USER_STATUS_ENUM))
        .allow(""),
});

export const actionsDoctorSchema = Joi.object({
    action: Joi.string()
        .valid(...Object.values(DOCTOR_ACTION_ENUM))
        .required(),
    data: Joi.any(),
});
