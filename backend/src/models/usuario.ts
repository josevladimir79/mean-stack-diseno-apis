import { Schema, model } from "mongoose";

export interface Usuario {
  id?: string;
  nombre: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const usuarioSchema = new Schema<Usuario>(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UsuarioModel = model<Usuario>("Usuario", usuarioSchema);
