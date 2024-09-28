import { getUserByIdController, getUsersController } from "./user.controller";
import { Router } from "express";
import { getUsersSchema } from "./user.validation";
import auth from "../../lib/middleware/auth.js";
import JoiQueryValidator from "../../lib/middleware/joiQueryValidator";
import expressWrapper from "../../lib/wrappers/expressWrapper";
import JoiValidator from "../../lib/middleware/joiValidator";

const userRouter = Router();

userRouter.get(
    "/",
    auth("admin"),
    JoiQueryValidator(getUsersSchema),
    expressWrapper(getUsersController),
);

userRouter.get(
    "/:userId",
    auth("admin"),
    expressWrapper(getUserByIdController),
);

export default userRouter;
