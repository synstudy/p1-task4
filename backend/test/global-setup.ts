import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { execSync } from 'child_process';

let dbContainer: StartedTestContainer;

export default async function globalSetup() {
  // Start PostgreSQL container
  dbContainer = await new GenericContainer('postgres:17-alpine')
    .withEnvironment({
      POSTGRES_DB: 'testdb',
      POSTGRES_USER: 'testuser',
      POSTGRES_PASSWORD: 'testpass',
    })
    .withExposedPorts(5432)
    .withWaitStrategy(Wait.forLogMessage(/database system is ready to accept connections/))
    .start();

  const dbPort = dbContainer.getMappedPort(5432);
  const dbHost = dbContainer.getHost();

  // Set the environment variable globally before any tests run
  process.env.DATABASE_URL = `postgresql://testuser:testpass@${dbHost}:${dbPort}/testdb`;
  process.env.JWT_SECRET = 'test_secret_for_e2e_tests';
  
  // Run Prisma migrations to set up the database schema
  try {
    execSync('npx prisma migrate reset --force', { 
      stdio: 'inherit',
      env: { ...process.env }
    });
  } catch (error) {
    console.error('Failed to run Prisma migrations:', error);
    throw error;
  }
  
  // Store container reference for cleanup
  (global as any).__TEST_DB_CONTAINER__ = dbContainer;
}