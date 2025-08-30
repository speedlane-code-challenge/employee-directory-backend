/**
 * Data Transfer Objects for Department operations
 */

export interface CreateDepartmentDto {
    name: string;
    description: string;
}

export interface UpdateDepartmentDto {
    name?: string;
    description?: string;
}

export interface DepartmentResponseDto {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
