import mongoose from "mongoose";
import { ExtractDocument, ExtractEntity } from "../utils/mongoHelper.utils.js";
import {
    APPOINTMENT_STATUS_ENUM,
    APPOINTMENT_TYPE_ENUM,
} from "../utils/enums.utils.js";

const appointmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        startDateTime: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        appointmentType: {
            type: String,
            required: true,
            enum: Object.values(APPOINTMENT_TYPE_ENUM),
        },
        appointmentNote: {
            noteText: {
                type: String,
            },
            noteFile: {
                fileName: {
                    type: String,
                },
                fileUrl: {
                    type: String,
                },
            },
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(APPOINTMENT_STATUS_ENUM),
        },
    },
    {
        timestamps: true,
    },
);

const AppointmentModel = mongoose.model("appointments", appointmentSchema);

export type AppointmentEntity = ExtractEntity<typeof AppointmentModel>;
export type AppointmentDocument = ExtractDocument<typeof AppointmentModel>;

export default AppointmentModel;
