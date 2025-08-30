import { createDataSourceConfig } from "./src/modules/shared/services/db.service";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// Export AppDataSource as a Promise that resolves to the configured DataSource
export const AppDataSource = createDataSourceConfig();

// For CLI usage - if this file is run directly, execute migration commands
if (require.main === module) {
  const command = process.argv[2];
  
  async function runCommand() {
    const dataSource = await AppDataSource;
    
    try {
      console.log('Connecting to database...');
      await dataSource.initialize();
      
      switch (command) {
        case 'run':
          console.log('Running migrations...');
          const migrations = await dataSource.runMigrations();
          if (migrations.length === 0) {
            console.log('No pending migrations found.');
          } else {
            console.log(`Successfully ran ${migrations.length} migration(s):`);
            migrations.forEach(migration => console.log(`  - ${migration.name}`));
          }
          break;
          
        case 'revert':
          console.log('Reverting last migration...');
          await dataSource.undoLastMigration();
          console.log('Migration reverted successfully!');
          break;
          
        case 'show':
          console.log('Checking migration status...');
          const pending = await dataSource.showMigrations();
          console.log(pending ? 'There are pending migrations to run.' : 'All migrations are up to date.');
          break;
          
        default:
          console.log('Usage: ts-node data-source.ts [run|revert|show]');
          process.exit(1);
      }
      
      await dataSource.destroy();
      console.log('Command completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('Command failed:', error);
      process.exit(1);
    }
  }
  
  runCommand();
}
