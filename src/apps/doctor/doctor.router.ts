import {
    getDoctorsController,
    updateDoctorController,
} from "./doctor.controller";
import { Router } from "express";
import { getDoctorsSchema, updateDoctorSchema } from "./doctor.validation";
import auth from "../../lib/middleware/auth.js";
import { authOptional } from "../../lib/middleware/auth.js";
import JoiQueryValidator from "../../lib/middleware/joiQueryValidator";
import expressWrapper from "../../lib/wrappers/expressWrapper";
import JoiValidator from "../../lib/middleware/joiValidator";

const doctorRouter = Router();

doctorRouter.get(
    "/",
    authOptional(),
    JoiQueryValidator(getDoctorsSchema),
    expressWrapper(getDoctorsController),
);

doctorRouter.put(
    "/:doctorId",
    auth(["admin", "doctor"]),
    JoiValidator(updateDoctorSchema),
    expressWrapper(updateDoctorController),
);

export default doctorRouter;
