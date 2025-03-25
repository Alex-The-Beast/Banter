import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import pluginReact from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: { globals: globals.node 

    },
    plugins:{
      "simple-import-sort": simpleImportSort
    },
    rules:{
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error"
    },
  },
  
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    extends: ['js/recommended']
  },
  pluginReact.configs.flat.recommended
]);
