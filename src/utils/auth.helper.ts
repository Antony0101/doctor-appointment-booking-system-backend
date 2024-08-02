import { Request } from "express";

function getAuthData(req: Request) {
    const auth = req.auth;
    if (!auth) {
        throw new Error(
            "this controller should only be used with auth middleware",
        );
    }
    return auth;
}

export { getAuthData };
