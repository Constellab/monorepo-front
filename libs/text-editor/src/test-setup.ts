import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';

import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { vi } from 'vitest';

setupTestBed();

/**
 * `testMock` — the mocking namespace used by the specs of `src/lib/model/lib`.
 *
 * That folder is developed in a separate repository and copied into this one as-is, and the two
 * repositories run its specs on different runners: Jest upstream, Vitest here. The only runner API
 * the specs need is `fn()` (plus the `mockResolvedValue` / `mockImplementation` chained on it),
 * which Jest and Vitest expose identically, so the specs go through this deliberately
 * runner-neutral global instead of naming either one:
 *
 *   const getUser = testMock.fn().mockResolvedValue(user);
 *
 * Each repository binds the name to its own runner — `vi` below, `jest` upstream — so the copied
 * specs run unmodified on both. The name is the contract between the two: renaming it here means
 * renaming it upstream too. Its type declaration lives in `src/types.d.ts`.
 *
 * Keeping the alias out of the specs also stops the next copy from silently reverting it. A
 * runner global that resolves to nothing throws `ReferenceError` from the top-level `beforeEach`
 * that uses it, before the body of every test in its file, so a single missing name fails those
 * specs wholesale (118 tests) rather than in one visible place.
 */
(globalThis as unknown as { testMock: typeof vi }).testMock = vi;
