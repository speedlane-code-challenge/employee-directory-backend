import { getResponse } from '../../libs/response';
import { APIGatewayEvent, ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { authenticatedMiddyfy } from '../../libs/validation';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './department.dto';
import { 
    createDepartmentSchema, 
    updateDepartmentSchema, 
    deleteDepartmentSchema 
} from './department.schema';

const departmentService = new DepartmentService();

/**
 * Create a new department
 */
const createDepartmentHandler: ValidatedEventAPIGatewayProxyEvent<typeof createDepartmentSchema> = async (event: APIGatewayEvent) => {
    try {
        const createDepartmentDto = event.body as unknown as CreateDepartmentDto;

        console.log('Try to create department');
        const department = await departmentService.createDepartment(createDepartmentDto);
        console.log('Successfully created department');

        return getResponse(201, {
            success: true,
            data: department
        });
    } catch (error) {
        console.error('Create department error:', error);
        return getResponse(500, {
            success: false,
            errorCode: 500,
            errorMessage: 'Failed to create department'
        });
    }
};

/**
 * Get all departments
 */
const getAllDepartmentsHandler: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
    try {
        console.log('Trying to get all departments');
        const departments = await departmentService.getAllDepartments();
        console.log('Got all departments');

        return getResponse(200, {
            success: true,
            data: departments,
        });
    } catch (error) {
        console.error('Get all departments error:', error);
        return getResponse(500, {
            success: false,
            errorCode: 500,
            errorMessage: 'Failed to retrieve departments'
        });
    }
};


/**
 * Update department by ID
 */
const updateDepartmentHandler: ValidatedEventAPIGatewayProxyEvent<typeof updateDepartmentSchema> = async (event: APIGatewayEvent) => {
    try {
        const departmentId = parseInt(event.pathParameters?.id || '0');
        const updateDepartmentDto = event.body as UpdateDepartmentDto;

        console.log(`Trying to update department: ${departmentId}}`);
        const updatedDepartment = await departmentService.updateDepartment(departmentId, updateDepartmentDto);
        console.log(`Successfully updated department: ${departmentId}}`);

        return getResponse(201, {
            success: true,
            data: updatedDepartment
        });
    } catch (error) {
        console.error('Update department error:', error);
        return getResponse(500, {
            success: false,
            errorCode: 500,
            errorMessage: 'Failed to update department'
        });
    }
};

/**
 * Delete department by ID
 */
const deleteDepartmentHandler: ValidatedEventAPIGatewayProxyEvent<typeof deleteDepartmentSchema> = async (event: APIGatewayEvent) => {
    try {
        const departmentId = parseInt(event.pathParameters?.id || '0');

        console.log(`Trying to delete department: ${departmentId}}`);
        await departmentService.deleteDepartment(departmentId);
        console.log(`Successfully deleted department: ${departmentId}}`);

        return getResponse(201, {
            success: true,
            message: 'Department deleted successfully'
        });
    } catch (error) {
        console.error('Delete department error:', error);
        return getResponse(500, {
            success: false,
            errorCode: 500,
            errorMessage: 'Failed to delete department'
        });
    }
};

// Export handlers with middy validation
export const createDepartment = authenticatedMiddyfy(createDepartmentHandler, createDepartmentSchema);
export const getAllDepartments = authenticatedMiddyfy(getAllDepartmentsHandler, null);
export const updateDepartment = authenticatedMiddyfy(updateDepartmentHandler, updateDepartmentSchema);
export const deleteDepartment = authenticatedMiddyfy(deleteDepartmentHandler, deleteDepartmentSchema);
