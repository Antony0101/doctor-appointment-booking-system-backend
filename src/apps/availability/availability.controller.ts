import { Request, Response } from "express";
import UserModel from "../../models/user.model";
import { generateAPIError } from "../../lib/errors/apiError";
import AvailabilityModel from "../../models/availability.model";
import { getAuthData } from "../../utils/auth.helper";

const getAvailabilityByDoctorId = async (req: Request, res: Response) => {
    const { user } = getAuthData(req);
    const doctorId = req.params.doctorId;
    if (user.role !== "admin" && user._id.toString() !== doctorId) {
        throw generateAPIError("Unauthorized", 400);
    }
    const doctor = await UserModel.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
        throw generateAPIError("Doctor not found", 404);
    }
    if (doctor.accoutStatus !== "active") {
        throw generateAPIError("Doctor account is not active", 400);
    }
    let availability = await AvailabilityModel.findOne({ doctorId });
    if (!availability) {
        const sampleSlotObject = {
            available: false,
            timeSlots: [],
        };
        availability = await AvailabilityModel.create({
            doctorId,
            availableFrom: new Date(),
            sunday: sampleSlotObject,
            monday: sampleSlotObject,
            tuesday: sampleSlotObject,
            wednesday: sampleSlotObject,
            thursday: sampleSlotObject,
            friday: sampleSlotObject,
            saturday: sampleSlotObject,
        });
    }
    return res.status(200).json({
        success: true,
        data: availability,
        message: "Availability fetched successfully",
    });
};

const updateAvailabilityByDoctorId = async (req: Request, res: Response) => {
    const { user } = getAuthData(req);
    const doctorId = req.params.doctorId;
    if (user.role !== "admin" && user._id.toString() !== doctorId) {
        throw generateAPIError("Unauthorized", 400);
    }
    const doctor = await UserModel.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
        throw generateAPIError("Doctor not found", 404);
    }
    if (doctor.accoutStatus !== "active") {
        throw generateAPIError("Doctor account is not active", 400);
    }
    const {
        availableFrom,
        sunday,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
    } = req.body;
    const availability = await AvailabilityModel.findOne({ doctorId });
    if (!availability) {
        throw generateAPIError("Availability not found", 404);
    }
    availability.sunday = sunday;
    availability.monday = monday;
    availability.tuesday = tuesday;
    availability.wednesday = wednesday;
    availability.thursday = thursday;
    availability.friday = friday;
    availability.saturday = saturday;
    availability.availableFrom = availableFrom;
    await availability.save();
    return res.status(200).json({
        success: true,
        data: availability,
        message: "Availability updated successfully",
    });
};

export { getAvailabilityByDoctorId, updateAvailabilityByDoctorId };
