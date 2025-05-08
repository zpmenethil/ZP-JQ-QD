// F:\_Zenith_Github\ZP-JQ-QD\src\js\modified\initZP.js

import { $ } from './globals.js';
import { generateFingerprint } from './hash.js';
import { generateCurrentDatetime } from './helpers.js';
import { DEFAULT_VALUES } from './globals.js';
import { saveSessionValues } from './session.js';
import { showError } from './modal.js';
import { parseCodePreviewConfig } from './codePreview.js';

/**
 * Initialize the ZenPay plugin with configuration from code preview
 * @returns {void}
 */
export function initializeZenPayPlugin() {
	console.log('[initializeZenPayPlugin] Starting initialization from code preview');

	try {
		const parsedConfig = parseCodePreviewConfig();
		console.log('[initializeZenPayPlugin] Parsed config from code preview:', parsedConfig);

		const username = $('#usernameInput').val().trim();
		const password = $('#passwordInput').val().trim();
		if (!username || !password) {
			showError('Validation Error', 'Username and password are required for initialization.');
			return;
		}

		const timestamp = generateCurrentDatetime();
		parsedConfig.timestamp = timestamp;

		console.log(
			`[initializeZenPayPlugin] Generating fingerprint with API Key: ${parsedConfig.apiKey}, Timestamp: ${timestamp}, Mode: ${parsedConfig.mode}, Payment Amount: ${parsedConfig.paymentAmount}, Merchant Unique Payment ID: ${parsedConfig.merchantUniquePaymentId}, Username: ${username}, Password: ${password}`
		);
		const fingerprint = generateFingerprint({
			apiKey: parsedConfig.apiKey,
			username: username,
			password: password,
			mode: String(parsedConfig.mode),
			paymentAmount: String(parsedConfig.paymentAmount),
			merchantUniquePaymentId: parsedConfig.merchantUniquePaymentId,
			timestamp: timestamp
		});

		// Check if fingerprint generation succeeded
		if (!fingerprint) {
			console.error('[initializeZenPayPlugin] Failed to generate fingerprint');
			showError('Validation Error', '[initializeZenPayPlugin] Failed to generate security fingerprint. Please check API credentials.');
			return;
		}

		// Update the fingerprint in the config
		parsedConfig.fingerprint = fingerprint;

		// Handle minHeight settings
		const minHeightFromUI = $('#minHeightInput').val() ? $('#minHeightInput').val().trim() : '';
		const modeKey = `mode${parsedConfig.mode}`;

		if (minHeightFromUI && minHeightFromUI === '600' && parsedConfig.mode === 1) {
			console.log(`[initializeZenPayPlugin] Ignoring minHeight of 600 for mode ${parsedConfig.mode}`);
			delete parsedConfig.minHeight;
		} else if (minHeightFromUI && minHeightFromUI === DEFAULT_VALUES.options.minHeight.default && (parsedConfig.mode === 0 || parsedConfig.mode === 2 || parsedConfig.mode === 3)) {
			console.log(`[initializeZenPayPlugin] Ignoring minHeight of ${DEFAULT_VALUES.options.minHeight.default} for mode ${parsedConfig.mode}`);
			delete parsedConfig.minHeight;
		}
		// Check if minHeight is set in the UI and not equal to the default value
		else if (minHeightFromUI && minHeightFromUI !== DEFAULT_VALUES.options.minHeight[modeKey] && minHeightFromUI !== DEFAULT_VALUES.options.minHeight.default) {
			console.log(`[initializeZenPayPlugin] Setting minHeight to ${minHeightFromUI}`);
		}

		const sessionConfig = { ...parsedConfig };
		sessionConfig.username = username;
		sessionConfig.password = password;

		saveSessionValues(sessionConfig);
		const payment = $.zpPayment(parsedConfig);
		console.log('[initializeZenPayPlugin] 👇 Payment object initialized 👇 ');
		console.log(payment.options);
		payment.open();
	} catch (err) {
		console.error('[initializeZenPayPlugin] Error initializing plugin:', err);
		showError('Initialization Error', 'Unable to initialize plugin. See console for details.');
	}
}
