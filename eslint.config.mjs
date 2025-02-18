// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import * as importPlugin from 'eslint-plugin-import';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'babel.config.js', 'eslint.config.mjs'],
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-default-export': 'error',
    },
  },
  ...tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
      plugins: {
        import: importPlugin,
      },
      settings: {
        "import/resolver": {
          "typescript": true,
          "node": true,
        }
      },
      rules: {
        ...importPlugin.configs?.recommended?.rules ?? {},
        ...importPlugin.configs?.typescript?.rules ?? {},
      },
    },
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
    }
  ),
];
