// F:\_Zenith_Github\ZP-JQ-QD\src\js\modified\initZP_v2.js

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
	// console.log('[initializeZenPayPlugin] Starting initialization from code preview');

	try {
		// Parse configuration from code preview
		const parsedConfig = parseCodePreviewConfig();
		// console.log('[initializeZenPayPlugin] Parsed config from code preview:', parsedConfig);

		// Get security credentials that aren't in the code preview
		const username = $('#usernameInput').val().trim();
		const password = $('#passwordInput').val().trim();

		// Validate required fields
		if (!username || !password) {
			showError('Validation Error', 'Username and password are required for initialization.');
			return;
		}

		const timestamp = generateCurrentDatetime();
		parsedConfig.timestamp = timestamp;

		// Generate new fingerprint with fresh timestamp
		const fingerprint = generateFingerprint({
			apiKey: parsedConfig.apiKey,
			username,
			password,
			mode: parsedConfig.mode,
			paymentAmount: parsedConfig.paymentAmount,
			merchantUniquePaymentId: parsedConfig.merchantUniquePaymentId,
			timestamp,
		});

		parsedConfig.fingerprint = fingerprint;

		const minHeightFromUI = $('#minHeightInput').val() ? $('#minHeightInput').val().trim() : '';
		const modeKey = `mode${parsedConfig.mode}`;

		if (minHeightFromUI && minHeightFromUI === '600' && parsedConfig.mode === 1) {
			console.log(
				`[initializeZenPayPlugin] Ignoring minHeight of 600 for mode ${parsedConfig.mode}`
			);
			delete parsedConfig.minHeight;
		} else if (
			minHeightFromUI &&
			minHeightFromUI === DEFAULT_VALUES.options.minHeight.default &&
			(parsedConfig.mode === 0 || parsedConfig.mode === 2 || parsedConfig.mode === 3)
		) {
			console.log(
				`[initializeZenPayPlugin] Ignoring minHeight of ${DEFAULT_VALUES.options.minHeight.default} for mode ${parsedConfig.mode}`
			);
			delete parsedConfig.minHeight;
		}
		// Check if minHeight is set in the UI and not equal to the default value
		else if (
			minHeightFromUI &&
			minHeightFromUI !== DEFAULT_VALUES.options.minHeight[modeKey] &&
			minHeightFromUI !== DEFAULT_VALUES.options.minHeight.default
		) {
			// Check if minHeight is a valid number
			const minHeightValue = Number.parseInt(minHeightFromUI, 10);
			if (!isNaN(minHeightValue) && minHeightValue > 0) {
				parsedConfig.minHeight = minHeightValue;
				console.log(`[initializeZenPayPlugin] Setting minHeight to ${parsedConfig.minHeight}`);
			} else {
				console.error('[initializeZenPayPlugin] Invalid minHeight value:', minHeightFromUI);
				showError('Validation Error', 'Invalid minHeight value. Please enter a valid number.');
				return;
			}
		}

		const sessionConfig = { ...parsedConfig };
		sessionConfig.username = username;
		sessionConfig.password = password;

		console.log('[initializeZenPayPlugin] Saving session values');
		saveSessionValues(sessionConfig);

		const payment = $.zpPayment(parsedConfig);
		console.log('[initializeZenPayPlugin] Payment object initialized:', payment.options);
		payment.open();
	} catch (err) {
		console.error('[initializeZenPayPlugin] Error initializing plugin:', err);
		showError('Initialization Error', 'Unable to initialize plugin. See console for details.');
	}
}
