import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";

export function validateRequest(schema: Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((detail) => detail.message);
            res.status(422).json({ errors });
			return;
        }
        next();
    };
}
