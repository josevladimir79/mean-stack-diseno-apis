import { Schema, model } from "mongoose";

export interface Empleado {
  id?: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const empleadoSchema = new Schema<Empleado>(
  {
    nombre: { type: String, required: true },
    cargo: { type: String, required: true },
    departamento: { type: String, required: true },
    sueldo: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const EmpleadoModel = model<Empleado>("Empleado", empleadoSchema);
