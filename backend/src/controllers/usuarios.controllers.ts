import type { IRepository } from "../repositories/IRepository.ts";
import type { Usuario } from "../models/usuario.ts";
import type { Request, Response } from "express";
import type { CreateUserDTO } from "../dtos/user.dto.ts";
import { sendSuccess } from "../utils/apiResponse.ts";
import { hashPassword } from "../utils/password.ts";

export interface IUsuarioController {
  addUsuario: (
    req: Request<{}, unknown, CreateUserDTO>,
    res: Response,
  ) => Promise<void>;
}

export const usuarioController = (
  userRepository: IRepository<Usuario>,
): IUsuarioController => ({
  addUsuario: async (
    req: Request<{}, unknown, CreateUserDTO>,
    res: Response,
  ) => {
    const password = await hashPassword(req.body.password);
    const usuario = await userRepository.create({ ...req.body, password });
    sendSuccess(res, usuario, "Usuario guardado", 201);
  },
});
