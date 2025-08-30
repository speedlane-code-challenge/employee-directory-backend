import { DepartmentResponseDto } from "../department/department.dto";

/**
 * Data Transfer Objects for Employee operations
 */


export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string; // ISO string
  gender: string;
  jobTitle: string;
  imageUrl: string;
  address: string;
  dateOfEmployment: string; // ISO string
  departmentId: number;
}

export interface UpdateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  jobTitle: string;
  imageUrl: string;
  address: string;
  dateOfEmployment: string;
  departmentId: number;
}

export interface EmployeeResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: string;
  jobTitle: string;
  imageUrl: string;
  address: string;
  dateOfEmployment: Date;
  departmentId: number;
  createdAt: Date;
  updatedAt: Date;
  department?: DepartmentResponseDto;
}
