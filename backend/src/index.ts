import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDatabase } from "./config/database.ts";
import dotenv from "dotenv";
import { empleadosRoutes } from "./routes/empleados.routes.ts";
import { usuariosRoutes } from "./routes/usuarios.routes.ts";
import { authRoutes } from "./routes/auth.routes.ts";
import { MongooseRepository } from "./repositories/MongooseRepository.ts";
import { EmpleadoModel, type Empleado } from "./models/empleado.ts";
import { UsuarioModel, type Usuario } from "./models/usuario.ts";
import { errorHandler } from "./middlewares/errorHandler.middleware.ts";
import { authenticate } from "./middlewares/auth.middleware.ts";

dotenv.config();

const app = express();
const port = process.env.PORT;

connectDatabase(); // Conexión a la base de datos

const employeeRepository = new MongooseRepository<Empleado>(EmpleadoModel);
const userRepository = new MongooseRepository<Usuario>(UsuarioModel);

app.use(morgan(process.env.ENV as string));

app.use(express.json());
app.use(cors());

app.use("/empleados", authenticate, empleadosRoutes(employeeRepository));
app.use("/usuarios", usuariosRoutes(userRepository));
app.use("/auth", authRoutes(userRepository));

app.use(errorHandler);

app.listen(port, () => {
  console.log("Servidor escuchando en el puerto " + port);
});
