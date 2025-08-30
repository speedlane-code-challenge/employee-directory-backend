import * as yup from 'yup';
import { dateRegex, idRegex } from '../../utils/regex';
import { Gender } from './enums/gender.enum';

/**
 * Validation schemas for Employee operations
 */

export const createEmployeeSchema = {
  body: yup.object({
    firstName: yup.string().required().trim(),
    lastName: yup.string().required().trim(),
    email: yup.string().required().email().trim(),
    phoneNumber: yup.string().required().trim(),
    dateOfBirth: yup.string().required().matches(dateRegex,'dateOfBirth must be YYYY-MM-DD'),
    gender: yup.string().required().oneOf(Object.values(Gender), 'gender must be one of: Male, Female'),
    jobTitle: yup.string().required().trim(),
    imageUrl: yup.string().required().url(),
    address: yup.string().required().trim(),
    dateOfEmployment: yup.string().required().matches(dateRegex,'dateOfEmployment must be YYYY-MM-DD'),
    departmentId: yup.number().required().positive().integer(),
  })
};

export const updateEmployeeSchema = {
  body: yup.object({
    firstName: yup.string().trim(),
    lastName: yup.string().trim(),
    email: yup.string().email().trim(),
    phoneNumber: yup.string().trim(),
    dateOfBirth: yup.string().matches(dateRegex,'dateOfBirth must be YYYY-MM-DD'),
    gender: yup.string().required().oneOf(Object.values(Gender), 'gender must be one of: Male, Female'),
    jobTitle: yup.string().trim(),
    imageUrl: yup.string().url(),
    address: yup.string().trim(),
    dateOfEmployment: yup.string().matches(dateRegex,'dateOfEmployment must be YYYY-MM-DD'),
    departmentId: yup.number().positive().integer(),
  }),
  pathParameters: yup.object({
    id: yup.string().required().matches(idRegex,'Employee ID must be a valid number')
  })
};

export const deleteEmployeeSchema = {
  pathParameters: yup.object({
    id: yup.string().required().matches(idRegex,'Employee ID must be a valid number')
  })
};
