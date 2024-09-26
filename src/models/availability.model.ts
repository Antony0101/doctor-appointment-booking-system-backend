import mongoose from "mongoose";
import { ExtractDocument, ExtractEntity } from "../utils/mongoHelper.utils.js";

const availabilityObject = {
    available: Boolean,
    timeSlots: [
        {
            _id: false,
            startTime: Date,
            endTime: Date,
        },
    ],
};

const availabilitySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true,
        },
        availableFrom: Date,
        monday: availabilityObject,
        tuesday: availabilityObject,
        wednesday: availabilityObject,
        thursday: availabilityObject,
        friday: availabilityObject,
        saturday: availabilityObject,
        sunday: availabilityObject,
    },
    {
        timestamps: true,
    },
);

const AvailabilityModel = mongoose.model("availability", availabilitySchema);

export type AvailabilityEntity = ExtractEntity<typeof AvailabilityModel>;
export type AvailabilityDocument = ExtractDocument<typeof AvailabilityModel>;

export default AvailabilityModel;
