import jwt from "jsonwebtoken";
import { IUser } from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "INSECURE_DEFAULT_JWT_SECRET_CHANGE_ME";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "INSECURE_DEFAULT_REFRESH_SECRET_CHANGE_ME";

if (JWT_SECRET === "INSECURE_DEFAULT_JWT_SECRET_CHANGE_ME") {
  console.warn("WARNING: JWT_SECRET environment variable is not set. Using insecure default.");
}
if (REFRESH_TOKEN_SECRET === "INSECURE_DEFAULT_REFRESH_SECRET_CHANGE_ME") {
  console.warn("WARNING: REFRESH_TOKEN_SECRET environment variable is not set. Using insecure default.");
}

interface TokenPayload {
  id: string;
  role: string;
}

export const generateTokens = (user: any): { accessToken: string; refreshToken: string } => {
  if (!user || !user._id || !user.role) {
    throw new Error("User object with _id and role is required to generate tokens");
  }

  const accessToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "2h",
  });

  const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
