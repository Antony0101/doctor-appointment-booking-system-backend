import { generateAPIError } from "../errors/apiError.js";

import { Request, Response, NextFunction } from "express";
import type { ObjectSchema, ArraySchema, ValidationErrorItem } from "joi";

const JoiQueryValidator = (validationSchema: ObjectSchema | ArraySchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const query = req.query;
        const { error, value } = validationSchema.validate(query);
        req.query = value;
        if (error) {
            const message = error.details
                .map((err: ValidationErrorItem) => err.message)
                .join(", ");
            return next(generateAPIError(message, 400));
        } else {
            return next();
        }
    };
};

export default JoiQueryValidator;
