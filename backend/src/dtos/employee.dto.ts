import { z } from "zod";

export const createEmployeeSchema = z.object({
  nombre: z.string().trim().min(3, "El nombre es obligatorio"),
  cargo: z.string().trim().min(3, "El cargo es obligatorio"),
  departamento: z.string().trim().min(1, "El departamento es obligatorio"),
  sueldo: z.number().positive("El sueldo debe ser mayor a 0"),
});

const { nombre, cargo, departamento, sueldo } = createEmployeeSchema.shape;

export const updateEmployeeSchema = z
  .object({
    nombre: nombre.exactOptional(),
    cargo: cargo.exactOptional(),
    departamento: departamento.exactOptional(),
    sueldo: sueldo.exactOptional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para actualizar",
  });

export const employeeIdParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "El id no tiene un formato válido"),
});

export type CreateEmployeeDTO = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeDTO = z.infer<typeof updateEmployeeSchema>;
export type EmployeeIdParams = z.infer<typeof employeeIdParamsSchema>;
