import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../utils/httpError.ts";

export const authenticate: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    throw new HttpError(401, "Token no proporcionado");

  const secret = process.env.JWT_SECRET;
  if (!secret)
    throw new Error("No se especificó la variable de entorno JWT_SECRET");

  const token = header.slice("Bearer ".length);
  try {
    res.locals.usuario = jwt.verify(token, secret);
  } catch {
    throw new HttpError(401, "Token inválido o expirado");
  }
  next();
};
