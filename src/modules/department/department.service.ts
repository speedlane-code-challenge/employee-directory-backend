import { Repository } from "typeorm";
import { Database } from "@modules/shared/services/db.service";
import { Department } from "./department.entity";
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentResponseDto,
} from "./department.dto";

export class DepartmentService {
  private departmentRepository: Repository<Department>;

  private async initRepository(): Promise<void> {
    if (this.departmentRepository) return;
    const dataSource = await Database.getConnection();
    this.departmentRepository = dataSource.getRepository(
      "Department"
    ) as Repository<Department>;
  }

  /**
   * Create a new department
   */
  async createDepartment(
    createDepartmentDto: CreateDepartmentDto
  ): Promise<DepartmentResponseDto> {
    await this.initRepository();

    const exists = await this.nameExists(createDepartmentDto.name);
    if (exists) {
      throw new Error("Department with this name already exists");
    }

    const savedDepartment = await this.departmentRepository.save({
      name: createDepartmentDto.name,
      description: createDepartmentDto.description,
    });

    return this.toResponseDto(savedDepartment);
  }

  /**
   * Get all departments
   */
  async getAllDepartments(): Promise<DepartmentResponseDto[]> {
    await this.initRepository();

    const departments = await this.departmentRepository.find({
      order: { createdAt: "DESC" },
    });

    return departments.map((department: Department) =>
      this.toResponseDto(department)
    );
  }

  /**
   * Update department by ID
   */
  async updateDepartment(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto
  ): Promise<DepartmentResponseDto> {
    await this.initRepository();
    const department = await this.getDepartmentById(id);

    if (
      updateDepartmentDto.name &&
      updateDepartmentDto.name !== department.name
    ) {
      if (await this.nameExists(updateDepartmentDto.name, department.id)) {
        throw new Error("Department with this name already exists");
      }
      department.name = updateDepartmentDto.name;
    }

    if (updateDepartmentDto.description !== undefined) {
      department.description = updateDepartmentDto.description;
    }

    const updatedDepartment = await this.departmentRepository.save(department);

    return this.toResponseDto(updatedDepartment);
  }

  /**
   * Delete department by ID
   */
  async deleteDepartment(id: number): Promise<void> {
    await this.initRepository();

    const department: Department = await this.getDepartmentById(id);
    if (!department) {
      throw new Error("Department not found");
    }

    await this.departmentRepository.delete(id);
  }

  /**
   * Get department by ID (returns entity)
   */
  async getDepartmentById(id: number): Promise<Department> {
    await this.initRepository();

    const department = await this.departmentRepository.findOne({
      where: { id },
    });
    if (!department) {
      throw new Error("Department not found");
    }

    return department;
  }

  /**
   * Check if department exists by name
   */
  private async nameExists(name: string, excludeId?: number): Promise<boolean> {
    await this.initRepository();
    const qb = this.departmentRepository
      .createQueryBuilder("department")
      .where("department.name = :name", { name });
    if (excludeId) qb.andWhere("department.id != :excludeId", { excludeId });
    const count = await qb.getCount();
    return count > 0;
  }

  /**
   * Convert Department entity to DepartmentResponseDto
   */
  private toResponseDto(department: Department): DepartmentResponseDto {
    return {
      id: department.id,
      name: department.name,
      description: department.description,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
    };
  }
}
