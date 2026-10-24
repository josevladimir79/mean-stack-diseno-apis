import type { IRepository } from "../repositories/IRepository.ts";
import type { Empleado } from "../models/empleado.ts";
import type { Request, Response } from "express";
import type {
  CreateEmployeeDTO,
  EmployeeIdParams,
  UpdateEmployeeDTO,
} from "../dtos/employee.dto.ts";
import { sendSuccess } from "../utils/apiResponse.ts";
import { HttpError } from "../utils/httpError.ts";

export interface IEmpleadoController {
  getEmpleado: (req: Request, res: Response) => Promise<void>;
  addEmpleado: (
    req: Request<{}, unknown, CreateEmployeeDTO>,
    res: Response,
  ) => Promise<void>;
  updateEmpleado: (
    req: Request<EmployeeIdParams, unknown, UpdateEmployeeDTO>,
    res: Response,
  ) => Promise<void>;
  deleteEmpleado: (
    req: Request<EmployeeIdParams>,
    res: Response,
  ) => Promise<void>;
}

export const empleadoController = (
  employeeRepository: IRepository<Empleado>,
): IEmpleadoController => ({
  getEmpleado: async (req: Request, res: Response) => {
    const empleados = await employeeRepository.findAll();
    sendSuccess(res, empleados, "Empleados obtenidos");
  },

  addEmpleado: async (
    req: Request<{}, unknown, CreateEmployeeDTO>,
    res: Response,
  ) => {
    const empleado = await employeeRepository.create(req.body);
    sendSuccess(res, empleado, "Empleado guardado", 201);
  },

  updateEmpleado: async (
    req: Request<EmployeeIdParams, unknown, UpdateEmployeeDTO>,
    res: Response,
  ) => {
    const { id } = req.params;
    const empleado = await employeeRepository.update(id, req.body);
    if (!empleado) throw new HttpError(404, "Empleado no encontrado");
    sendSuccess(res, empleado, "Empleado actualizado");
  },

  deleteEmpleado: async (req: Request<EmployeeIdParams>, res: Response) => {
    const { id } = req.params;
    const empleado = await employeeRepository.delete(id);
    if (!empleado) throw new HttpError(404, "Empleado no encontrado");
    sendSuccess(res, empleado, "Empleado eliminado");
  },
});
