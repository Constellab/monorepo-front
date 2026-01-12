import { defineConfig } from 'eslint/config';
import baseConfig from '../../eslint.config.mjs';
import nx from '@nx/eslint-plugin';

export default defineConfig([
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'li',
          style: 'camelCase',
        },
      ],

      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'li',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['class', 'interface', 'typeAlias'],
          modifiers: ['exported'],
          format: ['PascalCase'],
          prefix: ['Li'],
        },
        {
          selector: ['function', 'variable'],
          modifiers: ['exported'],
          format: ['camelCase'],
          prefix: ['li'],
        },
      ],
    },
  },
]);
