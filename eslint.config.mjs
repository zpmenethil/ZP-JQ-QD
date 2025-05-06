import js from '@eslint/js';
import globals from 'globals';
import css from '@eslint/css';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	// JS files in src/js only
	{ files: ['src/js/**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'] },
	{ files: ['src/js/**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.browser } },
	{ files: ['src/js.fp/**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.browser } },
	{ files: ['src/js.fp/**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.browser } },
	// CSS files in src/css only
	{
		files: ['src/css/**/*.css'],
		plugins: { css },
		language: 'css/css',
		extends: ['css/recommended'],
	},
]);
