import express from "express";
import authRouter from "../apps/auth/auth.router";
import doctorRouter from "../apps/doctor/doctor.router";

const indexRouter = express.Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/doctor", doctorRouter);

export default indexRouter;
