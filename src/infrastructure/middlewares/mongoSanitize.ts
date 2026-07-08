import { Request, Response, NextFunction } from "express";

// Strips keys that could be interpreted as MongoDB query operators
// ($where, $gt, dotted paths like "a.b") from user-controlled input,
// preventing NoSQL operator injection.
const stripProhibitedKeys = (value: any): any => {
    if (Array.isArray(value)) {
        value.forEach(stripProhibitedKeys);
        return value;
    }
    if (value !== null && typeof value === "object") {
        for (const key of Object.keys(value)) {
            if (key.startsWith("$") || key.includes(".")) {
                delete value[key];
                continue;
            }
            stripProhibitedKeys(value[key]);
        }
    }
    return value;
};

export const mongoSanitize = (req: Request, _res: Response, next: NextFunction) => {
    if (req.body) stripProhibitedKeys(req.body);
    if (req.query) stripProhibitedKeys(req.query);
    if (req.params) stripProhibitedKeys(req.params);
    next();
};
