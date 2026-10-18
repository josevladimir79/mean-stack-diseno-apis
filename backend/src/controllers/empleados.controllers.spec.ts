import type { Request, Response } from "express";
import {
  empleadoController,
  type IEmpleadoController,
} from "./empleados.controllers.ts";
import type { IEmployeeRepository } from "../repositories/IEmployeeRepository.ts";
import type {
  CreateEmployeeDTO,
  EmployeeIdParams,
  UpdateEmployeeDTO,
} from "../dtos/employee.dto.ts";
import { HttpError } from "../utils/httpError.ts";

describe("🧪 Unit Test: EmployeeController (Mantenibilidad & Testabilidad)", () => {
  let controller: IEmpleadoController;
  let mockRepository: jest.Mocked<IEmployeeRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    // 1. Crear un Mock 100% aislado de la interfaz (Cero dependencia de Mongoose)
    mockRepository = {
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    controller = empleadoController(mockRepository);
    // 2. Mockear los objetos del ciclo de vida de Express
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = { status: statusMock };
  });

  it("Debería retornar un estado 200 y la lista de empleados de la abstracción", async () => {
    const fakeEmployees = [
      {
        nombre: "Andrés Mendoza",
        cargo: "Arquitecto",
        departamento: "TI",
        sueldo: 4000,
      },
    ];

    // Configurar el comportamiento esperado de la abstracción
    mockRepository.findAll.mockResolvedValue(fakeEmployees);
    mockRequest = {};
    await controller.getEmpleado(
      mockRequest as Request,
      mockResponse as Response,
    );
    // Verificaciones asertivas del contrato
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      data: fakeEmployees,
      success: true,
      message: "Empleados obtenidos",
      errors: null,
    });
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it("Debería retornar un estado 201 y el empleado creado correctamente", async () => {
    const fakeEmployee = {
      nombre: "Andrés Mendoza",
      cargo: "Arquitecto",
      departamento: "TI",
      sueldo: 4000,
    };

    // Configurar el comportamiento esperado de la abstracción
    mockRepository.create.mockResolvedValue(fakeEmployee);
    mockRequest = { body: fakeEmployee };
    await controller.addEmpleado(
      mockRequest as Request,
      mockResponse as Response,
    );
    // Verificaciones asertivas del contrato
    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      data: fakeEmployee,
      success: true,
      message: "Empleado guardado",
      errors: null,
    });
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
  });

  it("Debería retornar un estado 200 y el empleado actualizado correctamente", async () => {
    const id = "64b7f0c2a1b2c3d4e5f60718";
    const cambios = { cargo: "Gerente", sueldo: 5000 };
    const fakeEmployee = {
      id,
      nombre: "Andrés Mendoza",
      cargo: "Gerente",
      departamento: "TI",
      sueldo: 5000,
    };

    // Configurar el comportamiento esperado de la abstracción
    mockRepository.update.mockResolvedValue(fakeEmployee);
    const updateRequest = { params: { id }, body: cambios };
    await controller.updateEmpleado(
      updateRequest as Request<EmployeeIdParams, unknown, UpdateEmployeeDTO>,
      mockResponse as Response,
    );
    // Verificaciones asertivas del contrato
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      data: fakeEmployee,
      success: true,
      message: "Empleado actualizado",
      errors: null,
    });
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRepository.update).toHaveBeenCalledWith(id, cambios);
  });

  it("Debería retornar un estado 200 y el empleado eliminado correctamente", async () => {
    const id = "64b7f0c2a1b2c3d4e5f60718";
    const fakeEmployee = {
      id,
      nombre: "Andrés Mendoza",
      cargo: "Arquitecto",
      departamento: "TI",
      sueldo: 4000,
    };

    // Configurar el comportamiento esperado de la abstracción
    mockRepository.delete.mockResolvedValue(fakeEmployee);
    const deleteRequest = { params: { id } };
    await controller.deleteEmpleado(
      deleteRequest as Request<EmployeeIdParams>,
      mockResponse as Response,
    );
    // Verificaciones asertivas del contrato
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      data: fakeEmployee,
      success: true,
      message: "Empleado eliminado",
      errors: null,
    });
    expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockRepository.delete).toHaveBeenCalledWith(id);
  });
});

describe("🧪 Unit Test: EmployeeController - casos de error", () => {
  const ID_VALIDO = "64b7f0c2a1b2c3d4e5f60718";
  let controller: IEmpleadoController;
  let mockRepository: jest.Mocked<IEmployeeRepository>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    controller = empleadoController(mockRepository);
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = { status: statusMock };
  });

  describe("updateEmpleado", () => {
    it("Debería lanzar un HttpError 404 si el empleado no existe", async () => {
      mockRepository.update.mockResolvedValue(null);
      const mockRequest = {
        params: { id: ID_VALIDO },
        body: { cargo: "Gerente" },
      };

      // El controller no responde: delega el error al errorHandler
      await expect(
        controller.updateEmpleado(
          mockRequest as Request<EmployeeIdParams, unknown, UpdateEmployeeDTO>,
          mockResponse as Response,
        ),
      ).rejects.toMatchObject({
        name: "HttpError",
        statusCode: 404,
        message: "Empleado no encontrado",
      });
      expect(mockRepository.update).toHaveBeenCalledWith(ID_VALIDO, {
        cargo: "Gerente",
      });
      expect(statusMock).not.toHaveBeenCalled();
    });

    it("Debería propagar el error si el repositorio falla", async () => {
      const dbError = new Error("Mongo caído");
      mockRepository.update.mockRejectedValue(dbError);
      const mockRequest = {
        params: { id: ID_VALIDO },
        body: { cargo: "Gerente" },
      };

      await expect(
        controller.updateEmpleado(
          mockRequest as Request<EmployeeIdParams, unknown, UpdateEmployeeDTO>,
          mockResponse as Response,
        ),
      ).rejects.toBe(dbError);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  describe("deleteEmpleado", () => {
    it("Debería lanzar un HttpError 404 si el empleado no existe", async () => {
      mockRepository.delete.mockResolvedValue(null);
      const mockRequest = { params: { id: ID_VALIDO } };

      await expect(
        controller.deleteEmpleado(
          mockRequest as Request<EmployeeIdParams>,
          mockResponse as Response,
        ),
      ).rejects.toThrow(new HttpError(404, "Empleado no encontrado"));
      expect(mockRepository.delete).toHaveBeenCalledWith(ID_VALIDO);
      expect(statusMock).not.toHaveBeenCalled();
    });

    it("Debería propagar el error si el repositorio falla", async () => {
      const dbError = new Error("Mongo caído");
      mockRepository.delete.mockRejectedValue(dbError);
      const mockRequest = { params: { id: ID_VALIDO } };

      await expect(
        controller.deleteEmpleado(
          mockRequest as Request<EmployeeIdParams>,
          mockResponse as Response,
        ),
      ).rejects.toBe(dbError);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  describe("getEmpleado", () => {
    it("Debería propagar el error si el repositorio falla", async () => {
      const dbError = new Error("Mongo caído");
      mockRepository.findAll.mockRejectedValue(dbError);

      await expect(
        controller.getEmpleado({} as Request, mockResponse as Response),
      ).rejects.toBe(dbError);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  describe("addEmpleado", () => {
    it("Debería propagar el error si el repositorio falla", async () => {
      const dbError = new Error("Mongo caído");
      mockRepository.create.mockRejectedValue(dbError);
      const mockRequest = {
        body: {
          nombre: "Andrés Mendoza",
          cargo: "Arquitecto",
          departamento: "TI",
          sueldo: 4000,
        },
      };

      await expect(
        controller.addEmpleado(
          mockRequest as Request<{}, unknown, CreateEmployeeDTO>,
          mockResponse as Response,
        ),
      ).rejects.toBe(dbError);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });
});
