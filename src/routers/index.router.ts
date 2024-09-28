import express from "express";
import authRouter from "../apps/auth/auth.router";
import doctorRouter from "../apps/doctor/doctor.router";
import userRouter from "../apps/user/user.router";

const indexRouter = express.Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/doctors", doctorRouter);
indexRouter.use("/users", userRouter);

export default indexRouter;
