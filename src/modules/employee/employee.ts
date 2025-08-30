import { getResponse } from '@libs/response';
import { APIGatewayEvent, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';

export const getAllEmployees: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
    try {
        console.log(`Trying to get all users.`);
        // const users: User[] = await userService.getAllUsers();
        console.log(`Got all users.`);

        return getResponse(200, []);
    } catch (e) {
        console.error(e);
        return getResponse(500, {
            success: false,
            errorCode: 500,
            errorMessage: 'An error has occurred.',
        });
    }
};