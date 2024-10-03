import express from "express";
import { JwtPayload } from "jsonwebtoken";
import { UserToken } from "./user";

declare global {
  namespace Express {
    interface Request {
      user: UserToken | JwtPayload;
    }
  }
}
