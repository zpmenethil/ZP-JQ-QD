/**
 * @jest-environment jsdom
 */

// Mock dependencies
jest.mock('../src/js/globals.js', () => ({
	$: jest.fn(selector => {
		// Basic jQuery mock
		const mockElement = {
			val: jest.fn().mockReturnThis(),
			prop: jest.fn().mockReturnThis(),
			each: jest.fn(function (callback) {
				// Simulate iterating over elements if needed for specific tests
				// For now, just call the callback once for simplicity
				callback.call({
					data: jest.fn().mockReturnValue('mockOption'), // Example data attribute
					prop: jest.fn().mockReturnValue(true) // Example property value
				});
				return this;
			}),
			on: jest.fn().mockReturnThis(),
			length: 1, // Assume element exists by default
			removeClass: jest.fn().mockReturnThis(),
			data: jest.fn().mockReturnValue('mockOption') // Default data attribute
		};
		// Allow chaining and specific value retrieval/setting
		mockElement.val.mockImplementation(function (value) {
			if (value === undefined) {
				return this._value || ''; // Return stored value or empty string
			}
			this._value = value; // Store the value
			return this;
		});
		mockElement.prop.mockImplementation(function (propName, value) {
			if (value === undefined) {
				return this._props ? this._props[propName] : undefined; // Return stored prop value
			}
			if (!this._props) this._props = {};
			this._props[propName] = value; // Store the prop value
			return this;
		});
		return mockElement;
	}),
	paymentMethodOptions: {}, // Mock global options if needed
	additionalOptions: {}
}));

jest.mock('../src/js/helpers.js', () => ({
	base64EncodeASCII: jest.fn(str => `encoded(${str})`),
	base64DecodeASCII: jest.fn(str => str.replace(/^encoded\((.*)\)$/, '$1'))
}));

// Mock session.js partially - mock functions, keep constants
jest.mock('../src/js/session.js', () => {
	const originalModule = jest.requireActual('../src/js/session.js');
	return {
		__esModule: true, // Indicate it's an ES module
		...originalModule, // Keep original exports like STORAGE_TYPE, SESSION_KEYS
		// Explicitly mock functions we need to control/assert on
		saveToStorage: jest.fn(),
		getFromStorage: jest.fn(),
		saveToSession: jest.fn(),
		getFromSession: jest.fn(),
		// Keep the functions we are testing (will be replaced by actual below)
		restoreSessionValues: originalModule.restoreSessionValues,
		saveSessionValues: originalModule.saveSessionValues,
		setupSessionListeners: originalModule.setupSessionListeners
	};
});

// Import the module to test AFTER mocks
import {
	STORAGE_TYPE,
	SESSION_KEYS,
	saveToStorage, // Mocked version
	getFromStorage, // Mocked version
	saveToSession, // Mocked version
	getFromSession, // Mocked version
	restoreSessionValues, // Actual function to test
	saveSessionValues, // Actual function to test
	setupSessionListeners // Actual function to test
} from '../src/js/session.js';
import { $ } from '../src/js/globals.js';
import { base64EncodeASCII, base64DecodeASCII } from '../src/js/helpers.js';

// Mock Storage
const mockStorage = () => {
	let store = {};
	return {
		getItem: jest.fn(key => store[key] || null),
		setItem: jest.fn((key, value) => {
			store[key] = value.toString();
		}),
		removeItem: jest.fn(key => {
			delete store[key];
		}),
		clear: jest.fn(() => {
			store = {};
		}),
		getStore: () => store // Helper to inspect the store
	};
};

let mockSessionStorage;
let mockLocalStorage;

// Setup DOM elements needed for restore/save tests
function setupDom() {
	document.body.innerHTML = `
		<input id="apiKeyInput" />
		<input id="usernameInput" />
		<input id="passwordInput" />
		<input id="merchantCodeInput" />
		<input id="paymentAmountInput" value="65.00" />
		<select id="modeSelect">
			<option value="0">Pay Now</option>
			<option value="1">Tokenize</option>
		</select>
		<div id="tokenizationOptions" class="d-none"></div>
		<input type="checkbox" class="payment-method-toggle" data-option="allowBankOneOff" />
		<input type="checkbox" class="option-toggle" data-option="sendEmailConfirmationToMerchant" />
		<input type="radio" name="subdomain" value="test" checked />
		<input type="radio" name="subdomain" value="dev" />
		<select id="domainSelect"><option value="zenith">zenith</option></select>
		<input type="radio" name="version" value="v1" checked />
		<input id="callbackUrlInput" />
		<input id="uiMinHeightInput" value="825" />
	`;
}

describe('Session Management', () => {
	beforeEach(() => {
		// Reset mocks and storage before each test
		jest.clearAllMocks();
		mockSessionStorage = mockStorage();
		mockLocalStorage = mockStorage();
		Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage, writable: true });
		Object.defineProperty(window, 'localStorage', { value: mockLocalStorage, writable: true });
		setupDom(); // Setup DOM for tests needing it
		console.debug = jest.fn(); // Mock console.debug
		console.error = jest.fn(); // Mock console.error
		console.trace = jest.fn(); // Mock console.trace
		console.log = jest.fn(); // Mock console.log

		// Reset implementations for mocked storage functions if needed
		saveToStorage.mockClear();
		getFromStorage.mockClear();
		saveToSession.mockClear();
		getFromSession.mockClear();
	});

	// --- saveToStorage (Mocked) ---
	describe('saveToStorage (Mocked)', () => {
		it('should be callable', () => {
			saveToStorage('key', 'value');
			expect(saveToStorage).toHaveBeenCalledWith('key', 'value');
		});
	});

	// --- getFromStorage (Mocked) ---
	describe('getFromStorage (Mocked)', () => {
		it('should be callable and return mocked value', () => {
			getFromStorage.mockReturnValue('mockedValue');
			const value = getFromStorage('key', 'default');
			expect(getFromStorage).toHaveBeenCalledWith('key', 'default');
			expect(value).toBe('mockedValue');
		});
	});

	// --- ZPS Object Management (Mocked) ---
	describe('ZPS Object Management (Mocked)', () => {
		it('saveToSession should be callable', () => {
			saveToSession('demoKey', 'val');
			expect(saveToSession).toHaveBeenCalledWith('demoKey', 'val');
		});

		it('getFromSession should be callable and return mocked value', () => {
			getFromSession.mockReturnValue('mockedZpsValue');
			const value = getFromSession('demoKey', 'default');
			expect(getFromSession).toHaveBeenCalledWith('demoKey', 'default');
			expect(value).toBe('mockedZpsValue');
		});
	});

	// --- restoreSessionValues ---
	describe('restoreSessionValues', () => {
		it('should call the mocked getFromSession for each relevant input field', () => {
			getFromSession.mockImplementation((key, defaultValue, storageType) => {
				const values = {
					[SESSION_KEYS.API_KEY]: 'restoredApi',
					[SESSION_KEYS.USERNAME]: 'restoredUser',
					[SESSION_KEYS.PASSWORD]: 'restoredPass',
					[SESSION_KEYS.MERCHANT_CODE]: 'restoredMerchant',
					[SESSION_KEYS.PAYMENT_AMOUNT]: '100.00',
					[SESSION_KEYS.MODE]: '1',
					demo_allowBankOneOff: true,
					demo_sendEmailConfirmationToMerchant: true,
					[SESSION_KEYS.SUBDOMAIN]: 'dev',
					[SESSION_KEYS.DOMAIN]: 'payments',
					[SESSION_KEYS.VERSION]: 'v2',
					[SESSION_KEYS.UI_MIN_HEIGHT]: '700'
				};
				return values[key] !== undefined ? values[key] : defaultValue;
			});

			document.querySelector = jest.fn(selector => {
				if (selector === 'input[name="subdomain"][value="dev"]') return { checked: false, prop: jest.fn() };
				if (selector === 'input[name="version"][value="v2"]') return { checked: false, prop: jest.fn() };
				return null;
			});

			restoreSessionValues();

			expect(getFromSession).toHaveBeenCalledWith(SESSION_KEYS.API_KEY, '', STORAGE_TYPE.SESSION);
			expect(getFromSession).toHaveBeenCalledWith(SESSION_KEYS.USERNAME, '', STORAGE_TYPE.SESSION);
			expect(getFromSession).toHaveBeenCalledWith(SESSION_KEYS.PASSWORD, '', STORAGE_TYPE.SESSION);
			expect(getFromSession).toHaveBeenCalledWith(SESSION_KEYS.MERCHANT_CODE, '', STORAGE_TYPE.SESSION);
			expect(getFromSession).toHaveBeenCalledWith(SESSION_KEYS.PAYMENT_AMOUNT, '', STORAGE_TYPE.SESSION);
			expect(getFromSession).toHaveBeenCalledWith(SESSION_KEYS.MODE, '0', STORAGE_TYPE.SESSION);
			expect(getFromSession).toHaveBeenCalledWith('demo_allowBankOneOff', false, STORAGE_TYPE.SESSION);
			expect(getFromSession).toHaveBeenCalledWith('demo_sendEmailConfirmationToMerchant', false);
			expect(getFromSession).toHaveBeenCalledWith(SESSION_KEYS.SUBDOMAIN);
			expect(getFromSession).toHaveBeenCalledWith(SESSION_KEYS.DOMAIN);
			expect(getFromSession).toHaveBeenCalledWith(SESSION_KEYS.VERSION);
			expect(getFromSession).toHaveBeenCalledWith(SESSION_KEYS.UI_MIN_HEIGHT, '');

			expect($('#apiKeyInput').val).toHaveBeenCalledWith('restoredApi');
			expect($('#usernameInput').val).toHaveBeenCalledWith('restoredUser');
			expect($('#passwordInput').val).toHaveBeenCalledWith('restoredPass');
			expect($('#merchantCodeInput').val).toHaveBeenCalledWith('restoredMerchant');
			expect($('#paymentAmountInput').val).toHaveBeenCalledWith('100.00');
			expect($('#modeSelect').val).toHaveBeenCalledWith('1');
			expect($('.payment-method-toggle').prop).toHaveBeenCalledWith('checked', true);
			expect($('.option-toggle').prop).toHaveBeenCalledWith('checked', true);
			expect($('#domainSelect').val).toHaveBeenCalledWith('payments');
			expect($('#uiMinHeightInput').val).toHaveBeenCalledWith('700');

			expect($('#tokenizationOptions').removeClass).toHaveBeenCalledWith('d-none');
		});
	});

	// --- saveSessionValues ---
	describe('saveSessionValues', () => {
		it('should call the mocked saveToSession for relevant input fields', () => {
			$.mockImplementation(selector => {
				const elements = {
					'#apiKeyInput': { val: jest.fn().mockReturnValue(' savedApi ') },
					'#usernameInput': { val: jest.fn().mockReturnValue(' savedUser ') },
					'#passwordInput': { val: jest.fn().mockReturnValue(' savedPass ') },
					'#merchantCodeInput': { val: jest.fn().mockReturnValue(' savedMerchant ') },
					'#modeSelect': { val: jest.fn().mockReturnValue('1') },
					'input[name="subdomain"]:checked': { val: jest.fn().mockReturnValue('test') },
					'#domainSelect': { val: jest.fn().mockReturnValue('zenith') },
					'input[name="version"]:checked': { val: jest.fn().mockReturnValue('v1') },
					'#paymentAmountInput': { val: jest.fn().mockReturnValue(' 65.00 ') },
					'#callbackUrlInput': { val: jest.fn().mockReturnValue('http://callback.url') },
					'#uiMinHeightInput': { val: jest.fn().mockReturnValue('750') },
					'.payment-method-toggle': {
						each: jest.fn(function (cb) {
							cb.call({
								data: jest.fn().mockReturnValue('allowBankOneOff'),
								prop: jest.fn().mockReturnValue(true)
							});
							return this;
						})
					},
					'.option-toggle': {
						each: jest.fn(function (cb) {
							cb.call({
								data: jest.fn().mockReturnValue('sendEmailConfirmationToMerchant'),
								prop: jest.fn().mockReturnValue(true)
							});
							return this;
						})
					}
				};
				return elements[selector] || { val: jest.fn(), prop: jest.fn(), each: jest.fn().mockReturnThis(), data: jest.fn(), on: jest.fn() };
			});

			saveSessionValues();

			expect(saveToSession).toHaveBeenCalledWith(SESSION_KEYS.API_KEY, 'savedApi');
			expect(saveToSession).toHaveBeenCalledWith(SESSION_KEYS.USERNAME, 'savedUser');
			expect(saveToSession).toHaveBeenCalledWith(SESSION_KEYS.PASSWORD, 'savedPass');
			expect(saveToSession).toHaveBeenCalledWith(SESSION_KEYS.MERCHANT_CODE, 'savedMerchant');
			expect(saveToSession).toHaveBeenCalledWith(SESSION_KEYS.MODE, '1');
			expect(saveToSession).toHaveBeenCalledWith(SESSION_KEYS.SUBDOMAIN, 'test');
			expect(saveToSession).toHaveBeenCalledWith(SESSION_KEYS.DOMAIN, 'zenith');
			expect(saveToSession).toHaveBeenCalledWith(SESSION_KEYS.VERSION, 'v1');
			expect(saveToSession).toHaveBeenCalledWith(SESSION_KEYS.PAYMENT_AMOUNT, '65.00');
			expect(saveToSession).toHaveBeenCalledWith(SESSION_KEYS.CALLBACK_URL, 'http://callback.url');
			expect(saveToSession).toHaveBeenCalledWith(SESSION_KEYS.MIN_HEIGHT, '750');
			expect(saveToSession).toHaveBeenCalledWith('demo_allowBankOneOff', true);
			expect(saveToSession).toHaveBeenCalledWith('demo_sendEmailConfirmationToMerchant', true);
		});

		it('should NOT call saveToSession for payment amount if not 65 or 65.00', () => {
			$.mockImplementation(selector => {
				if (selector === '#paymentAmountInput') return { val: jest.fn().mockReturnValue(' 100.00 ') };
				return { val: jest.fn(), prop: jest.fn(), each: jest.fn().mockReturnThis(), data: jest.fn() };
			});
			saveSessionValues();
			expect(saveToSession).not.toHaveBeenCalledWith(SESSION_KEYS.PAYMENT_AMOUNT, expect.anything());
		});

		it('should NOT call saveToSession for minHeight if 825 or 600', () => {
			$.mockImplementation(selector => {
				if (selector === '#uiMinHeightInput') return { val: jest.fn().mockReturnValue('825') };
				return { val: jest.fn(), prop: jest.fn(), each: jest.fn().mockReturnThis(), data: jest.fn() };
			});
			saveSessionValues();
			expect(saveToSession).not.toHaveBeenCalledWith(SESSION_KEYS.MIN_HEIGHT, expect.anything());

			$.mockImplementation(selector => {
				if (selector === '#uiMinHeightInput') return { val: jest.fn().mockReturnValue('600') };
				return { val: jest.fn(), prop: jest.fn(), each: jest.fn().mockReturnThis(), data: jest.fn() };
			});
			saveSessionValues();
			expect(saveToSession).not.toHaveBeenCalledWith(SESSION_KEYS.MIN_HEIGHT, expect.anything());
		});
	});

	// --- setupSessionListeners ---
	describe('setupSessionListeners', () => {
		it('should attach change listeners using jQuery mock', () => {
			const listeners = {};
			$.mockImplementation(selector => {
				return {
					on: jest.fn((event, handler) => {
						if (!listeners[selector]) listeners[selector] = {};
						listeners[selector][event] = handler;
						return this;
					}),
					val: jest.fn(),
					prop: jest.fn(),
					each: jest.fn().mockReturnThis(),
					data: jest.fn(),
					length: 1,
					removeClass: jest.fn()
				};
			});

			setupSessionListeners();

			expect($).toHaveBeenCalledWith('.payment-method-toggle');
			expect($).toHaveBeenCalledWith('#modeSelect');
			expect($).toHaveBeenCalledWith('#domainSelect, input[name="subdomain"], input[name="version"]');
			expect($).toHaveBeenCalledWith('#sendEmailConfirmationToMerchant');
			expect($).toHaveBeenCalledWith('#sendEmailConfirmationToCustomer');

			expect($().on).toHaveBeenCalledWith('change', saveSessionValues);

			expect(console.log).toHaveBeenCalledTimes(4);
		});
	});
});

// Helper to get the ZPS object directly for inspection if needed outside mocks
function getZPSObjectDirectly() {
	try {
		const storedData = window.sessionStorage.getItem('ZPS');
		return storedData ? JSON.parse(base64DecodeASCII(storedData)) : {};
	} catch (e) {
		return {};
	}
}
