import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { sendError } from "../utils/apiResponse.ts";
import { HttpError } from "../utils/httpError.ts";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
      campo: issue.path.join("."),
      mensaje: issue.message,
    }));
    sendError(res, 400, "Datos de entrada inválidos", errors);
    return;
  }

  if (err instanceof HttpError) {
    sendError(res, err.statusCode, err.message);
    return;
  }

  if (err instanceof SyntaxError && "body" in err) {
    sendError(res, 400, "El cuerpo de la petición no es un JSON válido");
    return;
  }

  console.error(err);
  sendError(res, 500, "Error interno del servidor");
};
