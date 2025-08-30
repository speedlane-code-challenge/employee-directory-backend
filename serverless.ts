import "reflect-metadata";
import { employeeRoutes } from "./src/modules/employee/routes";
import { departmentRoutes } from "./src/modules/department/routes";

const serverlessConfiguration = {
  frameworkVersion: "3",
  service: "employee-directory",
  plugins: [
    "serverless-plugin-typescript",
    "serverless-offline",
    "serverless-dotenv-plugin",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    region: "eu-west-1",
    stage: "${self:custom.env.API_STAGE}",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      restApiId: "${self:custom.restApiId}",
      restApiRootResourceId: "${self:custom.restApiRootResourceId}",
    },
    vpc: {
      subnetIds: ["${self:custom.subnetId}"],
      securityGroupIds: ["${self:custom.securityGroupId}"],
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "cloudformation:*",
              "secretsmanager:*",
              "dbqms:*",
              "rds-data:*",
              "cloudwatch:*",
              "logs:*",
              "textract:*",
            ],
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: ["cognito-idp:*"],
            Resource: [
              "arn:aws:wafv2:*:${self:custom.env.ACCOUNT_ID}:*/webacl/*/*",
              "arn:aws:cognito-idp:*:${self:custom.env.ACCOUNT_ID}:userpool/*",
            ],
          },
        ],
      },
    },
  },
  custom: {
    env: "${file(dotenv-configs.js)}",
    serverless_typescript: {
      tsConfigFileLocation: "./tsconfig.json",
    },
    "serverless-offline": {
      httpPort: 4001,
      lambdaPort: 4002,
    },
    restApiId: "${cf:ApiGatewayStack.restApiId}",
    restApiRootResourceId: "${cf:ApiGatewayStack.restApiRootResourceId}",
    subnetId: "${cf:VpcStack.privateSubnet1Id}",
    securityGroupId: "${cf:LambdaStack.lambdaSecurityGroupId}",
  },
  functions: {
    ...employeeRoutes,
    ...departmentRoutes,
  },
};

module.exports = serverlessConfiguration;
