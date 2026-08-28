/// <reference types='vitest' />
import { defineConfig } from 'vitest/config';

import { FL_MEMORY_SAFE_POOL } from './vitest.shared.mts';

/**
 * Base config for the app test targets (`@angular/build:unit-test` with `runnerConfig: true`).
 * The builder discovers this file by name and merges its own build-driven options on top, so
 * keep it limited to the memory guard.
 */
export default defineConfig({
  test: {
    ...FL_MEMORY_SAFE_POOL,
  },
});
