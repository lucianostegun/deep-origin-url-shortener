# Database Seeders

This directory contains seeders to populate the database with initial data in development environment only.

## How to run seeders

### Via npm script:

```bash
npm run seed:run
```

### Via ts-node directly:

```bash
npx ts-node src/database/seeders/index.ts
```

## Available seeders

### UserServiceSeeder (Recommended)

Uses NestJS `UsersService` to create users, following the same API practices:

- **Uses TypeORM Repository Pattern**
- **Reuses business logic**
- **Automatic validations**
- **Integration with NestJS dependency injection system**

Creates 3 example users:

1. **john.doe@example.com** - John Doe
2. **jane.smith@example.com** - Jane Smith
3. **rick.sanchez@example.com** - Rick Sanchez

### UserSeeder (Legacy)

Original seeder that uses direct SQL queries. Kept for reference.

## Advantages of the Service approach

✅ **Code reuse**: Uses the same service as the API  
✅ **Validations**: Applies the same business validations  
✅ **Maintainability**: Changes in the service reflect in the seeder  
✅ **Type Safety**: Full TypeScript typing  
✅ **Dependency Injection**: Leverages NestJS system

## Seeder characteristics

- **Idempotent**: Seeders check if data already exists before inserting
- **Context-based**: Uses NestJS Application Context
- **Auto-cleanup**: Automatically closes the application after execution
- **Informative logs**: Shows progress and execution results

## File structure

- `user-service.seeder.ts` - Seeder using UsersService (recommended)
- `20250714001-insert-users.ts` - Seeder with direct SQL queries (legacy)
- `index.ts` - Main file that executes all seeders

## Architecture

```
Seeder -> NestJS App Context -> UsersService -> TypeORM Repository -> Database
```

This approach ensures that the seeder uses exactly the same logic as a real API call.
