import * as yup from "yup";
import { idRegex } from "@utils/regex";

/**
 * Validation schemas for Department operations
 */

export const createDepartmentSchema = {
  body: yup.object({
    name: yup.string().required("Department name is required").trim(),
    description: yup
      .string()
      .required("Department description is required")
      .trim(),
  }),
};

export const updateDepartmentSchema = {
  body: yup.object({
    name: yup.string().optional().trim(),
    description: yup.string().optional().trim(),
  }),
  pathParameters: yup.object({
    id: yup
      .string()
      .required("Department ID is required")
      .matches(idRegex, "Department ID must be a valid number"),
  }),
};

export const deleteDepartmentSchema = {
  pathParameters: yup.object({
    id: yup
      .string()
      .required("Department ID is required")
      .matches(idRegex, "Department ID must be a valid number"),
  }),
};
