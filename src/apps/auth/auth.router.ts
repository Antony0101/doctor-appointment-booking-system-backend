import {
    loginController,
    currentUserController,
    loginStartController,
    logoutController,
} from "./auth.controller.js";
import JoiValidator from "../../lib/middleware/joiValidator.js";
import { loginSchema, loginStartSchema } from "./auth.validation.js";
import express from "express";
import expressWrapper from "../../lib/wrappers/expressWrapper.js";
import auth from "../../lib/middleware/auth.js";
import expressTWrapper from "../../lib/wrappers/expressTWrapper.js";

const authRouter = express.Router();

authRouter.post(
    "/login-start",
    JoiValidator(loginStartSchema),
    expressWrapper(loginStartController),
);
authRouter.post(
    "/login",
    JoiValidator(loginSchema),
    expressTWrapper(loginController),
);
authRouter.get("/me", auth("all"), expressWrapper(currentUserController));
authRouter.delete("/logout", auth("all"), expressWrapper(logoutController));

export default authRouter;
