
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

beforeAll(() => {
  // Start the mock service worker
  server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
  // Clean up after each test
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  // Clean up after all tests
  server.close();
});
