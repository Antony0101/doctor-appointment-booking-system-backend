import type { Request, Response, NextFunction } from "express";
import type { ClientSession } from "mongoose";
import mongoose from "mongoose";

export type ControllerTFunction = (
    req: Request,
    res: Response,
    session: ClientSession,
) => Promise<unknown>;

const expressTWrapper = (fn: ControllerTFunction) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let session: ClientSession = await mongoose.startSession();
            try {
                session.startTransaction();
                await fn(req, res, session);
                await session.commitTransaction();
                session.endSession();
            } catch (err) {
                await session.abortTransaction();
                session.endSession();
                next(err);
            }
        } catch (err) {
            next(err);
        }
    };
};

export default expressTWrapper;
