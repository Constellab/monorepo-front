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
          prefix: 'lml',
          style: 'camelCase',
        },
      ],

      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'lml',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['class', 'interface', 'typeAlias'],
          modifiers: ['exported'],
          format: ['PascalCase'],
          prefix: ['Lml'],
        },
        {
          selector: ['function', 'variable'],
          modifiers: ['exported'],
          format: ['camelCase'],
          prefix: ['lml'],
        },
      ],
    },
  },
]);
