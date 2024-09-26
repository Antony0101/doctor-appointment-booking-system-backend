import mongoose from "mongoose";
import { ExtractDocument, ExtractEntity } from "../utils/mongoHelper.utils.js";
import { USER_ROLE_ENUM } from "../utils/enums.utils.js";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        // password: {
        //     type: String,
        //     required: true,
        // },
        otp: {
            type: String,
        },
        otpExpiry: {
            type: Date,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        phoneNo: {
            type: String,
        },
        // forgotUuid: String,
        // forgotUuidExpiry: Date,
        role: {
            type: String,
            required: true,
            enum: Object.values(USER_ROLE_ENUM),
        },
        tokenIds: [
            {
                _id: false,
                id: String,
                createdAt: Date,
            },
        ],
    },
    {
        timestamps: true,
    },
);

const UserModel = mongoose.model("users", userSchema);

export type UserEntity = ExtractEntity<typeof UserModel>;
export type UserDocument = ExtractDocument<typeof UserModel>;

export default UserModel;
