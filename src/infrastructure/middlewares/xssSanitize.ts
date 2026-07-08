import { Request, Response, NextFunction } from "express";
import xss from "xss";

const sanitizeValue = (value: any): any => {
    if (typeof value === "string") {
        return xss(value);
    }
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            value[i] = sanitizeValue(value[i]);
        }
        return value;
    }
    if (value !== null && typeof value === "object") {
        for (const key of Object.keys(value)) {
            value[key] = sanitizeValue(value[key]);
        }
        return value;
    }
    return value;
};

export const xssSanitize = (req: Request, _res: Response, next: NextFunction) => {
    if (req.body) req.body = sanitizeValue(req.body);
    if (req.query) sanitizeValue(req.query);
    if (req.params) sanitizeValue(req.params);
    next();
};
