import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { APIGatewayProxyHandler } from 'aws-lambda';
import * as util from 'util';
import { Schema } from 'yup';

import { getResponse } from '@libs/response';
import { CognitoService } from '@modules/shared/services/congito.service';
// import { AWSService } from '@modules/shared/services/aws.service';

const schemaValidator = (schema: { body?: Schema; queryStringParameters?: Schema; pathParameters?: Schema }) => {
    const before = async (request: any) => {
        try {
            console.log(JSON.stringify(request.event));
            const { body, queryStringParameters, pathParameters } = request.event;

            if (schema !== null) {
                if (schema.body) {
                    schema.body.validateSync(body);
                }

                if (schema.queryStringParameters) {
                    schema.queryStringParameters.validateSync(queryStringParameters ?? {});
                }

                if (schema.pathParameters) {
                    schema.pathParameters.validateSync(pathParameters ?? {});
                }
            }

            return Promise.resolve();
        } catch (e) {
            console.error(e);

            return getResponse(400, {
                success: false,
                errorCode: 400,
                errorMessage: e.errors[0],
            });
        }
    };

    return {
        before,
    };
};

const verifyAccessToken = () => {
    const before = async (request: any) => {
        const cognitoService: CognitoService = new CognitoService();

        try {
            const authHeader = request.event.headers.Authorization;

            if (!authHeader) {
                return getResponse(401, {
                    success: false,
                    errorCode: 401,
                    errorMessage: 'Unauthorized',
                });
            }

            const accessToken = authHeader.split(' ')[1];
            const user = await cognitoService.getUser(accessToken);
            if (!user) {
                return getResponse(401, {
                    success: false,
                    errorCode: 401,
                    errorMessage: 'Unauthorized',
                });
            }

            return Promise.resolve();
        } catch (e) {
            console.error(e);
            return getResponse(401, {
                success: false,
                errorCode: 401,
                errorMessage: 'Unauthorized',
            });
        }
    };

    return {
        before,
    };
};

const authenticatedMiddyfy = (
    handler: APIGatewayProxyHandler,
    inputSchema: {
        body?: Schema;
        queryStringParameters?: Schema;
        pathParameters?: Schema;
    },
) => {
    return middy(handler)
        .use(jsonBodyParser())
        .use(verifyAccessToken())
        .use(schemaValidator(inputSchema))
        .use(httpErrorHandler())
        .onError(async (request: any) => {
            console.error('error logged from middy', util.inspect(request, false, null, true));
            request.response.statusCode = 400;
            request.response.body = JSON.stringify(request.error.details);
        });
};

export { authenticatedMiddyfy };