import { Router } from "express";
import { empleadoController } from "../controllers/empleados.controllers.ts";
import type { IRepository } from "../repositories/IRepository.ts";
import type { Empleado } from "../models/empleado.ts";
import {
  createEmployeeSchema,
  employeeIdParamsSchema,
  updateEmployeeSchema,
} from "../dtos/employee.dto.ts";
import { validate } from "../middlewares/validate.middleware.ts";

export const empleadosRoutes = (employeeRepository: IRepository<Empleado>) => {
  const controller = empleadoController(employeeRepository);
  return Router()
    .get("/", controller.getEmpleado)
    .post("/", validate({ body: createEmployeeSchema }), controller.addEmpleado)
    .put(
      "/:id",
      validate({ params: employeeIdParamsSchema, body: updateEmployeeSchema }),
      controller.updateEmpleado,
    )
    .delete(
      "/:id",
      validate({ params: employeeIdParamsSchema }),
      controller.deleteEmpleado,
    );
};
