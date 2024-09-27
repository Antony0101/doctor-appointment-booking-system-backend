import { generateAPIError } from "../../lib/errors/apiError.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";
import { removeSensitiveUserData } from "./auth.service.js";
import { comparePassword, hashPassword } from "../../utils/bcrypt.utils.js";
import { getAuthData } from "../../utils/auth.helper.js";
import sendEmail from "../../utils/email.utils.js";
import {
    LoginOtpEmailBody,
    LoginOtpEmailSubject,
} from "../../utils/emails/loginOtp.email.js";
import UserModel from "../../models/user.model.js";
import { USER_ROLE_ENUM, UserRoleEnumType } from "../../utils/enums.utils.js";

async function loginStartController(req: Request, res: Response) {
    const { email, role } = req.body as {
        email: string;
        role: UserRoleEnumType;
    };
    let user = await UserModel.findOne({ email });

    const otp = [1, 2, 3, 4, 5, 6]
        .map(() => Math.floor(Math.random() * 10))
        .join("");
    if (!user) {
        if (role === "admin") {
            throw generateAPIError("email is not a admin", 400);
        }
        user = await UserModel.create({
            email,
            role,
            name: "default name",
            otp: "123456",
            otpExpiry: new Date(Date.now() - 1000),
            accoutStatus:
                role === USER_ROLE_ENUM.DOCTOR ? "profile_pending" : "active",
        });
    }

    if (user.role !== role) {
        throw generateAPIError("Role is incorrect", 404);
    }

    console.log("otp", otp);
    user.otp = await hashPassword(otp);
    user.otpExpiry = new Date(Date.now() + 1000 * 60 * 5);
    if (user.role === USER_ROLE_ENUM.ADMIN) {
    }
    await user.save();
    sendEmail({
        to: email,
        subject: LoginOtpEmailSubject,
        text: LoginOtpEmailBody(otp),
    });

    return res.status(200).json({
        success: true,
        data: null,
        message: "Login OTP sent successfully",
    });
}

async function loginController(req: Request, res: Response) {
    const { email, otp, role } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
        throw generateAPIError("Email or OTP is incorrect", 404);
    }

    if (user.otpExpiry < new Date()) {
        throw generateAPIError("OTP has expired", 404);
    }

    if (user.role !== role) {
        throw generateAPIError("Role is incorrect", 404);
    }

    if (user.otp === null || user.otp === undefined) {
        console.log(
            "Unexpected server error:: OTP in user is null or undefined --- user._id = ",
            user._id,
        );
        throw generateAPIError("OTP is incorrect", 404);
    }

    const isOtpMatch = await comparePassword(otp, user.otp);
    if (!isOtpMatch) {
        throw generateAPIError("OTP has expired", 404);
    }

    const tokenId = uuidV4();
    await UserModel.updateOne(
        { _id: user._id },
        {
            $push: {
                tokenIds: {
                    $each: [{ id: tokenId, createdAt: new Date() }],
                    $sort: { createdAt: 1 },
                    $slice: -10,
                },
            },
        },
    );

    const jwtSecret = process.env.JWT_SECRET || "sample";
    const token = jwt.sign(
        { _id: user._id, role: user.role, tokenId },
        jwtSecret,
        {
            expiresIn: "10d",
        },
    );

    const userDetails = removeSensitiveUserData(user);

    return res.status(200).json({
        success: true,
        data: { user: userDetails, token },
        message: "Login success",
    });
}

async function currentUserController(req: Request, res: Response) {
    const { user } = getAuthData(req);
    const userDetails = removeSensitiveUserData(user);
    return res.status(200).json({
        success: true,
        data: userDetails,
        message: "User details fetched successfully",
    });
}

async function logoutController(req: Request, res: Response) {
    const { user, token } = getAuthData(req);
    const tokenId = token.tokenId;
    await UserModel.updateOne(
        { _id: user._id },
        {
            $pull: { tokenIds: { id: tokenId } },
        },
    );
    return res.status(200).json({
        success: true,
        message: "Logout success",
    });
}

export {
    loginStartController,
    loginController,
    currentUserController,
    logoutController,
};
