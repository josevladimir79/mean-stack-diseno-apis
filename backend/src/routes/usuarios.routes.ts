import { Router } from "express";
import { usuarioController } from "../controllers/usuarios.controllers.ts";
import type { IRepository } from "../repositories/IRepository.ts";
import type { Usuario } from "../models/usuario.ts";
import { createUserSchema } from "../dtos/user.dto.ts";
import { validate } from "../middlewares/validate.middleware.ts";

export const usuariosRoutes = (userRepository: IRepository<Usuario>) => {
  const controller = usuarioController(userRepository);
  return Router().post(
    "/",
    validate({ body: createUserSchema }),
    controller.addUsuario,
  );
};
