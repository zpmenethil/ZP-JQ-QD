/**
 * ZenPay Payment Plugin Demo - Session Management
 * @module sessionManagement
 */

import { $ } from './globals.js';
import { paymentMethodOptions, additionalOptions } from './globals.js';
import { base64EncodeASCII, base64DecodeASCII } from './helpers.js';

/**
 * Storage types enum
 * @constant {Object}
 */
export const STORAGE_TYPE = {
	SESSION: 'session',
	LOCAL: 'local',
};

/**
 * Encoding types enum
 * @constant {Object}
 */
export const ENCODING_TYPE = {
	NONE: 'none',
	JSON: 'json',
	BASE64: 'base64',
};

/**
 * Object containing session storage keys for various form fields and settings.
 * @constant {Object}
 */
export const SESSION_KEYS = {
	// CREDS
	API_KEY: 'demoApiKey',
	USERNAME: 'demoUsername',
	PASSWORD: 'demoPassword',
	MERCHANT_CODE: 'demoMerchantCode',
	//
	PAYMENT_AMOUNT: 'demoPaymentAmount',
	// MODE
	MODE: 'demoMode',
	// URL
	SUBDOMAIN: 'demoSubdomain',
	DOMAIN: 'demoDomain',
	VERSION: 'demoVersion',
	// Extended options
	UI_MIN_HEIGHT: 'demo_uiMinHeight',
	REDIRECT_URL: 'demo_redirectUrl',
	CALLBACK_URL: 'demo_callbackUrl',
	SENDEMAILCONFIRMATIONTOMERCHANT: 'demo_sendEmailConfirmationToMerchant',
	SENDEMAILCONFIRMATIONTOCUSTOMER: 'demo_sendEmailConfirmationToCustomer',
	// Payment method options
	ALLOWBANKONEOFF: 'demo_allowBankOneOff',
	ALLOWPAYTO: 'demo_allowPayTo',
	ALLOWPAYID: 'demo_allowPayID',
	ALLOWAPPLEPAY: 'demo_allowApplePay',
	ALLOWGOOGLEPAY: 'demo_allowGooglePay',
	ALLOWSAVECARDINFO: 'demo_allowSaveCardInfo',
	ALLOWLATITUDEPAY: 'demo_allowLatitudePay',
};

/**
 * Save a value to storage with BASE64 encoding.
 * @param {string} key - The key under which to store the value.
 * @param {*} value - The value to store.
 * @param {string} [storageType=STORAGE_TYPE.SESSION] - Storage type (session or local).
 * @returns {boolean} - Success status.
 */
export function saveToStorage(key, value, storageType = STORAGE_TYPE.SESSION) {
	try {
		console.debug(`[saveToStorage] Starting save operation for ${key} with value:`, value);

		// Choose storage
		const storage = storageType === STORAGE_TYPE.LOCAL ? localStorage : sessionStorage;

		// Convert to string if needed
		let stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
		console.debug(`[saveToStorage] Converted value to string: ${stringValue}`);

		// Always encode with base64
		const encodedValue = base64EncodeASCII(stringValue);
		console.debug(`[saveToStorage] Encoded with BASE64: ${encodedValue}`);

		// Store value
		storage.setItem(key, encodedValue);
		console.debug(`[saveToStorage] Successfully saved to ${storageType} storage: ${key}`);

		return true;
	} catch (e) {
		console.error(`[saveToStorage] Error saving to ${storageType} storage:`, e);
		return false;
	}
}

/**
 * Get a value from storage with BASE64 decoding.
 * @param {string} key - The key to retrieve the value for.
 * @param {*} [defaultValue=null] - The default value to return if the key is not found or on error.
 * @param {string} [storageType=STORAGE_TYPE.SESSION] - Storage type (session or local).
 * @returns {*} The retrieved value or the default value if not found.
 */
export function getFromStorage(key, defaultValue = null, storageType = STORAGE_TYPE.SESSION) {
	try {
		console.debug(`[getFromStorage] Starting retrieval for ${key}`);

		// Choose storage
		const storage = storageType === STORAGE_TYPE.LOCAL ? localStorage : sessionStorage;

		// Get encoded value
		const encodedValue = storage.getItem(key);
		console.debug(`[getFromStorage] Retrieved encoded value: ${encodedValue}`);

		// Return default if not found
		if (encodedValue === null) {
			console.debug(`[getFromStorage] No value found for ${key}, returning default:`, defaultValue);
			return defaultValue;
		}

		console.debug(`[getFromStorage] Found value for ${key}:`, encodedValue);
		const decodedValue = base64DecodeASCII(encodedValue);
		console.debug(`[getFromStorage] Decoded value: ${decodedValue}`);

		// Handle boolean strings
		if (decodedValue === 'true') return true;
		if (decodedValue === 'false') return false;

		// Handle numeric strings
		if (!isNaN(decodedValue) && decodedValue.trim() !== '') {
			const num = Number(decodedValue);
			console.debug(`[getFromStorage] Converted to number: ${num}`);
			return num;
		}

		// Return as regular string
		console.debug(`[getFromStorage] Returning as string: ${decodedValue}`);
		return decodedValue;
	} catch (e) {
		console.error(`[getFromStorage] Error retrieving from ${storageType} storage:`, e);
		return defaultValue;
	}
}

// Create a helper function to manage the ZPS object
function getZPSObject() {
	try {
		const storedData = sessionStorage.getItem('ZPS');
		return storedData ? JSON.parse(base64DecodeASCII(storedData)) : {};
	} catch (e) {
		console.error('[getZPSObject] Error retrieving ZPS data:', e);
		return {};
	}
}

// Update saveToSession to save to the ZPS object
export function saveToSession(key, value) {
	try {
		console.debug(`[saveToSession] Saving ${key}:`, value);

		// Get current ZPS object
		const zpsData = getZPSObject();

		// Convert demo prefix keys to standard format
		const cleanKey = key.startsWith('demo') ? key.replace(/^demo(?:_)?/, '') : key;

		// Update the value
		zpsData[cleanKey] = value;

		// Save back as BASE64 encoded JSON
		const encodedData = base64EncodeASCII(JSON.stringify(zpsData));
		sessionStorage.setItem('ZPS', encodedData);

		return true;
	} catch (e) {
		console.error('[saveToSession] Error:', e);
		return false;
	}
}

// Update getFromSession to read from the ZPS object
export function getFromSession(key, defaultValue = null) {
	try {
		console.debug(`[getFromSession] Retrieving ${key}`);

		// Get ZPS object
		const zpsData = getZPSObject();

		// Convert demo prefix keys to standard format
		const cleanKey = key.startsWith('demo') ? key.replace(/^demo(?:_)?/, '') : key;

		// Return the value if it exists
		if (cleanKey in zpsData) {
			return zpsData[cleanKey];
		}

		return defaultValue;
	} catch (e) {
		console.error('[getFromSession] Error:', e);
		return defaultValue;
	}
}
export function restoreSessionValues() {
	console.trace(`[restoreSessionValues] Restoring session values called`);

	// Check and set credential fields
	if ($('#apiKeyInput').length) {
		$('#apiKeyInput').val(getFromSession(SESSION_KEYS.API_KEY, '', STORAGE_TYPE.SESSION));
	}

	if ($('#usernameInput').length) {
		$('#usernameInput').val(getFromSession(SESSION_KEYS.USERNAME, '', STORAGE_TYPE.SESSION));
	}

	if ($('#passwordInput').length) {
		$('#passwordInput').val(getFromSession(SESSION_KEYS.PASSWORD, '', STORAGE_TYPE.SESSION));
	}

	if ($('#merchantCodeInput').length) {
		$('#merchantCodeInput').val(
			getFromSession(SESSION_KEYS.MERCHANT_CODE, '', STORAGE_TYPE.SESSION)
		);
	}

	if ($('#paymentAmountInput').length) {
		$('#paymentAmountInput').val(
			getFromSession(SESSION_KEYS.PAYMENT_AMOUNT, '', STORAGE_TYPE.SESSION)
		);
	}

	if ($('#modeSelect').length) {
		$('#modeSelect').val(getFromSession(SESSION_KEYS.MODE, '0', STORAGE_TYPE.SESSION));

		// Show tokenization options if mode is 1
		if ($('#modeSelect').val() === '1' && $('#tokenizationOptions').length) {
			$('#tokenizationOptions').removeClass('d-none');
		}
	}

	// Restore payment method toggles
	$('.payment-method-toggle').each(function () {
		const option = $(this).data('option');
		const savedValue = getFromSession(`demo_${option}`, false, STORAGE_TYPE.SESSION);
		if (savedValue === true) {
			$(this).prop('checked', true);
			if (paymentMethodOptions && option in paymentMethodOptions) {
				paymentMethodOptions[option] = true;
			}
		}
	});

	// Restore additional options
	$('.option-toggle').each(function () {
		const option = $(this).data('option');
		const savedValue = getFromSession(`demo_${option}`, false);
		if (savedValue === true) {
			$(this).prop('checked', true);
			if (additionalOptions && option in additionalOptions) {
				additionalOptions[option] = true;
			}
		}
	});

	// Restore URL builder settings if elements exist
	const savedSubdomain = getFromSession(SESSION_KEYS.SUBDOMAIN);
	if (savedSubdomain && $(`input[name="subdomain"][value="${savedSubdomain}"]`).length) {
		$(`input[name="subdomain"][value="${savedSubdomain}"]`).prop('checked', true);
	}

	const savedDomain = getFromSession(SESSION_KEYS.DOMAIN);
	if (savedDomain && $('#domainSelect').length) {
		$('#domainSelect').val(savedDomain);
	}

	const savedVersion = getFromSession(SESSION_KEYS.VERSION);
	if (savedVersion && $(`input[name="version"][value="${savedVersion}"]`).length) {
		$(`input[name="version"][value="${savedVersion}"]`).prop('checked', true);
	}

	// Restore UI minHeight
	if ($('#uiMinHeightInput').length) {
		$('#uiMinHeightInput').val(getFromSession(SESSION_KEYS.UI_MIN_HEIGHT, ''));
	}
}

/**
 * Save all form field values to session storage.
 * @returns {void}
 */
export function saveSessionValues() {
	console.trace(`[saveSessionValues] Saving session values called`);
	// Save credential fields
	saveToSession(SESSION_KEYS.API_KEY, $('#apiKeyInput').val().trim());
	saveToSession(SESSION_KEYS.USERNAME, $('#usernameInput').val().trim());
	saveToSession(SESSION_KEYS.PASSWORD, $('#passwordInput').val().trim());
	saveToSession(SESSION_KEYS.MERCHANT_CODE, $('#merchantCodeInput').val().trim());
	// Mode
	saveToSession(SESSION_KEYS.MODE, $('#modeSelect').val());
	// URL
	saveToSession(SESSION_KEYS.SUBDOMAIN, $('input[name="subdomain"]:checked').val());
	saveToSession(SESSION_KEYS.DOMAIN, $('#domainSelect').val());
	saveToSession(SESSION_KEYS.VERSION, $('input[name="version"]:checked').val());

	if (
		$('#paymentAmountInput').val().trim() === '65' ||
		$('#paymentAmountInput').val().trim() === '65.00'
	) {
		saveToSession(SESSION_KEYS.PAYMENT_AMOUNT, $('#paymentAmountInput').val().trim());
	}

	saveToSession(SESSION_KEYS.CALLBACK_URL, $('#callbackUrlInput').val());

	if ($('#uiMinHeightInput').val() !== '825' && $('#uiMinHeightInput').val() !== '600') {
		saveToSession(SESSION_KEYS.MIN_HEIGHT, $('#uiMinHeightInput').val());
	}

	// Save payment method options
	$('.payment-method-toggle').each(function () {
		const option = $(this).data('option');
		saveToSession(`demo_${option}`, $(this).prop('checked'));
	});

	// Save additional options
	$('.option-toggle').each(function () {
		const option = $(this).data('option');
		saveToSession(`demo_${option}`, $(this).prop('checked'));
	});
}

/**
 * Setup event listeners for automatic session storage.
 * @returns {void}
 */
export function setupSessionListeners() {
	// Listen to payment method toggles
	$('.payment-method-toggle').on('change', saveSessionValues);
	console.log(
		`[setupSessionListeners] Payment method toggles saved to session storage ${SESSION_KEYS.ALLOWBANKONEOFF}, ${SESSION_KEYS.ALLOWAPPLEPAY}, ${SESSION_KEYS.ALLOWGOOGLEPAY}, ${SESSION_KEYS.ALLOWSAVECARDINFO}, ${SESSION_KEYS.ALLOWPAYID}, ${SESSION_KEYS.ALLOWPAYTO}, ${SESSION_KEYS.ALLOWLATITUDEPAY}`
	);
	// Listen to mode changes
	$('#modeSelect').on('change', saveSessionValues);
	console.log(`[setupSessionListeners] Mode changes saved to session storage ${SESSION_KEYS.MODE}`);
	// Listen to URL builder changes
	$('#domainSelect, input[name="subdomain"], input[name="version"]').on(
		'change',
		saveSessionValues
	);
	console.log(
		`[setupSessionListeners] URL builder changes saved to session storage ${SESSION_KEYS.DOMAIN}, ${SESSION_KEYS.SUBDOMAIN}, ${SESSION_KEYS.VERSION}`
	);
	// Listen to extended options
	$('#sendEmailConfirmationToMerchant').on('change', saveSessionValues);
	$('#sendEmailConfirmationToCustomer').on('change', saveSessionValues);
	console.log(
		`[setupSessionListeners] Extended options saved to session storage ${SESSION_KEYS.SENDEMAILCONFIRMATIONTOMERCHANT}, ${SESSION_KEYS.SENDEMAILCONFIRMATIONTOCUSTOMER}`
	);
}
