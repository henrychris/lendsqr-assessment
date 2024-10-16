import { Request, Response, NextFunction } from "express";

export function extractUserIdFromToken(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ error: "Token not provided or invalid format." });
    }

    try {
        const token = authorization.split(" ")[1];
        const parts = token.split("-");

        if (parts.length !== 3) {
            return res.status(400).json({ error: "Invalid token format." });
        }

        const userId = parts[1];
        req.body.userId = userId;

        next();
    } catch (error) {
        console.error("Error extracting user ID from token:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
}
