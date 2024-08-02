import Joi from "joi";

export const paginationValidationSchema = {
    page: Joi.number().optional().default(1),
    limit: Joi.number().optional().default(1000),
};
