import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import {
  forbiddenRequest,
  unauthorizedRequest,
} from "../utils/responseHandler";
import { asyncHandler } from "../utils/asyncHandler";

const auth = (allowedRoles: string[]) => {
  return asyncHandler((req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return unauthorizedRequest(res, "token");
    }

    const token = authHeader?.split(" ")[1];

    const decoded = jwt.verify(
      token!,
      config.jwt_secret as string,
    ) as JwtPayload;
    
    req.user = decoded;

    if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
      if (allowedRoles.includes("own")) {
        // self updation part
        // cant think of the logic yet, kept for later
        // next();
      }
      return forbiddenRequest(res);
    }
    next();
  });
};

export default auth;
