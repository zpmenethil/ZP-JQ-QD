// F:\_Zenith_Github\ZP-JQ-QD\src\js\initZP.js
/**
 * ZenPay Plugin Initialization Module
 * Handles gathering inputs, computing fingerprints, and initializing the payment plugin
 */

import { $ } from './globals.js';
import { generateFingerprint } from './hash.js';
import { generateCurrentDatetime } from './helpers.js';
import { extendedOptions, paymentMethodOptions, additionalOptions, DEFAULT_VALUES } from './globals.js';
import { saveSessionValues } from './session.js';

/**
 * Gather input values from the form
 * @returns {Object} Collected input values
 */
function gatherInputValues() {
	// Create a copy of extendedOptions
	const extendedOptionsCopy = { ...extendedOptions };

	// Check if minHeight should be removed (if it's the default value for the current mode)
	const mode = $('#modeSelect').val();
	const minHeightFromUI = $('#minHeightInput').val() ? $('#minHeightInput').val().trim() : '';

	if (minHeightFromUI) {
		const modeKey = `mode${mode}`;
		console.log(`[gatherInputValues] Min height from UI: ${minHeightFromUI}`);
		const defaultHeight = DEFAULT_VALUES.options.minHeight[modeKey] || DEFAULT_VALUES.options.minHeight.default;

		if (minHeightFromUI === defaultHeight) {
			console.log(`[gatherInputValues] Using default height for mode ${mode}, removing from config`);
			delete extendedOptionsCopy.minHeight;
		}
	} else {
		console.warn(`[gatherInputValues] No minHeight specified, removing from config`);
		delete extendedOptionsCopy.minHeight;
	}

	return {
		apiKey: $('#apiKeyInput').val().trim(),
		username: $('#usernameInput').val().trim(),
		password: $('#passwordInput').val().trim(),
		merchantCode: $('#merchantCodeInput').val().trim(),
		paymentAmount: $('#paymentAmountInput').val().trim(),
		url: $('#urlPreview').val().trim(),
		mode: mode,
		timestamp: generateCurrentDatetime(),
		merchantUniquePaymentId: $('#merchantUniquePaymentIdInput').val().trim(),
		minHeightFromUI,
		...extendedOptionsCopy
	};
}

/**
 * Initialize the ZenPay plugin with current configuration
 * @returns {void}
 */
export function initializeZenPayPlugin() {
	console.log('[initializeZenPayPlugin] ');

	try {
		const inputValues = gatherInputValues();
		console.log(`[initializeZenPayPlugin] Input values`);
		console.json(inputValues);

		const fingerprint = generateFingerprint({
			apiKey: inputValues.apiKey,
			username: inputValues.username,
			password: inputValues.password,
			mode: inputValues.mode,
			paymentAmount: inputValues.paymentAmount,
			merchantUniquePaymentId: inputValues.merchantUniquePaymentId,
			timestamp: inputValues.timestamp
		});

		let paymentConfig = {
			...inputValues,
			fingerprint: fingerprint
		};

		paymentConfig = processMinHeight(paymentConfig);
		paymentConfig = addPaymentMethodOptions(paymentConfig);
		paymentConfig = addAdditionalOptions(paymentConfig, inputValues.selectedMode);

		console.log('[initializeZenPayPlugin] Saving session values');
		saveSessionValues(paymentConfig);

		const payment = $.zpPayment(paymentConfig);
		console.log('Payment object initialized:', payment.options);
		payment.open();
	} catch (err) {
		console.error('Error initializing plugin:', err);
		alert('Unable to initialize plugin. See console for details.');
	}
}

/**
 * Process minHeight from UI
 * @param {Object} config - Payment configuration
 * @returns {Object} Updated configuration with minHeight
 */
function processMinHeight(config) {
	const minHeightFromUI = $('#minHeightInput').val() ? $('#minHeightInput').val().trim() : '';
	console.log(`[processMinHeight] Min height from UI: ${minHeightFromUI}`);

	if (minHeightFromUI) {
		// Get the default height for the current mode
		const modeKey = `mode${config.mode}`;
		const defaultHeight = DEFAULT_VALUES.options.minHeight[modeKey] || DEFAULT_VALUES.options.minHeight.default;

		console.log(`[processMinHeight] Default height for mode ${config.mode}: ${defaultHeight}`);

		// Only set minHeight if it differs from the default for this mode
		if (minHeightFromUI !== defaultHeight) {
			console.log(`[processMinHeight] Setting minHeight to ${minHeightFromUI} (differs from default)`);
			config.minHeight = Number.parseInt(minHeightFromUI, 10);
		} else {
			// Remove minHeight from config if it's the default value
			delete config.minHeight;
			console.log(`[processMinHeight] Using default height for mode ${config.mode}, removing from config`);
		}
	} else {
		// Remove minHeight from config if input is empty
		delete config.minHeight;
		console.log(`[processMinHeight] No height specified, removing from config`);
	}

	console.log(`[processMinHeight] Final minHeight value: ${config.minHeight}`);
	return config;
}

/**
 * Add payment method options to configuration
 * @param {Object} config - Payment configuration
 * @returns {Object} Updated configuration with payment method options
 */
function addPaymentMethodOptions(config) {
	Object.keys(paymentMethodOptions).forEach(option => {
		if (paymentMethodOptions[option]) {
			config[option] = true;
		}
	});

	return config;
}

/**
 * Add additional options to configuration
 * @param {Object} config - Payment configuration
 * @param {string} selectedMode - Selected payment mode
 * @returns {Object} Updated configuration with additional options
 */
function addAdditionalOptions(config, selectedMode) {
	Object.keys(additionalOptions).forEach(option => {
		// Skip minHeight as it's handled separately
		if (option === 'minHeight') return;

		const isTokenizationOption = option === 'showFeeOnTokenising' || option === 'showFailedPaymentFeeOnTokenising';

		if (isTokenizationOption) {
			// Only include if mode is 1 and option is enabled
			if (selectedMode === '1' && additionalOptions[option]) {
				config[option] = true;
			}
		} else if (additionalOptions[option]) {
			// Include all other enabled options
			config[option] = true;
		}
	});

	return config;
}
