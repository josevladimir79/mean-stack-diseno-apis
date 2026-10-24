import type { IRepository } from "../repositories/IRepository.ts";
import type { Usuario } from "../models/usuario.ts";
import type { Request, Response } from "express";
import type { LoginDTO } from "../dtos/auth.dto.ts";
import jwt from "jsonwebtoken";
import { sendSuccess } from "../utils/apiResponse.ts";
import { HttpError } from "../utils/httpError.ts";
import { comparePassword } from "../utils/password.ts";

export interface IAuthController {
  login: (
    req: Request<{}, unknown, LoginDTO>,
    res: Response,
  ) => Promise<void>;
}

export const authController = (
  userRepository: IRepository<Usuario>,
): IAuthController => ({
  login: async (req: Request<{}, unknown, LoginDTO>, res: Response) => {
    const { email, password } = req.body;

    const usuario = await userRepository.getBy("email", email);
    if (!usuario) throw new HttpError(401, "Credenciales inválidas");

    const passwordValida = await comparePassword(password, usuario.password);
    if (!passwordValida) throw new HttpError(401, "Credenciales inválidas");

    const secret = process.env.JWT_SECRET;
    if (!secret)
      throw new Error("No se especificó la variable de entorno JWT_SECRET");

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, secret, {
      expiresIn: "1h",
    });
    sendSuccess(res, { token }, "Login exitoso");
  },
});
