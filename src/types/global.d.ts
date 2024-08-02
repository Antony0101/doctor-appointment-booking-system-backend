import type { UserDocument } from "../models/user.model.ts";
declare global {
    namespace Express {
        export interface Request {
            auth?: {
                user: UserDocument;
                token: {
                    _id: string;
                    role: string;
                    tokenId: string;
                };
            };
        }
    }
}
