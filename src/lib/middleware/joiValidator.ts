import { generateAPIError } from "../errors/apiError.js";

import { Request, Response, NextFunction } from "express";
import type { ObjectSchema, ArraySchema, ValidationErrorItem } from "joi";

const JoiValidator = (validationSchema: ObjectSchema | ArraySchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const data = req.body;
        const { error, value } = validationSchema.validate(data);
        req.body = value;
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

export default JoiValidator;
