# Create migrations (uses CLI)
npm run migration:create src/migrations/department

# Generate migration based on your Department entity
npm run migration:generate src/migrations/department

# Run migrations (uses our custom logic)  
npm run migration:run

# Revert migrations (uses our custom logic)
npm run migration:revert

# Check migration status (uses our custom logic)
npm run migration:show