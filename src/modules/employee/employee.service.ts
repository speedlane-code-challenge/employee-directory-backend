import { Repository } from "typeorm";
import { Database } from "../shared/services/db.service";
import { Employee } from "./employee.entity";
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeResponseDto,
} from "./employee.dto";
import { DepartmentService } from "../department/department.service";
import { Department } from "../department/department.entity";
import { Gender } from "./enums/gender.enum";

export class EmployeeService {
  private employeeRepository: Repository<Employee>;
  private departmentService: DepartmentService;

  public constructor() {
    this.departmentService = new DepartmentService();
  }

  private async initRepository() {
    if (this.employeeRepository) return;
    const dataSource = await Database.getConnection();
    this.employeeRepository = dataSource.getRepository(
      "Employee"
    ) as Repository<Employee>;
  }

  /**
   * Create a new employee
   */
  async createEmployee(
    createEmployeeDto: CreateEmployeeDto
  ): Promise<EmployeeResponseDto> {
    await this.initRepository();

    const department: Department =
      await this.departmentService.getDepartmentById(
        createEmployeeDto.departmentId
      );
    if (!department) throw new Error("Department not found");

    if (await this.emailExists(createEmployeeDto.email)) {
      throw new Error("Email already in use");
    }

    const employee = this.employeeRepository.create({
      firstName: createEmployeeDto.firstName,
      lastName: createEmployeeDto.lastName,
      email: createEmployeeDto.email,
      phoneNumber: createEmployeeDto.phoneNumber,
      dateOfBirth: new Date(createEmployeeDto.dateOfBirth),
      gender: createEmployeeDto.gender as Gender,
      jobTitle: createEmployeeDto.jobTitle,
      imageUrl: createEmployeeDto.imageUrl,
      address: createEmployeeDto.address,
      dateOfEmployment: new Date(createEmployeeDto.dateOfEmployment),
      department,
    });

    const savedEmployee = await this.employeeRepository.save(employee);
    return this.toResponseDto(savedEmployee);
  }

  /**
   * Get all employees
   */
  async getAllEmployees(): Promise<EmployeeResponseDto[]> {
    await this.initRepository();

    const employees = await this.employeeRepository.find({
      relations: ["department"],
      order: { createdAt: "DESC" },
    });

    return employees.map((employee: Employee) => this.toResponseDto(employee));
  }

  /**
   * Update employee by ID
   */
  async updateEmployee(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto
  ): Promise<EmployeeResponseDto> {
    await this.initRepository();

    const employee: Employee = await this.getEmployeeById(id);

    if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
      if (await this.emailExists(updateEmployeeDto.email, employee.id)) {
        throw new Error("Email already in use");
      }
      employee.email = updateEmployeeDto.email;
    }

    if (
      updateEmployeeDto.departmentId &&
      updateEmployeeDto.departmentId !== employee.department?.id
    ) {
      const newDepartment: Department =
        await this.departmentService.getDepartmentById(
          updateEmployeeDto.departmentId
        );
      if (!newDepartment) throw new Error("Department not found");
      employee.department = newDepartment;
    }

    // Patch remaining mutable fields if provided
    if (updateEmployeeDto.firstName !== undefined)
      employee.firstName = updateEmployeeDto.firstName;
    if (updateEmployeeDto.lastName !== undefined)
      employee.lastName = updateEmployeeDto.lastName;
    if (updateEmployeeDto.phoneNumber !== undefined)
      employee.phoneNumber = updateEmployeeDto.phoneNumber;
    if (updateEmployeeDto.dateOfBirth !== undefined)
      employee.dateOfBirth = new Date(updateEmployeeDto.dateOfBirth);
    if (updateEmployeeDto.gender !== undefined)
      employee.gender = updateEmployeeDto.gender as Gender;
    if (updateEmployeeDto.jobTitle !== undefined)
      employee.jobTitle = updateEmployeeDto.jobTitle;
    if (updateEmployeeDto.imageUrl !== undefined)
      employee.imageUrl = updateEmployeeDto.imageUrl;
    if (updateEmployeeDto.address !== undefined)
      employee.address = updateEmployeeDto.address;
    if (updateEmployeeDto.dateOfEmployment !== undefined)
      employee.dateOfEmployment = new Date(updateEmployeeDto.dateOfEmployment);

    const updatedEmployee = await this.employeeRepository.save(employee);
    return this.toResponseDto(updatedEmployee);
  }

  /**
   * Delete employee by ID
   */
  async deleteEmployee(id: number): Promise<void> {
    await this.initRepository();

    const employee: Employee = await this.getEmployeeById(id);
    if (!employee) {
      throw new Error("Employee not found");
    }

    await this.employeeRepository.delete(id);
  }

  /**
   * Get employee by ID
   */
  private async getEmployeeById(id: number): Promise<Employee> {
    await this.initRepository();

    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ["department"],
    });
    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  }

  /**
   * Check if email exists
   */
  private async emailExists(
    email: string,
    excludeId?: number
  ): Promise<boolean> {
    await this.initRepository();

    const qb = this.employeeRepository
      .createQueryBuilder("employee")
      .where("employee.email = :email", { email });
    if (excludeId) qb.andWhere("employee.id != :excludeId", { excludeId });
    return (await qb.getCount()) > 0;
  }

  /**
   * Convert Employee entity to EmployeeResponseDto
   */
  private toResponseDto(employee: Employee): EmployeeResponseDto {
    return {
      id: employee.id,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      dateOfBirth: employee.dateOfBirth,
      gender: employee.gender,
      jobTitle: employee.jobTitle,
      imageUrl: employee.imageUrl,
      address: employee.address,
      dateOfEmployment: employee.dateOfEmployment,
      departmentId: employee.department?.id,
      department: employee.department,
    };
  }
}
