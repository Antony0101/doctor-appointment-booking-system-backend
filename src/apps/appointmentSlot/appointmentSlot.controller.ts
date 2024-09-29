import { Request, Response } from "express";
import UserModel from "../../models/user.model";
import { generateAPIError } from "../../lib/errors/apiError";
import AvailabilityModel from "../../models/availability.model";
import AppointmentModel from "../../models/appointment.model";

const dayMilli = 24 * 60 * 60 * 1000;

const daysofWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
] as const;

const getAppointmentSlotsByDoctorId = async (req: Request, res: Response) => {
    const { doctorId, dateString } = req.params;
    const doctor = await UserModel.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
        throw generateAPIError("Doctor not found", 404);
    }
    let availablitity = await AvailabilityModel.findOne({ doctorId });
    if (!availablitity) {
        return res.status(200).json({
            success: true,
            data: [],
            message: "No slots available",
        });
    }
    const date = new Date(dateString);
    if (availablitity.availableFrom > date) {
        return res.status(200).json({
            success: true,
            data: [],
            message: "No slots available",
        });
    }
    const day = daysofWeek[date.getDay()];
    const dayAvailability = availablitity[day];
    if (!dayAvailability.available) {
        return res.status(200).json({
            success: true,
            data: [],
            message: "No slots available",
        });
    }
    let previousendtime: Date | null = null; // to fix edge case of endtime of one slot being start time of next slot
    const availableSlotsUpper = dayAvailability.timeSlots.map((slot) => {
        const startTime = new Date(slot.startTime);
        const endTime = new Date(slot.endTime);
        const realEndTime = new Date(endTime.getTime() - 28 * 60 * 1000); // 30 min but to give some breathing space its 28 min
        const curSlots = [];
        if (previousendtime) {
            if (previousendtime.getTime() === startTime.getTime()) {
                curSlots.push(
                    new Date(
                        previousendtime.setMinutes(
                            previousendtime.getMinutes() - 15,
                        ),
                    ),
                );
            }
        }
        previousendtime = new Date(endTime);
        for (
            const i = startTime;
            i <= realEndTime;
            i.setMinutes(i.getMinutes() + 15)
        ) {
            curSlots.push(new Date(i));
        }
        return curSlots;
    });
    const availableSlots = availableSlotsUpper.flat();
    const endDate = new Date(date.getTime() + dayMilli);
    const slots = await AppointmentModel.find({
        doctorId,
        startDateTime: {
            $gte: date,
            $lt: endDate,
        },
    }).sort({ startDateTime: 1 });
    const blocklist = slots.map((slot) => {
        // as per current requirement all blockers are 30 min long so we handle it staticaly
        const startTime = new Date(0);
        startTime.setHours(
            slot.startDateTime.getHours(),
            slot.startDateTime.getMinutes(),
        );
        const nextTime = new Date(startTime.getTime() + 15 * 60 * 1000);
        const previousTime = new Date(startTime.getTime() - 15 * 60 * 1000);
        return [previousTime, startTime, nextTime];
    });
    const blocklistFlat = blocklist.flat();
    const filteredSlots = availableSlots.filter((slot) => {
        for (const block of blocklistFlat) {
            if (slot.getTime() === block.getTime()) {
                return false;
            }
        }
        return true;
    });
    return res.status(200).json({
        success: true,
        data: filteredSlots,
        message: "Appointment slots fetched successfully",
    });
};
