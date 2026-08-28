import { defineConfig } from 'eslint/config';
import nx from '@nx/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sonarjs from 'eslint-plugin-sonarjs';

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
        selector: ['function'],
        modifiers: ['exported'],
        // define as PascalCase because the prefix is not included in the format check
        // so if the name is e.g. "flMyFunction" it will still be valid because it checks for "MyFunction"
        format: ['PascalCase'],
        prefix: [prefix],
      },
      {
        selector: ['variable'],
        modifiers: ['exported'],
        format: ['UPPER_CASE'],
        prefix: [prefix.toUpperCase() + '_'],
      },
    ],
  };

  if (disableModuleBoundary) {
    rules['@nx/enforce-module-boundaries'] = 'off';
  }

  if (isLib) {
    rules['@angular-eslint/prefer-standalone'] = 'off';
  }

  // Some directives (e.g. fl-class, fl-hide) alias inputs with dotted names
  // (e.g. `flClass.xs`) that are part of their public template API and cannot
  // be expressed as property names, so aliasing is required here.
  rules['@angular-eslint/no-input-rename'] = 'off';

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
      sonarjs: sonarjs,
    },
  },
  {
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/out-tsc',
      '**/coverage',
      // Build caches holding bundled copies of dependencies, not source.
      '**/.angular',
      '**/.nx',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
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

      indent: 'off',
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

      // Method complexity budgets. `variant: 'modified'` counts a whole `switch`
      // as one path, so mapping tables (status enums, file-icon lookups) are not
      // punished for having many cases; cognitive-complexity then weights nesting.
      complexity: ['error', { max: 10, variant: 'modified' }],
      'sonarjs/cognitive-complexity': ['error', 15],
      'max-depth': ['error', 4],
      'max-statements': ['error', 25],
      'max-nested-callbacks': ['error', 3],
      'max-lines-per-function': ['error', { max: 80, skipBlankLines: true, skipComments: true }],

      // `max-params` cannot exempt constructors, and NestJS DI constructors
      // legitimately take many. Restrict the parameter count on everything else.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'MethodDefinition[kind!="constructor"] > FunctionExpression[params.length>6]',
          message: 'This method takes more than 6 parameters. Pass an options object instead.',
        },
        {
          selector: 'FunctionDeclaration[params.length>6]',
          message: 'This function takes more than 6 parameters. Pass an options object instead.',
        },
      ],
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

  // A spec is a flat list of arrange/act/assert steps, so its length and
  // statement count say nothing about complexity, and `describe > describe >
  // it > callback` already nests four deep. The branching budgets still apply:
  // no test in the repo exceeds a cognitive complexity of 8.
  {
    files: ['**/*.spec.ts', 'apps/*/test/**/*.ts'],
    rules: {
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'max-nested-callbacks': 'off',
    },
  },

  // Must stay last: it overrides `nx.configs['flat/angular']`, which enables this rule.
  //
  // Enabled by default in angular-eslint v22 (ts-recommended). Angular 22 made OnPush the
  // default strategy, and the v22 `ChangeDetectionStrategy.Eager` migration annotated ~940
  // existing components to preserve their previous behaviour. This rule flags every one of
  // them, so it is turned off while OnPush adoption is done incrementally.
  // Re-enable (ideally per project) once components have been migrated to OnPush.
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    },
  },
]);
