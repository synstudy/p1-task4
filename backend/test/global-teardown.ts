export default async function globalTeardown() {
  const container = (global as any).__TEST_DB_CONTAINER__;
  if (container) {
    await container.stop();
  }
}