// Import dependencies
import { $, hljs } from './globals.js';
import { reinitializeTooltips } from './tooltips.js';

const THEME_STORAGE_KEY = 'zpTheme';

/**
 * Determine the initial theme based on storage, device preference, or default.
 * @returns {string} 'light' or 'dark'
 */
function determineInitialTheme() {
	const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
	if (storedTheme) {
		console.log(`Theme found in localStorage: ${storedTheme}`); // Added log
		return storedTheme; // Use stored theme if available
	}

	// If no stored theme, check device preference
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		console.log('Device prefers dark mode. Using dark theme.'); // Added log
		return 'dark'; // Use dark mode if preferred by device
	}

	console.log('No theme in localStorage or device preference found. Defaulting to light theme.'); // Added log
	return 'light'; // Default to light mode
}

/**
 * Apply the theme to the document and update UI elements.
 * @param {string} theme - 'light' or 'dark'
 */
function applyTheme(theme) {
	const lightIcon = $('#lightIcon');
	const darkIcon = $('#darkIcon');

	document.documentElement.setAttribute('data-bs-theme', theme);
	localStorage.setItem(THEME_STORAGE_KEY, theme); // Save the determined/updated theme

	if (theme === 'dark') {
		lightIcon.addClass('d-none');
		darkIcon.removeClass('d-none');
	} else {
		darkIcon.addClass('d-none');
		lightIcon.removeClass('d-none');
	}

	// Re-highlight code if preview exists
	if (document.getElementById('codePreview')) {
		hljs.highlightElement(document.getElementById('codePreview'));
	}

	// Reinitialize tooltips for proper styling
	reinitializeTooltips();
}

/**
 * Initialize theme toggle functionality.
 * Handles theme switching between light and dark modes,
 * persists the theme choice in localStorage,
 * and updates UI elements accordingly.
 */
export function initThemeToggle() {
	const themeToggle = $('#themeToggle');
	const initialTheme = determineInitialTheme();

	// Set initial theme based on determination logic
	applyTheme(initialTheme);

	// Add listener for device preference changes
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
		// Only update if there's no user-set theme in localStorage
		if (!localStorage.getItem(THEME_STORAGE_KEY)) {
			const newColorScheme = event.matches ? 'dark' : 'light';
			applyTheme(newColorScheme);
		}
	});

	themeToggle.on('click', () => {
		const currentTheme = document.documentElement.getAttribute('data-bs-theme');
		const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
		applyTheme(newTheme); // Apply the new theme and save it
	});
}
