import { Request, Response, NextFunction } from "express";

export function extractUserIdFromToken(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        res.status(401).json({
            error: "Token not provided or invalid format.",
        });
        return;
    }

    try {
        const token = authorization.split(" ")[1];
        const parts = token.split("-");

        if (parts.length !== 3) {
            res.status(400).json({ error: "Invalid token format." });
            return;
        }

        const userId = parts[1];
        req.userId = parseInt(userId, 10);

        next();
    } catch (error) {
        console.error("Error extracting user ID from token:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
}
