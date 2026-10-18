import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDatabase } from "./config/database.ts";
import dotenv from "dotenv";
import { empleadosRoutes } from "./routes/empleados.routes.ts";
import { MongooseEmployeeRepository } from "./repositories/MongooseEmployeeRepository.ts";
import { errorHandler } from "./middlewares/errorHandler.middleware.ts";

dotenv.config();

const app = express();
const port = process.env.PORT;

connectDatabase(); // Conexión a la base de datos

const employeeRepository = new MongooseEmployeeRepository();

app.use(morgan(process.env.ENV as string));

app.use(express.json());
app.use(cors());

app.use("/empleados", empleadosRoutes(employeeRepository));

app.use(errorHandler);

app.listen(port, () => {
  console.log("Servidor escuchando en el puerto " + port);
});
