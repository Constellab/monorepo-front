import { defineConfig } from 'eslint/config';
import nx from '@nx/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

import angular from 'angular-eslint';
export default defineConfig([
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    plugins: {
      '@nx': nx,
      'simple-import-sort': simpleImportSort,
    },
  },
  {
    ignores: ['**/node_modules', '**/dist', '**/vite.config.*.timestamp*', '**/vitest.config.*.timestamp*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],

    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],

          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],

      indent: [
        'error',
        2,
        {
          SwitchCase: 1,

          FunctionDeclaration: {
            parameters: 'first',
            body: 1,
          },

          FunctionExpression: {
            parameters: 'first',
            body: 1,
          },

          ignoredNodes: ['PropertyDefinition'],
        },
      ],

      'max-len': [
        'error',
        {
          code: 110,
          ignorePattern: '^(import|\\} from) .*',
        },
      ],

      'no-case-declarations': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': 'error',

      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
        },
      ],

      '@angular-eslint/no-empty-lifecycle-method': 'off',
      '@angular-eslint/no-input-rename': 'off',
      'no-extra-semi': 'off',
      'simple-import-sort/imports': 'error',
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
]);
