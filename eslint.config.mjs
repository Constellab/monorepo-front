import { defineConfig } from 'eslint/config';
import nx from '@nx/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

import angular from 'angular-eslint';

function getSubConfigs(folder, prefix, isLib, disableModuleBoundary) {
  const filesPattern = isLib
    ? [`libs/${folder}/**/*.ts`, `libs/${folder}/**/*.tsx`]
    : [`apps/${folder}/**/*.ts`, `apps/${folder}/**/*.tsx`];

  const selectorPrefix = prefix;
  const classPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1);

  const rules = {
    '@angular-eslint/directive-selector': [
      'error',
      {
        type: 'attribute',
        prefix: selectorPrefix,
        style: 'camelCase',
      },
    ],
    '@angular-eslint/component-selector': [
      'error',
      {
        type: 'element',
        prefix: selectorPrefix,
        style: 'kebab-case',
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['class', 'interface', 'typeAlias'],
        modifiers: ['exported'],
        format: ['PascalCase'],
        prefix: [classPrefix],
      },
      {
        selector: ['function', 'variable'],
        modifiers: ['exported'],
        // define as PascalCase because the prefix is not included in the format check
        // so if the name is e.g. "flMyFunction" it will still be valid because it checks for "MyFunction"
        format: ['PascalCase'],
        prefix: [prefix],
      },
    ],
  };

  if (disableModuleBoundary) {
    rules['@nx/enforce-module-boundaries'] = 'off';
  }

  if (isLib) {
    rules['@angular-eslint/prefer-standalone'] = 'off';
  }

  return {
    files: filesPattern,
    rules: rules,
  };
}

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

  // App and library-specific configurations
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],

  // Apps
  getSubConfigs('ca-space-front', 'ca', false, false),
  getSubConfigs('dc-dashboard-components', 'dc', false, false),
  getSubConfigs('ha-community-front', 'ha', false, false),
  getSubConfigs('lab-front', 'lab', false, false),
  getSubConfigs('lab-manager-standalone', 'lms', false, false),

  // Libraries
  getSubConfigs('bio-network', 'bn', true, false),
  getSubConfigs('chart', 'ch', true, false),
  getSubConfigs('community-lib', 'co', true, false),
  getSubConfigs('front-core-lib', 'fl', true, true),
  getSubConfigs('lab-lib', 'li', true, true),
  getSubConfigs('lab-manager-lib', 'lml', true, false),
  getSubConfigs('mail', 'ma', true, false),
  getSubConfigs('protocol', 'pr', true, false),
  getSubConfigs('resource-view', 'rv', true, false),
  getSubConfigs('spreadsheet', 'sp', true, false),
  getSubConfigs('technical-doc', 'td', true, false),
  getSubConfigs('text-editor', 'te', true, false),
]);
