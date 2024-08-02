import { generateAPIError } from "../errors/apiError.js";

import { Request, Response, NextFunction } from "express";

const arrayRegex = /\[([^\]]+)\]/;

function formatArrayString(
    data: string | string[] | undefined | null,
): string[] {
    const result = [] as string[];
    if (Array.isArray(data)) {
        for (const item of data) {
            let match = formatArrayString(item);
            result.push(...match);
        }
    } else {
        let match = arrayRegex.exec(data || "");
        if (match) {
            let data = match[1].split(",");
            data = data
                .filter((item) => item !== "")
                .map((item) => item.trim());
            result.push(...data);
        } else {
            data ? result.push(data) : null;
        }
    }
    return result;
}

const queryModifierMiddleware = (fields: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.query;
            for (const field of fields) {
                if (data[field] !== undefined) {
                    data[field] = formatArrayString(
                        data[field] as string | string[],
                    );
                }
            }
            req.query = data;
            next();
        } catch (error: any) {
            next(generateAPIError(error.message, 500));
        }
    };
};

export { formatArrayString };

export default queryModifierMiddleware;
