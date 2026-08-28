/// <reference types='vitest' />
import type { ViteUserConfig } from 'vitest/config';

/**
 * Shared memory guard for every test run in this workspace.
 *
 * Each vitest instance boots a Vite server, the Angular compiler and jsdom, then forks one
 * worker per CPU core by default. With ~20 test-enabled projects, running several at once is
 * enough to exhaust the RAM of a dev machine and hand the run to the kernel OOM killer (which
 * kills the editor/browser rather than the tests). Test tasks are therefore serialised in
 * `nx.json` (`targetDefaults.test.parallelism: false`) and the worker pool of each instance is
 * capped here, for:
 *
 * - the libs, through `flLibTestConfig()` in their own `vite.config.mts`
 * - the Angular apps, through `vitest-base.config.mts` (`runnerConfig: true`)
 *
 * Raise it on a bigger machine with `--max-workers=<n>` on the command line.
 */
export const FL_MEMORY_SAFE_POOL = {
  pool: 'forks',
  maxWorkers: 2,
  // A leaking worker then dies on its own heap limit instead of dragging the machine into swap.
  execArgv: ['--max-old-space-size=1536'],
} satisfies ViteUserConfig['test'];

/**
 * Test options shared by every Angular lib. Paths stay relative to the lib because each lib
 * config sets `root: __dirname`.
 */
export function flLibTestConfig(name: string) {
  return {
    ...FL_MEMORY_SAFE_POOL,
    name,
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    // Most libs have no spec file yet; without this the whole run fails on them.
    passWithNoTests: true,
    coverage: {
      reportsDirectory: `../../coverage/libs/${name}`,
      provider: 'v8' as const,
    },
  } satisfies ViteUserConfig['test'];
}
