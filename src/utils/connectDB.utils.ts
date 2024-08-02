import mongoose, { ConnectOptions } from "mongoose";

// const connectDB = (mongo_uri: string) => {
//     // console.log(process.env.MONGOURL_PROD);
//     process.env.MONGO_URI;
//     mongoose.set("strictQuery", true);
//     mongoose
//         .connect(mongo_uri || "", {} as ConnectOptions)
//         .then(() => {
//             console.log("MongoDB Connected...");
//         })
//         .catch((err) => {
//             throw err;
//         });
// };

const connectDB = async (mongo_uri: string) => {
    // console.log(process.env.MONGOURL_PROD);
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongo_uri || "", {} as ConnectOptions);
    console.log("MongoDB Connected...");
};

// export { connectDBSync };

export default connectDB;
