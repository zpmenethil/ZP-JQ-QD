// Import dependencies
import { $, hljs } from './globals.js';
import { reinitializeTooltips } from './tooltips.js';
import { saveToStorage, getFromStorage, STORAGE_TYPE } from './session.js';

const THEME_STORAGE_KEY = 'ZPL';

/**
 * Determine the initial theme based on storage or device preference.
 * Supports both plain strings ("light"/"dark") and JSON-wrapped strings.
 * @returns {'light'|'dark'}
 */
function determineInitialTheme() {
	const raw = getFromStorage(THEME_STORAGE_KEY, null, STORAGE_TYPE.LOCAL);
	let theme;

	if (typeof raw === 'string') {
		try {
			const obj = JSON.parse(raw);
			if (obj && typeof obj.theme === 'string') {
				theme = obj.theme;
			}

			// eslint-disable-next-line no-empty, no-unused-vars
		} catch (e) {}
		if (!theme && (raw === 'light' || raw === 'dark')) {
			theme = raw;
		}
	} else if (raw && typeof raw === 'object' && typeof raw.theme === 'string') {
		theme = raw.theme;
	}

	if (theme === 'light' || theme === 'dark') {
		return theme;
	}

	// No usable stored theme → system preference
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	theme = prefersDark ? 'dark' : 'light';
	// console.log(`Device preference found: ${theme}`);
	return theme;
}

/**
 * Apply the theme and persist as a JSON object.
 * @param {'light'|'dark'} theme
 */
function applyTheme(theme) {
	const lightIcon = $('#lightIcon');
	const darkIcon = $('#darkIcon');

	document.documentElement.setAttribute('data-bs-theme', theme);

	saveToStorage(THEME_STORAGE_KEY, { theme }, STORAGE_TYPE.LOCAL);

	if (theme === 'dark') {
		lightIcon.addClass('d-none');
		darkIcon.removeClass('d-none');
	} else {
		darkIcon.addClass('d-none');
		lightIcon.removeClass('d-none');
	}

	const codePreview = document.getElementById('codePreview');
	if (codePreview) hljs.highlightElement(codePreview);
	reinitializeTooltips();
}
/**
 * Wire everything up.
 */
export function initThemeToggle() {
	const themeToggle = $('#themeToggle');
	const initialTheme = determineInitialTheme();

	applyTheme(initialTheme);

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
		// only honor system if user hasn’t explicitly picked
		const stored = getFromStorage(THEME_STORAGE_KEY, null, STORAGE_TYPE.LOCAL);
		if (!stored) {
			applyTheme(event.matches ? 'dark' : 'light');
		}
	});

	themeToggle.on('click', () => {
		const current = document.documentElement.getAttribute('data-bs-theme');
		const next = current === 'dark' ? 'light' : 'dark';
		applyTheme(next);
	});
}
