import { DataSource } from "typeorm";

import { SecretManagerService } from "@modules/shared/services/secret-manager.service";
import { Department } from "@modules/department/department.entity";

/**
 * Create a DataSource configuration using AWS Secrets Manager
 */
export async function createDataSourceConfig(): Promise<DataSource> {
  const { SECRET_ID } = process.env;
  
  if (!SECRET_ID) {
    throw new Error('SECRET_ID environment variable is required');
  }

  const secretManagerService: SecretManagerService = new SecretManagerService();
  const dbCredentials = await secretManagerService.getSecretValue(SECRET_ID);

  return new DataSource({
    type: dbCredentials.engine,
    host: dbCredentials.host,
    port: parseInt(dbCredentials.port, 10),
    username: dbCredentials.username,
    password: dbCredentials.password,
    database: dbCredentials.dbname,
    entities: [
      Department,
    ],
    migrations: [
      "src/migrations/*.ts"
    ],
    migrationsTableName: "migrations",
    synchronize: false,
    legacySpatialSupport: false,
    charset: "utf8mb4_unicode_ci",
    bigNumberStrings: false,
    migrationsRun: false,
    logging: ["error"],
  });
}

/**
 * Database manager class
 */
class Database {
  private static connection: DataSource;

  public static async getConnection() {
    if (this.connection && this.connection.isInitialized) {
      console.log("Database ~ getConnection() ~ using existing connection");
    } else {
      console.log("Database ~ getConnection() ~ creating new connection");

      // Use the shared DataSource configuration with auto-migration enabled
      this.connection = await createDataSourceConfig();
      await this.connection.initialize();
    }
    return this.connection;
  }
}

export { Database, DataSource };