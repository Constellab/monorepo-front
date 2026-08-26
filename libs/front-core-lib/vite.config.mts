/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';

import { flLibTestConfig } from '../../vitest.shared.mts';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/front-core-lib',
  plugins: [angular(), tsconfigPaths()],
  test: flLibTestConfig('front-core-lib'),
}));
