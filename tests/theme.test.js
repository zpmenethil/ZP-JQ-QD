/**
 * @jest-environment jsdom
 */

// Mock dependencies
jest.mock('../src/js/globals.js', () => ({
	$: jest.fn((selector) => {
		const mockElement = {
			addClass: jest.fn().mockReturnThis(),
			removeClass: jest.fn().mockReturnThis(),
			on: jest.fn().mockReturnThis(),
			// Add other jQuery methods if needed by the theme logic
		};
		return mockElement;
	}),
	hljs: {
		highlightElement: jest.fn(),
	},
}));

jest.mock('../src/js/tooltips.js', () => ({
	reinitializeTooltips: jest.fn(),
}));

// Mock session.js partially - we need the real STORAGE_TYPE but mock the functions
jest.mock('../src/js/session.js', () => {
	const originalModule = jest.requireActual('../src/js/session.js');
	return {
		...originalModule, // Keep original exports like STORAGE_TYPE
		saveToStorage: jest.fn(),
		getFromStorage: jest.fn(),
	};
});

// Import the module to test AFTER mocks
import { initThemeToggle } from '../src/js/theme.js';
import { $, hljs } from '../src/js/globals.js';
import { reinitializeTooltips } from '../src/js/tooltips.js';
import { saveToStorage, getFromStorage, STORAGE_TYPE } from '../src/js/session.js'; // Import mocks and real STORAGE_TYPE

// --- Mock window.matchMedia ---
const mockMatchMedia = (matches) => {
	const mediaQueryList = {
		matches: matches,
		media: '(prefers-color-scheme: dark)',
		onchange: null,
		addListener: jest.fn(), // Deprecated but good to mock
		removeListener: jest.fn(), // Deprecated but good to mock
		addEventListener: jest.fn((type, listener) => {
			if (type === 'change') {
				mediaQueryList.changeListener = listener;
			}
		}),
		removeEventListener: jest.fn((type, listener) => {
			if (type === 'change' && mediaQueryList.changeListener === listener) {
				mediaQueryList.changeListener = null;
			}
		}),
		dispatchEvent: jest.fn(),
		// Helper to simulate change
		simulateChange: (newMatches) => {
			mediaQueryList.matches = newMatches;
			if (mediaQueryList.changeListener) {
				mediaQueryList.changeListener({ matches: newMatches });
			}
		},
	};
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		configurable: true,
		value: jest.fn().mockImplementation((query) => {
			if (query === '(prefers-color-scheme: dark)') {
				return mediaQueryList;
			}
			// Fallback for other queries if needed
			return {
				matches: false,
				addListener: jest.fn(),
				removeListener: jest.fn(),
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			};
		}),
	});
	return mediaQueryList; // Return the specific mock for dark scheme query
};

describe('Theme Management', () => {
	let mockDarkMatcher;
	let themeToggleButtonMock;
	let lightIconMock;
	let darkIconMock;

	beforeEach(() => {
		// Reset mocks
		jest.clearAllMocks();

		// Mock DOM elements
		document.documentElement.setAttribute('data-bs-theme', ''); // Reset theme attribute
		document.body.innerHTML = `
            <button id="themeToggle"></button>
            <svg id="lightIcon"></svg>
            <svg id="darkIcon" class="d-none"></svg>
            <pre><code id="codePreview"></code></pre>
        `;

		// Setup jQuery mocks for specific elements
		themeToggleButtonMock = { on: jest.fn() };
		lightIconMock = { addClass: jest.fn(), removeClass: jest.fn() };
		darkIconMock = { addClass: jest.fn(), removeClass: jest.fn() };

		$.mockImplementation((selector) => {
			if (selector === '#themeToggle') return themeToggleButtonMock;
			if (selector === '#lightIcon') return lightIconMock;
			if (selector === '#darkIcon') return darkIconMock;
			return {
				// Default mock for other selectors if any
				addClass: jest.fn(),
				removeClass: jest.fn(),
				on: jest.fn(),
			};
		});

		// Mock matchMedia (defaulting to light preference)
		mockDarkMatcher = mockMatchMedia(false);

		// Mock console
		console.log = jest.fn();
		console.error = jest.fn(); // In case session.js mocks throw errors internally
	});

	// --- Initialization Tests ---
	describe('initThemeToggle', () => {
		it('should initialize with theme from localStorage (JSON object)', () => {
			getFromStorage.mockReturnValue(JSON.stringify({ theme: 'dark' }));
			initThemeToggle();

			expect(getFromStorage).toHaveBeenCalledWith('ZPL', null, STORAGE_TYPE.LOCAL);
			expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
			expect(saveToStorage).toHaveBeenCalledWith('ZPL', { theme: 'dark' }, STORAGE_TYPE.LOCAL); // applyTheme saves it back
			expect(lightIconMock.addClass).toHaveBeenCalledWith('d-none');
			expect(darkIconMock.removeClass).toHaveBeenCalledWith('d-none');
			expect(hljs.highlightElement).toHaveBeenCalled();
			expect(reinitializeTooltips).toHaveBeenCalled();
		});

		it('should initialize with theme from localStorage (plain string "light")', () => {
			getFromStorage.mockReturnValue('light');
			initThemeToggle();

			expect(getFromStorage).toHaveBeenCalledWith('ZPL', null, STORAGE_TYPE.LOCAL);
			expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
			expect(saveToStorage).toHaveBeenCalledWith('ZPL', { theme: 'light' }, STORAGE_TYPE.LOCAL);
			expect(darkIconMock.addClass).toHaveBeenCalledWith('d-none');
			expect(lightIconMock.removeClass).toHaveBeenCalledWith('d-none');
		});

		it('should initialize with theme from localStorage (plain string "dark")', () => {
			getFromStorage.mockReturnValue('dark');
			initThemeToggle();

			expect(getFromStorage).toHaveBeenCalledWith('ZPL', null, STORAGE_TYPE.LOCAL);
			expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
			expect(saveToStorage).toHaveBeenCalledWith('ZPL', { theme: 'dark' }, STORAGE_TYPE.LOCAL);
			expect(lightIconMock.addClass).toHaveBeenCalledWith('d-none');
			expect(darkIconMock.removeClass).toHaveBeenCalledWith('d-none');
		});

		it('should initialize with system preference (dark) if localStorage is empty', () => {
			getFromStorage.mockReturnValue(null);
			mockDarkMatcher = mockMatchMedia(true); // System prefers dark
			initThemeToggle();

			expect(getFromStorage).toHaveBeenCalledWith('ZPL', null, STORAGE_TYPE.LOCAL);
			expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
			expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
			expect(saveToStorage).toHaveBeenCalledWith('ZPL', { theme: 'dark' }, STORAGE_TYPE.LOCAL);
			expect(lightIconMock.addClass).toHaveBeenCalledWith('d-none');
			expect(darkIconMock.removeClass).toHaveBeenCalledWith('d-none');
		});

		it('should initialize with system preference (light) if localStorage is empty', () => {
			getFromStorage.mockReturnValue(null);
			mockDarkMatcher = mockMatchMedia(false); // System prefers light
			initThemeToggle();

			expect(getFromStorage).toHaveBeenCalledWith('ZPL', null, STORAGE_TYPE.LOCAL);
			expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
			expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
			expect(saveToStorage).toHaveBeenCalledWith('ZPL', { theme: 'light' }, STORAGE_TYPE.LOCAL);
			expect(darkIconMock.addClass).toHaveBeenCalledWith('d-none');
			expect(lightIconMock.removeClass).toHaveBeenCalledWith('d-none');
		});

		it('should attach click listener to theme toggle button', () => {
			initThemeToggle();
			expect(themeToggleButtonMock.on).toHaveBeenCalledWith('click', expect.any(Function));
		});

		it('should attach change listener to media query', () => {
			initThemeToggle();
			expect(mockDarkMatcher.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
		});
	});

	// --- Event Listener Tests ---
	describe('Event Listeners', () => {
		it('theme toggle click should switch from light to dark', () => {
			getFromStorage.mockReturnValue('light'); // Start light
			initThemeToggle();

			// Simulate click
			const clickHandler = themeToggleButtonMock.on.mock.calls[0][1];
			document.documentElement.setAttribute('data-bs-theme', 'light'); // Ensure current state is light before click
			clickHandler();

			// Check theme applied
			expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
			expect(saveToStorage).toHaveBeenCalledWith('ZPL', { theme: 'dark' }, STORAGE_TYPE.LOCAL);
			expect(lightIconMock.addClass).toHaveBeenCalledWith('d-none');
			expect(darkIconMock.removeClass).toHaveBeenCalledWith('d-none');
			expect(hljs.highlightElement).toHaveBeenCalledTimes(2); // Initial + toggle
			expect(reinitializeTooltips).toHaveBeenCalledTimes(2); // Initial + toggle
		});

		it('theme toggle click should switch from dark to light', () => {
			getFromStorage.mockReturnValue('dark'); // Start dark
			initThemeToggle();

			// Simulate click
			const clickHandler = themeToggleButtonMock.on.mock.calls[0][1];
			document.documentElement.setAttribute('data-bs-theme', 'dark'); // Ensure current state is dark before click
			clickHandler();

			// Check theme applied
			expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
			expect(saveToStorage).toHaveBeenCalledWith('ZPL', { theme: 'light' }, STORAGE_TYPE.LOCAL);
			expect(darkIconMock.addClass).toHaveBeenCalledWith('d-none');
			expect(lightIconMock.removeClass).toHaveBeenCalledWith('d-none');
		});

		it('system preference change should update theme if no theme is stored', () => {
			getFromStorage.mockReturnValue(null); // No stored theme
			mockDarkMatcher = mockMatchMedia(false); // Start with light preference
			initThemeToggle(); // Applies 'light' initially

			expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');

			// Simulate system change to dark
			getFromStorage.mockReturnValue(null); // Still no theme stored when listener fires
			mockDarkMatcher.simulateChange(true);

			// Check theme applied
			expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
			expect(saveToStorage).toHaveBeenCalledWith('ZPL', { theme: 'dark' }, STORAGE_TYPE.LOCAL);
			expect(lightIconMock.addClass).toHaveBeenCalledWith('d-none');
			expect(darkIconMock.removeClass).toHaveBeenCalledWith('d-none');
		});

		it('system preference change should NOT update theme if a theme is already stored', () => {
			getFromStorage.mockReturnValue(JSON.stringify({ theme: 'light' })); // User explicitly chose light
			mockDarkMatcher = mockMatchMedia(false); // System prefers light initially
			initThemeToggle(); // Applies 'light'

			expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
			saveToStorage.mockClear(); // Clear initial save call

			// Simulate system change to dark
			getFromStorage.mockReturnValue(JSON.stringify({ theme: 'light' })); // Still has stored theme when listener fires
			mockDarkMatcher.simulateChange(true);

			// Check theme DID NOT change
			expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
			expect(saveToStorage).not.toHaveBeenCalled(); // applyTheme was not called again
		});
	});
});
