import UserModel from "../models/user.model";
import { hashPassword } from "../utils/bcrypt.utils";
import connectDB from "../utils/connectDB.utils";
import { USER_ROLE_ENUM } from "../utils/enums.utils";
import mongoose, { ClientSession } from "mongoose";

const addAdmin = async (session: ClientSession) => {
    const checkAdmin = await UserModel.findOne(
        { role: USER_ROLE_ENUM.ADMIN },
        {},
        { session },
    );
    if (checkAdmin) {
        console.log("Admin already exists");
        return;
    }
    const admin = new UserModel({
        email: "admin@sample.com",
        password: await hashPassword("Sample123!"),
        name: "Admin",
        role: USER_ROLE_ENUM.ADMIN,
    });
    await admin.save({ session });
    console.log("Admin added successfully");
};

const seedDb = async () => {
    await connectDB(process.env.MONGO_URI || "");
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        await addAdmin(session);
        await session.commitTransaction();
        await session.endSession();
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
};

seedDb()
    .then(() => {
        console.log("DB seeded successfully");
        process.exit(0);
    })
    .catch((err) => {
        console.log("Error seeding DB \n", err);
        process.exit(1);
    });
