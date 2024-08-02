import {
    loginController,
    currentUserController,
    forgotPasswordEndController,
    forgotPasswordStartController,
    logoutController,
    signUpController,
} from "./auth.controller.js";
import JoiValidator from "../../lib/middleware/joiValidator.js";
import {
    loginSchema,
    forgotPasswordCompleteSchema,
    forgotPasswordStartSchema,
    signupSchema,
} from "./auth.validation.js";
import express from "express";
import expressWrapper from "../../lib/wrappers/expressWrapper.js";
import auth from "../../lib/middleware/auth.js";
import expressTWrapper from "../../lib/wrappers/expressTWrapper.js";

const authRouter = express.Router();

authRouter.post(
    "/login",
    JoiValidator(loginSchema),
    expressWrapper(loginController),
);
authRouter.post(
    "/signup",
    JoiValidator(signupSchema),
    expressTWrapper(signUpController),
);
authRouter.get("/me", auth("all"), expressWrapper(currentUserController));
authRouter.post(
    "/forgot-password",
    JoiValidator(forgotPasswordStartSchema),
    expressWrapper(forgotPasswordStartController),
);
authRouter.post(
    "/forgot-password-complete",
    JoiValidator(forgotPasswordCompleteSchema),
    expressWrapper(forgotPasswordEndController),
);
authRouter.delete("/logout", auth("all"), expressWrapper(logoutController));

export default authRouter;
