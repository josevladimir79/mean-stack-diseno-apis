import type { Response } from "express";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: unknown;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string,
  statusCode = 200,
) => {
  const body: ApiResponse<T> = { success: true, message, data, errors: null };
  res.status(statusCode).json(body);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors: unknown = null,
) => {
  const body: ApiResponse<null> = {
    success: false,
    message,
    data: null,
    errors,
  };
  res.status(statusCode).json(body);
};
