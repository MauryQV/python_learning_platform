import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
    },
    settings: {
      react: {
        version: "detect", // Detecta automáticamente la versión de React
      },
    },
    extends: [
      js.configs.recommended,
      pluginReact.configs.flat.recommended, // Reglas recomendadas de React
    ],
    rules: {
      "react/react-in-jsx-scope": "off", // No es necesario importar React en cada archivo (Vite lo hace)
      "react/prop-types": "off", // Desactiva advertencias sobre PropTypes (si no los usas)
      "no-unused-vars": "warn", // Advierte si hay variables sin usar
      "no-console": "off", // Permite usar console.log (puedes poner "warn" si prefieres)
    },
  },
]);
