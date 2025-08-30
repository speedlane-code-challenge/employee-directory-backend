import { getHandler } from "@libs/handler";

const path = "./src/modules/employee";

export const employeeRoutes = {
  createEmployee: getHandler(`${path}/employee.createEmployee`, 'post', '/employees'),
  getAllEmployees: getHandler(`${path}/employee.getAllEmployees`, 'get', '/employees'),
  updateEmployee: getHandler(`${path}/employee.updateEmployee`, 'put', '/employees/{id}'),
  deleteEmployee: getHandler(`${path}/employee.deleteEmployee`, 'delete', '/employees/{id}'),
};