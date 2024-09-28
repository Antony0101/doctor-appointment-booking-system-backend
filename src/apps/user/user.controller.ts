import { Request, Response } from "express";

import { removeSensitiveUserData } from "../auth/auth.service";
import { UserStatusEnumType } from "../../utils/enums.utils";
import UserModel from "../../models/user.model";
import { generateAPIError } from "../../lib/errors/apiError";

const getUsersController = async (req: Request, res: Response) => {
    let { search, status, page, limit } = req.query as unknown as {
        search?: string;
        status?: UserStatusEnumType;
        page: number;
        limit: number;
    };

    let query: any = {};
    if (search) {
        query.name = { $regex: search, $options: "i" };
    }
    if (status) {
        query.accoutStatus = status;
    }
    const totalCountPromise = UserModel.countDocuments({
        role: "user",
        ...query,
    });
    const userPromise = UserModel.find({ role: "user", ...query })
        .skip((page - 1) * limit)
        .limit(limit);
    const [totalCount, users] = await Promise.all([
        totalCountPromise,
        userPromise,
    ]);
    const cleanedData = users.map((user) => {
        return removeSensitiveUserData(user);
    });
    return res.status(200).json({
        success: true,
        data: cleanedData,
        message: "Users fetched successfully",
        count: totalCount,
        page,
        limit,
    });
};

const getUserByIdController = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await UserModel.findById({ _id: userId, role: "user" });
    if (!user) {
        throw generateAPIError("User not found", 404);
    }
    return res.status(200).json({
        success: true,
        data: removeSensitiveUserData(user),
        message: "User fetched successfully",
    });
};

export { getUsersController, getUserByIdController };
