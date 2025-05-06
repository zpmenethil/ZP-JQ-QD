// Import dependencies
import { $ } from './globals.js';
// import { generateCurrentDatetime, generateUUID, createSHA3_512Hash } from './helpers.js';
import { generateCurrentDatetime, createSHA3_512Hash } from './helpers.js';
import { extendedOptions } from './extendedOptions.js';
import { paymentMethodOptions, additionalOptions } from './globals.js';
import { saveSessionValues } from './session.js';

/**
 * Initialize the ZenPay plugin with current configuration
 */
export function initializeZenPayPlugin() {
	console.log('[initializeZenPayPlugin] Initializing ZenPay plugin with current configuration');
	try {
		const timestamp = generateCurrentDatetime();
		const merchantUniquePaymentId = extendedOptions.merchantUniquePaymentId;
		const customerReference = extendedOptions.customerReference;
		const apiKey = $('#apiKeyInput').val().trim();
		const username = $('#usernameInput').val().trim();
		const password = $('#passwordInput').val().trim();
		const merchantCode = $('#merchantCodeInput').val().trim();
		const url = $('#urlPreview').val().trim();
		const paymentAmount = $('#paymentAmountInput').val().trim();
		const selectedMode = $('#modeSelect').val();
		console.log(
			`[initializeZenPayPlugin] Selected mode: ${selectedMode} payment amount: ${paymentAmount}`
		);

		let hashAmount = Math.round(paymentAmount * 100);
		console.log(`[initializeZenPayPlugin] Hash amount: ${hashAmount}`);

		if (selectedMode === '2') {
			console.log(
				`[initializeZenPayPlugin] Selected mode is ${selectedMode} setting hash amount to 0`
			);
			hashAmount = 0;
		}

		let fingerprint = '';

		if (
			apiKey &&
			username &&
			password &&
			merchantCode &&
			hashAmount &&
			selectedMode &&
			timestamp &&
			merchantUniquePaymentId
		) {
			console.log(
				`[initializeZenPayPlugin] All required fields are filled, creating fingerprint with ${apiKey}, ${username}, ${password}, ${selectedMode}, ${hashAmount}, ${merchantUniquePaymentId}, ${timestamp}`
			);
			fingerprint = createSHA3_512Hash(
				apiKey,
				username,
				password,
				selectedMode,
				hashAmount,
				merchantUniquePaymentId,
				timestamp
			);
			console.log(`[initializeZenPayPlugin] Fingerprint: ${fingerprint}`);
		} else {
			console.log(
				`[initializeZenPayPlugin] Not all required fields are filled, not creating fingerprint`
			);
			console.log(
				`[initializeZenPayPlugin] Only have following values: apiKey: ${apiKey}, username: ${username}, password: ${password}, merchantCode: ${merchantCode}, hashAmount: ${hashAmount}, mode: ${selectedMode}, timestamp: ${timestamp}, merchantUniquePaymentId: ${merchantUniquePaymentId}`
			);
		}

		// Initialize plugin with base configuration
		const paymentConfig = {
			url: url,
			merchantCode: merchantCode,
			apiKey: apiKey,
			fingerprint: fingerprint,
			timeStamp: timestamp,
			paymentAmount: paymentAmount,
			mode: selectedMode,
			redirectUrl: extendedOptions.redirectUrl,
			merchantUniquePaymentId: merchantUniquePaymentId,
			customerName: extendedOptions.customerName,
			contactNumber: extendedOptions.contactNumber,
			customerEmail: extendedOptions.customerEmail,
			customerReference: customerReference,
		};

		// Add callback URL if provided
		if (extendedOptions.callbackUrl) {
			paymentConfig.callbackUrl = extendedOptions.callbackUrl;
		}

		// Add minHeight from UI Options tab
		const minHeight = $('#uiMinHeightInput').val();
		if (minHeight) {
			paymentConfig.minHeight = Number.parseInt(minHeight, 10);
		}

		// Add payment method options if they're enabled
		for (const option in paymentMethodOptions) {
			if (paymentMethodOptions[option]) {
				paymentConfig[option] = true;
			}
		}

		// Add additional options if they're enabled
		for (const option in additionalOptions) {
			// Only include tokenization options if mode is 1
			if (option === 'showFeeOnTokenising' || option === 'showFailedPaymentFeeOnTokenising') {
				if (selectedMode === '1' && additionalOptions[option]) {
					paymentConfig[option] = true;
				}
			} else if (additionalOptions[option]) {
				paymentConfig[option] = true;
			}
		}

		// Log session storage
		saveSessionValues();
		console.log('Session storage:', JSON.stringify(sessionStorage, null, 2));
		const payment = $.zpPayment(paymentConfig);

		console.log('Payment object initialized with payload:', payment.options);
		payment.open();
	} catch (err) {
		console.error('Error initializing plugin:', err);
		alert('Unable to initialize plugin. See console for details.');
	}
}
