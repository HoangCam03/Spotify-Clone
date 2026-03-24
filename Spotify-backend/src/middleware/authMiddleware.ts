import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "INSECURE_DEFAULT_JWT_SECRET_CHANGE_ME";

interface UserPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    res.status(401).json({ status: "Error", message: "Authentication token required" });
    return;
  }

  jwt.verify(token, JWT_SECRET, async (err: any, userPayload: any) => {
    if (err) {
      res.status(403).json({ status: "Error", message: "Invalid or expired token" });
      return;
    }

    req.user = userPayload as UserPayload;
    next();
  });
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ status: "Error", message: "Admin access required" });
    return;
  }

  next();
};
