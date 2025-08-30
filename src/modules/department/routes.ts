import { getHandler } from "../../libs/handler";

const path = "./src/modules/department";

export const departmentRoutes = {
  createDepartment: getHandler(`${path}/department.createDepartment`, "post", "/departments"),
  getAllDepartments: getHandler(`${path}/department.getAllDepartments`, "get", "/departments"),
  getDepartmentById: getHandler(`${path}/department.getDepartmentById`, "get", "/departments/{id}"),
  updateDepartment: getHandler(`${path}/department.updateDepartment`, "put", "/departments/{id}"),
  deleteDepartment: getHandler(`${path}/department.deleteDepartment`, "delete", "/departments/{id}"),
};
