import { Router } from "express";
import { authController } from "../controllers/auth.controllers.ts";
import type { IRepository } from "../repositories/IRepository.ts";
import type { Usuario } from "../models/usuario.ts";
import { loginSchema } from "../dtos/auth.dto.ts";
import { validate } from "../middlewares/validate.middleware.ts";

export const authRoutes = (userRepository: IRepository<Usuario>) => {
  const controller = authController(userRepository);
  return Router().post(
    "/login",
    validate({ body: loginSchema }),
    controller.login,
  );
};
