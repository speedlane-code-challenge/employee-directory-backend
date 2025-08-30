import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { join } from "path";
import { SecretManagerService } from "../../shared/services/secret-manager.service";
import { Department } from "../../department/department.entity";
import { Employee } from "../../employee/employee.entity";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

/**
 * Create a DataSource configuration using AWS Secrets Manager
 * IMPORTANT: Never load BOTH ts and js entity files at once – that duplicates metadata.
 */
export async function createDataSourceConfig(): Promise<DataSource> {
  const { SECRET_ID } = process.env;
  if (!SECRET_ID) throw new Error("SECRET_ID environment variable is required");

  console.log("SECRET_ID:", SECRET_ID);

  const secretManagerService: SecretManagerService = new SecretManagerService();
  const dbCredentials = await secretManagerService.getSecretValue(SECRET_ID);
  console.log('Database credentials retrieved from Secrets Manager', JSON.stringify(dbCredentials));

  // Detect runtime: when executed via ts-node the source file ends with .ts
  const root = process.cwd();
  const migrationsGlob = join(root, "src", "migrations", "*.ts");

  return new DataSource({
    type: dbCredentials.engine,
    host: dbCredentials.host,
    port: parseInt(dbCredentials.port, 10),
    username: dbCredentials.username,
    password: dbCredentials.password,
    database: dbCredentials.dbname,
    entities: [Department, Employee],
    migrations: [migrationsGlob],
    migrationsTableName: "migrations",
    synchronize: false,
    legacySpatialSupport: false,
    charset: "utf8mb4_unicode_ci",
    bigNumberStrings: false,
    migrationsRun: false,
    logging: ["error"],
  });
}

class Database {
  private static connection: DataSource;
  public static async getConnection() {
    if (this.connection && this.connection.isInitialized) {
      console.log("Reusing existing database connection");
      return this.connection;
    }
    console.log("Initializing new database connection...");
    this.connection = await createDataSourceConfig();
    await this.connection.initialize();
    console.log(
      "Initialized entities:",
      this.connection.entityMetadatas.map((m) => m.name)
    );
    return this.connection;
  }
}

export { Database, DataSource };
