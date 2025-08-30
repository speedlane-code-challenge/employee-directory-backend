import "reflect-metadata";
import { employeeRoutes } from "./src/modules/employee/routes";
import { departmentRoutes } from "./src/modules/department/routes";

const serverlessConfiguration = {
  frameworkVersion: "3",
  service: "employee-directory",
  plugins: ['serverless-plugin-typescript', 'serverless-offline'],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    region: "eu-west-1",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  custom: {
    serverless_typescript: {
      tsConfigFileLocation: './tsconfig.json'
    }
  },
  functions: {
   ...employeeRoutes,
   ...departmentRoutes,
  },
};

module.exports = serverlessConfiguration;
