import UserModel from "../../models/user.model";
import { Request, Response } from "express";
import { removeSensitiveUserData } from "../auth/auth.service";
import { getAuthData } from "../../utils/auth.helper";
import { generateAPIError } from "../../lib/errors/apiError";
import {
    DoctorActionEnumType,
    UserStatusEnumType,
} from "../../utils/enums.utils";
import sendEmail from "../../utils/email.utils";
import {
    DoctorAccountRejectedEmailBody,
    DoctorAccountRejectedEmailSubject,
} from "../../utils/emails/doctorAccountRejected.email";
import {
    DoctorAccountApprovedEmailBody,
    DoctorAccountApprovedEmailSubject,
} from "../../utils/emails/doctorAccountApproved.email";

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

const getDoctorByIdController = async (req: Request, res: Response) => {
    const { doctorId } = req.params;
    const user = req.auth?.user;
    const query: any = {
        role: "doctor",
        _id: doctorId,
    };
    if (user?.role !== "admin") {
        query.accoutStatus = "active";
    }
    const doctor = await UserModel.findOne(query);
    if (!doctor) {
        throw generateAPIError("Doctor not found", 404);
    }
    return res.status(200).json({
        success: true,
        data: removeSensitiveUserData(doctor),
        message: "Doctor fetched successfully",
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

const actionsDoctorController = async (req: Request, res: Response) => {
    const { user } = getAuthData(req);
    const { doctorId } = req.params;
    const { action, data } = req.body as {
        action: DoctorActionEnumType;
        data: any;
    };
    if (user.role !== "admin") {
        throw generateAPIError("Unauthorized", 400);
    }
    const doctor = await UserModel.findById(doctorId);
    if (!doctor) {
        throw generateAPIError("Doctor not found", 404);
    }
    if (action === "accept") {
        if (doctor.accoutStatus === "profile_pending") {
            throw generateAPIError("Doctor profile is pending", 400);
        }
        doctor.accoutStatus = "active";
        await doctor.save();
        sendEmail({
            to: doctor.email,
            subject: DoctorAccountApprovedEmailSubject,
            text: DoctorAccountApprovedEmailBody(doctor.name),
        });
    } else if (action === "reject") {
        await UserModel.deleteOne({ _id: doctorId });
        sendEmail({
            to: doctor.email,
            subject: DoctorAccountRejectedEmailSubject,
            text: DoctorAccountRejectedEmailBody(doctor.name),
        });
    }
    return res.status(200).json({
        success: true,
        data: removeSensitiveUserData(doctor),
        message: "Doctor updated successfully",
    });
};

export {
    getDoctorsController,
    updateDoctorController,
    actionsDoctorController,
    getDoctorByIdController,
};
