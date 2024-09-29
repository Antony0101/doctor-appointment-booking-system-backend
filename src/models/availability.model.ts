import mongoose from "mongoose";
import { ExtractDocument, ExtractEntity } from "../utils/mongoHelper.utils.js";

const availabilityObject = {
    available: Boolean,
    timeSlots: [
        {
            _id: false,
            startTime: {
                type: Date,
                required: true,
            },
            endTime: {
                type: Date,
                required: true,
            },
        },
    ],
};

const availabilitySchema = new mongoose.Schema(
    {
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true,
        },
        availableFrom: {
            type: Date,
            required: true,
        },
        monday: {
            type: availabilityObject,
            required: true,
        },
        tuesday: {
            type: availabilityObject,
            required: true,
        },
        wednesday: {
            type: availabilityObject,
            required: true,
        },
        thursday: {
            type: availabilityObject,
            required: true,
        },
        friday: {
            type: availabilityObject,
            required: true,
        },
        saturday: {
            type: availabilityObject,
            required: true,
        },
        sunday: {
            type: availabilityObject,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const AvailabilityModel = mongoose.model("availability", availabilitySchema);

export type AvailabilityEntity = ExtractEntity<typeof AvailabilityModel>;
export type AvailabilityDocument = ExtractDocument<typeof AvailabilityModel>;

export default AvailabilityModel;
