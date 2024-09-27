import UserModel from "../../models/user.model";
import { Request, Response } from "express";
import { removeSensitiveUserData } from "../auth/auth.service";
import { getAuthData } from "../../utils/auth.helper";
import { generateAPIError } from "../../lib/errors/apiError";
import { UserStatusEnumType } from "../../utils/enums.utils";

const getDoctorsController = async (req: Request, res: Response) => {
    const { user } = getAuthData(req);
    let { search, status, page, limit } = req.query as unknown as {
        search?: string;
        status?: UserStatusEnumType;
        page: number;
        limit: number;
    };
    if (user.role !== "admin") {
        status = "active";
    }
    let query: any = {};
    if (search) {
        query.name = { $regex: search, $options: "i" };
    }
    if (status) {
        query.accoutStatus = status;
    }
    const totalCountPromise = UserModel.countDocuments({
        role: "doctor",
        ...query,
    });
    const doctorsPromise = UserModel.find({ role: "doctor", ...query })
        .skip((page - 1) * limit)
        .limit(limit);
    const [totalCount, doctors] = await Promise.all([
        totalCountPromise,
        doctorsPromise,
    ]);
    const cleanedData = doctors.map((doctor) => {
        return removeSensitiveUserData(doctor);
    });
    return res.status(200).json({
        success: true,
        data: cleanedData,
        message: "Doctors fetched successfully",
        count: totalCount,
        page,
        limit,
    });
};

const updateDoctorController = async (req: Request, res: Response) => {
    const { user } = getAuthData(req);
    const { doctorId } = req.params;
    if (user.role === "doctor") {
        if (user._id.toString() !== doctorId) {
            throw generateAPIError("Unauthorized", 400);
        }
    }
    const { name, clinicName, location } = req.body;
    const doctor = await UserModel.findById(doctorId);
    if (!doctor) {
        throw generateAPIError("Doctor not found", 404);
    }
    doctor.name = name;
    doctor.doctorDetails = { clinicName, location };
    if (doctor.accoutStatus === "profile_pending") {
        doctor.accoutStatus = "pending";
    }
    await doctor.save();
    return res.status(200).json({
        success: true,
        data: removeSensitiveUserData(doctor),
        message: "Doctor updated successfully",
    });
};

export { getDoctorsController, updateDoctorController };
