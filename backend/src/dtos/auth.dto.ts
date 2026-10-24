import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio")
    .pipe(z.email("El email no es válido")),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type LoginDTO = z.infer<typeof loginSchema>;
