import { Response } from "express";

// 200 series
const okResponse = (res: Response, message: string, data?: any) => {
  res.status(200).json({
    success: true,
    message: message,
    data: data,
  });
};

const postSuccessful = (res: Response, message: string, data?: any) => {
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: data,
  });
};

// 400 series
const badRequest = (res: Response) => {
  res.status(400).json({
    success: false,
    message: "Provide valid input",
  });
};

const notFound = (res: Response, resource: string) => {
  res.status(404).json({
    success: false,
    message: `${resource} not found`,
  });
};

// 500
const serverError = (res: Response, err: any) => {
  console.log("SERVER ERROR", err.message);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export { postSuccessful, okResponse, notFound, badRequest, serverError };
