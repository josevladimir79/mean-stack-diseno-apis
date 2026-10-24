import { z } from "zod";

export const createUserSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio")
    .pipe(z.email("El email no es válido")),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[0-9]/, "La contraseña debe tener al menos un número")
    .regex(/[A-Z]/, "La contraseña debe tener al menos una mayúscula"),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
