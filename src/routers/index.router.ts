import express from "express";
import authRouter from "../apps/auth/auth.router";

const indexRouter = express.Router();

indexRouter.use("/auth", authRouter);

export default indexRouter;
