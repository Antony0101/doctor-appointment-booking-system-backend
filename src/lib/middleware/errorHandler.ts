import { APIError } from "../errors/apiError.js";
import { Request, Response, NextFunction } from "express";
import { Error as MError } from "mongoose";
import { StatusCodes } from "http-status-codes";

interface MyMongoError extends MError {
    code: number;
}

const errorHandlerMiddleware = (
    err: APIError | MError | Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.log("msg", err.message);
    let customError: { statusCode: number; msg: string; success: boolean };
    if (err instanceof APIError) {
        customError = {
            statusCode: err.statusCode,
            // msg: "ApiError: " + err.message,
            msg: err.message,
            success: false,
        };
    } else if (err instanceof MError) {
        err;
        if (err.name === "ValidationError") {
            customError = {
                statusCode: StatusCodes.BAD_REQUEST,
                msg: err.message,
                // msg: "MongooseError: ValidationError: " + err.message,
                success: false,
            };
        } else if (
            err.name === "MongoError" &&
            (err as MyMongoError).code === 11000
        )
            customError = {
                statusCode: StatusCodes.BAD_REQUEST,
                msg: err.message,
                // msg: "MongooseError: NonUiqueError: " + err.message,
                success: false,
            };
        else if (err.name === "CastError") {
            customError = {
                statusCode: StatusCodes.NOT_FOUND,
                msg: err.message,
                // msg: "MongooseError: CastError: " + err.message,
                success: false,
            };
        } else {
            customError = {
                statusCode: StatusCodes.BAD_REQUEST,
                msg: err.message,
                // msg: "MongooseError: GeneralError: " + err.message,
                success: false,
            };
        }
    } else {
        customError = {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            msg: err.message,
            success: false,
        };
    }

    if (customError.statusCode === 500) console.log(err);

    return res.status(customError.statusCode).json({
        success: customError.success,
        message: customError.msg,
    });
};

export default errorHandlerMiddleware;
