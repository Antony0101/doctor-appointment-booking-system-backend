import express from "express";

import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { xss } from "express-xss-sanitizer";
import mongoSanitize from "express-mongo-sanitize";
import notFoundMiddleware from "./lib/middleware/not-found.js";
import errorHandler from "./lib/middleware/errorHandler.js";
import indexRouter from "./routers/index.router.js";
import connectDB from "./utils/connectDB.utils.js";
import { generalVersions } from "./config/versions.js";
import mongoose from "mongoose";

const app = express();

connectDB(process.env.MONGO_URI || "");

// init();
// cors
const corsEnvList = process.env.CORS ? process.env.CORS.split(",") : [];
const whitelist = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3001",
    "http://localhost:3001",
    ...corsEnvList,
];
console.log("cors:", whitelist);
const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if (!origin) {
            // for mobile app and postman client
            // console.log("origin is null");
            return callback(null, true);
        }
        if (whitelist.indexOf(origin) !== -1) {
            // console.log("allowed by CORS");
            callback(null, true);
        } else {
            // console.log("Not allowed by CORS");
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, //access-control-allow-credentials:true
    optionsSuccessStatus: 204,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "HEAD"],
    allowedHeaders: "*",
    // exposedHeaders: "*",
};

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cors(corsOptions));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());

console.log("NODE_ENV:", process.env.NODE_ENV);

app.get("/", (req, res) =>
    res.status(200).json({
        server: "running",
        app: generalVersions.app,
    }),
);
app.use("/api/v1", indexRouter);

app.use(notFoundMiddleware);
app.use(errorHandler);
const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
    console.log(`listening on http://127.0.0.1:${port}`),
);

process.on("SIGTERM", function () {
    server.close(function () {
        console.log("\x1b[33m SIGTERM: closing server \x1b[0m");
        mongoose.connection.close(false);
        console.log("\x1b[33m SIGTERM: closing mongoose connection \x1b[0m");
    });
    // console.log(process._getActiveHandles().length);
    // console.log(process._getActiveRequests());

    console.log("\x1b[33m SIGTERM: shutting down... \x1b[0m");
});
