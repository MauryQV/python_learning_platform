// frontend/eslint.config.cjs
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  // Ignora carpetas de build
  { ignores: ['dist', 'node_modules'] },

  // Habilita globals de navegador
  {
    languageOptions: {
      globals: {
        ...globals.browser,     // <-- window, localStorage, console, etc.
        // ...globals.node      // (opcional si tienes scripts Node en el mismo repo)
      },
    },
    rules: {
      // Si deseas permitir console sin advertencias:
      // 'no-console': 'off',
    },
  },

  // Reglas base
  js.configs.recommended,
];

