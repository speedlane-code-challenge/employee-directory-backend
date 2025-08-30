import { getResponse } from "../../libs/response";
import {
  APIGatewayEvent,
  ValidatedEventAPIGatewayProxyEvent,
} from "../../libs/api-gateway";
import { authenticatedMiddyfy } from "../../libs/validation";
import { EmployeeService } from "./employee.service";
import { CreateEmployeeDto, UpdateEmployeeDto } from "./employee.dto";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  deleteEmployeeSchema,
} from "./employee.schema";

const employeeService = new EmployeeService();

/**
 * Create a new employee
 */
const createEmployeeHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof createEmployeeSchema
> = async (event: APIGatewayEvent) => {
  try {
    const dto = event.body as unknown as CreateEmployeeDto;

    console.log("Try to create employee");
    const employee = await employeeService.createEmployee(dto);
    console.log("Successfully created employee");

    return getResponse(201, { success: true, data: employee });
  } catch (e) {
    console.error("Create employee error:", e);
    return getResponse(500, {
      success: false,
      errorCode: 500,
      errorMessage: "Failed to create employee",
    });
  }
};

/**
 * Get all employees
 */
const getAllEmployeesHandler: ValidatedEventAPIGatewayProxyEvent<
  null
> = async () => {
  try {
    console.log("Trying to get all employees");
    const list = await employeeService.getAllEmployees();
    console.log("Got all employees");

    return getResponse(200, { success: true, data: list });
  } catch (e) {
    console.error("Get all employees error:", e);
    return getResponse(500, {
      success: false,
      errorCode: 500,
      errorMessage: "Failed to get all employees",
    });
  }
};

/**
 * Update an employee by ID
 */
const updateEmployeeHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof updateEmployeeSchema
> = async (event: APIGatewayEvent) => {
  try {
    const id = parseInt(event.pathParameters?.id || "0");
    const dto = event.body as unknown as UpdateEmployeeDto;

    console.log(`Trying to update employee: ${id}}`);
    const updatedEmployee = await employeeService.updateEmployee(id, dto);
    console.log(`Successfully updated employee: ${id}}`);

    return getResponse(201, { success: true, data: updatedEmployee });
  } catch (e) {
    console.error("Update employee error:", e);
    return getResponse(500, {
      success: false,
      errorCode: 500,
      errorMessage: "Failed to update employee",
    });
  }
};

/**
 * Delete employee by ID
 */
const deleteEmployeeHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof deleteEmployeeSchema
> = async (event: APIGatewayEvent) => {
  try {
    const id = parseInt(event.pathParameters?.id || "0");

    console.log(`Trying to delete employee: ${id}}`);
    await employeeService.deleteEmployee(id);
    console.log(`Successfully deleted employee: ${id}}`);

    return getResponse(201, {
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (e) {
    console.error("Delete employee error:", e);
    return getResponse(500, {
      success: false,
      errorCode: 500,
      errorMessage: "Failed to delete employee",
    });
  }
};

// Export handlers with middy validation

export const createEmployee = authenticatedMiddyfy(
  createEmployeeHandler,
  createEmployeeSchema
);
export const getAllEmployees = authenticatedMiddyfy(
  getAllEmployeesHandler,
  null
);
export const updateEmployee = authenticatedMiddyfy(
  updateEmployeeHandler,
  updateEmployeeSchema
);
export const deleteEmployee = authenticatedMiddyfy(
  deleteEmployeeHandler,
  deleteEmployeeSchema
);
