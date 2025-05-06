/**
 * @jest-environment jsdom
 */

// Mocking dependencies
jest.mock('../src/js/globals.js', () => ({
	$: jest.fn(selector => {
		// Mock jQuery functionality
		const mockJQuery = {
			val: jest.fn().mockImplementation(function (value) {
				if (value === undefined) {
					return this._value || '';
				} else {
					this._value = value;
					return this;
				}
			}),
			attr: jest.fn().mockReturnThis(),
			on: jest.fn().mockReturnThis(),
			find: jest.fn().mockReturnThis(),
			tooltip: jest.fn().mockReturnThis()
		};

		// Store the selector to identify the element
		mockJQuery.selector = selector;
		return mockJQuery;
	})
}));

jest.mock('../src/js/extendedOptions.js', () => ({
	extendedOptions: {
		redirectUrl: ''
	}
}));

jest.mock('../src/js/codePreview.js', () => ({
	updateCodePreview: jest.fn()
}));

// Import modules after mocking
import { updateRedirectUrl, initUrlBuilder } from '../src/js/urlBuilder.js';
import { $ } from '../src/js/globals.js';
import { extendedOptions } from '../src/js/extendedOptions.js';
import { updateCodePreview } from '../src/js/codePreview.js';

// Setup DOM elements needed for tests
function setupDom() {
	document.body.innerHTML = `
		<input id="redirectUrlInput" />
		<input id="callbackUrlInput" />
		<select id="domainSelect"></select>
		<div id="urlPreview"></div>
		<div id="modalUrlPreview"></div>
		<button id="modalCopyUrlBtn"></button>
		<button id="applyUrlChanges"></button>
		<div id="urlBuilderModal"></div>
	`;

	// Mock document.querySelector for radio buttons
	const originalQuerySelector = document.querySelector;
	document.querySelector = jest.fn().mockImplementation(selector => {
		if (selector === 'input[name="subdomain"]:checked') {
			return { value: 'test' };
		}
		if (selector === 'input[name="version"]:checked') {
			return { value: 'v1' };
		}
		return originalQuerySelector.call(document, selector);
	});

	// Mock querySelectorAll
	const originalQuerySelectorAll = document.querySelectorAll;
	document.querySelectorAll = jest.fn().mockImplementation(selector => {
		if (selector === 'input[name="subdomain"]') {
			return [
				{ value: 'test', addEventListener: jest.fn() },
				{ value: 'dev', addEventListener: jest.fn() }
			];
		}
		if (selector === 'input[name="version"]') {
			return [
				{ value: 'v1', addEventListener: jest.fn() },
				{ value: 'v2', addEventListener: jest.fn() }
			];
		}
		return originalQuerySelectorAll.call(document, selector);
	});

	// Mock getElementById
	const originalGetElementById = document.getElementById;
	document.getElementById = jest.fn().mockImplementation(id => {
		if (id === 'domainSelect') {
			return { value: 'zenith', addEventListener: jest.fn() };
		}
		if (id === 'urlPreview') {
			return { value: '' };
		}
		if (id === 'modalUrlPreview') {
			return { value: '', select: jest.fn() };
		}
		if (id === 'modalCopyUrlBtn') {
			return { innerHTML: '<i class="bi bi-clipboard"></i>', addEventListener: jest.fn() };
		}
		if (id === 'applyUrlChanges') {
			return { addEventListener: jest.fn() };
		}
		return originalGetElementById.call(document, id);
	});

	// Mock document.execCommand
	document.execCommand = jest.fn();

	// Mock sessionStorage
	const sessionStorageMock = (() => {
		let store = {};
		return {
			getItem: jest.fn(key => store[key] || null),
			setItem: jest.fn((key, value) => {
				store[key] = value.toString();
			}),
			clear: jest.fn(() => {
				store = {};
			})
		};
	})();

	Object.defineProperty(window, 'sessionStorage', {
		value: sessionStorageMock
	});

	// Mock console.log
	console.log = jest.fn();
}

describe('urlBuilder', () => {
	beforeEach(() => {
		// Set up DOM elements before each test
		setupDom();

		// Clear mocks
		jest.clearAllMocks();
	});

	describe('updateRedirectUrl', () => {
		it('should update redirect URL based on domain and subdomain', () => {
			// Setup jQuery mock returns
			$('#domainSelect').val.mockReturnValue('zenith');
			$('input[name="subdomain"]:checked').val.mockReturnValue('test');

			// Call the function
			updateRedirectUrl();

			// Assertions
			expect($('#redirectUrlInput').val).toHaveBeenCalledWith('https://test.zenith.com.au/demo/');
			expect($('#callbackUrlInput').attr).toHaveBeenCalledWith('placeholder', 'https://test.zenith.com.au/callback/');
			expect(extendedOptions.redirectUrl).toBe('https://test.zenith.com.au/demo/');
			expect(updateCodePreview).toHaveBeenCalled();
		});

		it('should update redirect URL with different domain and subdomain', () => {
			// Setup jQuery mock returns
			$('#domainSelect').val.mockReturnValue('payments');
			$('input[name="subdomain"]:checked').val.mockReturnValue('dev');

			// Call the function
			updateRedirectUrl();

			// Assertions
			expect($('#redirectUrlInput').val).toHaveBeenCalledWith('https://dev.payments.com.au/demo/');
			expect($('#callbackUrlInput').attr).toHaveBeenCalledWith('placeholder', 'https://dev.payments.com.au/callback/');
			expect(extendedOptions.redirectUrl).toBe('https://dev.payments.com.au/demo/');
			expect(updateCodePreview).toHaveBeenCalled();
		});
	});

	describe('initUrlBuilder', () => {
		it('should initialize URL builder without restoring from session', () => {
			// Call the function with restoreFromSession = false
			initUrlBuilder(false);

			// Assertions
			expect(sessionStorage.getItem).not.toHaveBeenCalled();
			expect(sessionStorage.setItem).toHaveBeenCalledWith('demo_subdomain', 'test');
			expect(sessionStorage.setItem).toHaveBeenCalledWith('demo_domain', 'zenith');
			expect(sessionStorage.setItem).toHaveBeenCalledWith('demo_version', 'v1');

			// Verify event listeners were properly set up
			const domainSelect = document.getElementById('domainSelect');
			expect(domainSelect.addEventListener).toHaveBeenCalled();
		});

		it('should restore from session storage when restoreFromSession is true', () => {
			// Setup session storage mock values
			sessionStorage.getItem.mockImplementation(key => {
				const values = {
					demo_subdomain: 'dev',
					demo_domain: 'payments',
					demo_version: 'v2'
				};
				return values[key] || null;
			});

			// Mock document.querySelector to simulate finding inputs
			document.querySelector.mockImplementation(selector => {
				if (selector === 'input[name="subdomain"][value="dev"]') {
					return { checked: false }; // Will be set to true by the function
				}
				if (selector === 'input[name="version"][value="v2"]') {
					return { checked: false }; // Will be set to true by the function
				}
				if (selector === 'input[name="subdomain"]:checked') {
					return { value: 'dev' };
				}
				if (selector === 'input[name="version"]:checked') {
					return { value: 'v2' };
				}
				return null;
			});

			// Call the function with default restoreFromSession = true
			initUrlBuilder();

			// Assertions
			expect(sessionStorage.getItem).toHaveBeenCalledWith('demo_subdomain');
			expect(sessionStorage.getItem).toHaveBeenCalledWith('demo_domain');
			expect(sessionStorage.getItem).toHaveBeenCalledWith('demo_version');
		});

		it('should handle URL builder modal interactions', () => {
			// Setup jQuery mock for modal
			const modalMock = {
				on: jest.fn().mockImplementation((event, callback) => {
					if (event === 'shown.bs.modal') {
						callback(); // Execute the callback to test modal logic
					}
					return modalMock;
				}),
				find: jest.fn().mockReturnThis(),
				tooltip: jest.fn()
			};
			$('#urlBuilderModal').mockReturnValue(modalMock);

			// Call the function
			initUrlBuilder(false);

			// Assert modal tooltip initialization
			expect(modalMock.on).toHaveBeenCalledWith('shown.bs.modal', expect.any(Function));
			expect(modalMock.find).toHaveBeenCalledWith('[data-bs-toggle="tooltip"]');
			expect(modalMock.tooltip).toHaveBeenCalled();

			// Test URL copy functionality
			const modalCopyUrlBtn = document.getElementById('modalCopyUrlBtn');
			const modalUrlPreview = document.getElementById('modalUrlPreview');

			// Simulate button click
			const clickEventListener = modalCopyUrlBtn.addEventListener.mock.calls[0][1];
			clickEventListener();

			// Assertions for copy functionality
			expect(modalUrlPreview.select).toHaveBeenCalled();
			expect(document.execCommand).toHaveBeenCalledWith('copy');
			expect(console.log).toHaveBeenCalledWith(expect.stringContaining('URL copied to clipboard:'));
		});

		it('should handle applying URL changes from modal', () => {
			// Mock for applyUrlChanges button
			const applyUrlChangesBtn = document.getElementById('applyUrlChanges');

			// Call the function
			initUrlBuilder(false);

			// Simulate button click
			const clickEventListener = applyUrlChangesBtn.addEventListener.mock.calls[0][1];
			clickEventListener();

			// Assertions
			expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Applying URL changes from modal'));
		});
	});
});
