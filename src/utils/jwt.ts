import jwt from "jsonwebtoken";
import type { UserToken } from "../types/user";

export const generateAccessToken = (user: UserToken) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "50m",
  });
};

export const generateRefreshToken = (user: UserToken) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "1d",
  });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch (error) {
    return null;
  }
};
