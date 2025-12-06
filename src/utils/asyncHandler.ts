import { Request, Response, NextFunction, RequestHandler } from "express";
import { serverError } from "./responseHandler";

export const asyncHandler = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      return serverError(res, error);
    }
  };
};
