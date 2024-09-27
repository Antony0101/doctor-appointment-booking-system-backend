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
import { ClientSession } from "mongoose";
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
        user = await UserModel.create({
            email,
            role,
            name: email,
            otp: "123456",
            otpExpiry: new Date(Date.now() - 1000),
            accoutStatus: "pending",
        });
    }

    if (user.role !== role) {
        throw generateAPIError("Role is incorrect", 404);
    }

    console.log("otp", otp);
    user.otp = await hashPassword(otp);
    user.otpExpiry = new Date(Date.now() + 1000 * 60 * 5);
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

// async function signUpController(
//     req: Request,
//     res: Response,
//     session: ClientSession,
// ) {
//     const { email, password, firstName, lastName, phoneNo } = req.body;

//     const user = await UserModel.findOne({ email });
//     if (user) {
//         throw generateAPIError("User already exist", 404);
//     }

//     const hashedPassword = await hashPassword(password);

//     const newUser = (
//         await UserModel.create(
//             [
//                 {
//                     email,
//                     password: hashedPassword,
//                     firstName,
//                     lastName,
//                     role: USER_ROLE_ENUM.USER,
//                     phoneNo,
//                 },
//             ],
//             { session },
//         )
//     )[0];

//     const tokenId = uuidV4();
//     await UserModel.updateOne(
//         { _id: newUser._id },
//         {
//             $push: {
//                 tokenIds: {
//                     $each: [{ id: tokenId, createdAt: new Date() }],
//                     $sort: { createdAt: 1 },
//                     $slice: -10,
//                 },
//             },
//         },
//         {
//             session,
//         },
//     );

//     const jwtSecret = process.env.JWT_SECRET || "sample";
//     const token = jwt.sign(
//         { _id: newUser._id, role: newUser.role, tokenId },
//         jwtSecret,
//         {
//             expiresIn: "10d",
//         },
//     );

//     const userDetails = removeSensitiveUserData(newUser);

//     return res.status(200).json({
//         success: true,
//         data: { user: userDetails, token },
//         message: "Signup success",
//     });
// }

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

// async function forgotPasswordStartController(req: Request, res: Response) {
//     const { email } = req.body;
//     const user = await UserModel.findOne({ email });
//     if (!user) {
//         throw generateAPIError("No user exist with this email", 404);
//     }
//     // generate forgotUuid and forgotUuidExpiry
//     const forgotUuid = uuidV4();
//     const forgotUuidExpiry = new Date(Date.now() + 1000 * 60 * 60);
//     user.forgotUuid = forgotUuid;
//     user.forgotUuidExpiry = forgotUuidExpiry;
//     await user.save();
//     // send email with forgotUuid
//     const origin = req.get("origin") || "http://localhost:3000";
//     const resetUrl = `${origin}/change-password?email=${email}&forgotUuid=${forgotUuid}`;
//     sendEmail({
//         to: email,
//         subject: forgotPasswordSubject,
//         text: forgotPasswordBody(resetUrl),
//     });
//     return res.status(200).json({
//         success: true,
//         message: "Forgot password initiated successfully",
//     });
// }

// async function forgotPasswordEndController(req: Request, res: Response) {
//     const { email, forgotUuid, password } = req.body;
//     const user = await UserModel.findOne({
//         email: email,
//         forgotUuid: forgotUuid,
//     });
//     if (!user) {
//         throw generateAPIError("Link has expired.", 403);
//     }
//     if (!user.forgotUuidExpiry) {
//         throw generateAPIError("Link has expired.", 403);
//     }
//     if (user.forgotUuidExpiry < new Date()) {
//         throw generateAPIError("Link has expired", 403);
//     }
//     user.password = await hashPassword(password);
//     user.forgotUuid = null;
//     user.forgotUuidExpiry = null;
//     await user.save();
//     return res.status(200).json({
//         success: true,
//         message: "Password updated successfully",
//     });
// }

export {
    loginStartController,
    loginController,
    currentUserController,
    logoutController,
};
