// Reglas comunes a TODO el monorepo. Codifican CODING_GUIDELINES.md:
// archivos pequeños, funciones cortas, sin `any`, siempre fetch, sin console suelto.
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/.next/**', '**/.expo/**', '**/node_modules/**', '**/*.config.*'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Archivos y funciones pequeñas
      'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['warn', { max: 60, skipBlankLines: true, skipComments: true }],
      complexity: ['warn', 10],
      'max-depth': ['error', 3],
      'max-params': ['error', 4],

      // Tipado estricto
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Gestión de errores: nunca tragar errores
      'no-empty': ['error', { allowEmptyCatch: false }],
      'prefer-promise-reject-errors': 'error',

      // Siempre fetch
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'axios', message: 'Usa fetch (ver @af/api-client).' },
            { name: 'node-fetch', message: 'fetch es nativo en Node 22.' },
          ],
          patterns: [{ group: ['ky', 'got', 'superagent'], message: 'Usa fetch.' }],
        },
      ],

      // Logs vía logger, no console
      'no-console': ['error', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
    },
  },
  prettier,
);
