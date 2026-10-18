export interface Empleado {
  id?: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEmployeeRepository {
  findAll(): Promise<Empleado[]>;
  create(empleado: Empleado): Promise<Empleado>;
  update(id: string, empleado: Partial<Empleado>): Promise<Empleado | null>;
  delete(id: string): Promise<Empleado | null>;
}
