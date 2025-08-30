import { getHandler } from "@libs/handler";

const path = "./src/modules/employee";

export const employeeRoutes = {
  getAllEmployees: getHandler(`${path}/employee.getAllEmployees`, "get", "/employees"),
};