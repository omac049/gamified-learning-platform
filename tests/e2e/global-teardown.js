// Global teardown for Playwright tests
export default async function globalTeardown() {
  console.log('🧹 Starting E2E test teardown...');

  // Cleanup test data or configurations here
  // For example, you might want to:
  // - Clean up test databases
  // - Remove test files
  // - Reset configurations

  console.log('✅ E2E test teardown complete');
}
