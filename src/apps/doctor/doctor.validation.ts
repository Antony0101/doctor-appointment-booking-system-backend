import Joi from "joi";
import { paginationValidationSchema } from "../../lib/joiSchema/pagination.validation";
import { USER_STATUS_ENUM } from "../../utils/enums.utils";

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
