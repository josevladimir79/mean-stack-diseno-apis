import type { Empleado, IEmployeeRepository } from "./IEmployeeRepository.ts";

import { EmpleadoModel } from "../models/empleado.ts";

export class MongooseEmployeeRepository implements IEmployeeRepository {
  async findAll(): Promise<Empleado[]> {
    return await EmpleadoModel.find();
  }

  async create(empleado: Empleado): Promise<Empleado> {
    const nuevoEmpleado = new EmpleadoModel(empleado);
    return await nuevoEmpleado.save();
  }

  async update(
    id: string,
    empleado: Partial<Empleado>,
  ): Promise<Empleado | null> {
    return await EmpleadoModel.findByIdAndUpdate(id, empleado, { new: true });
  }

  async delete(id: string): Promise<Empleado | null> {
    return await EmpleadoModel.findByIdAndDelete(id);
  }
}
