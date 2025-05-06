// Import dependencies
import { $, hljs } from './globals.js';
import { extendedOptions, DEFAULT_VALUES } from './globals.js';
import { generateFingerprint } from './hash.js';
import { paymentMethodOptions, additionalOptions } from './globals.js';
import { generateCurrentDatetime } from './helpers.js';

/**
 * Build the code snippet based on current form values and options.
 * @param {Object} config - Configuration object containing all necessary values.
 * @param {string} config.apiKey - Merchant API key.
 * @param {string} config.merchantCode - Merchant code.
 * @param {number} config.paymentAmount - Payment amount for the transaction.
 * @param {string} config.mode - Payment mode identifier.
 * @param {string} config.timestamp - Timestamp of the transaction.
 * @param {string} config.merchantUniquePaymentId - Unique payment identifier.
 * @param {string} config.customerReference - Customer reference identifier.
 * @param {string} config.fingerprint - Hash fingerprint for the transaction.
 * @returns {string} Formatted code snippet as a string.
 */
function buildCodeSnippet({ apiKey, paymentAmount, mode, timestamp, merchantUniquePaymentId, fingerprint }) {
	// Get the URL from the URL preview
	const url = document.getElementById('urlPreview').value;

	const properties = [
		`url: "${url}"`,
		`apiKey: "${apiKey}"`,
		`fingerprint: "${fingerprint}"`,
		`paymentAmount: ${paymentAmount}`,
		`merchantUniquePaymentId: "${merchantUniquePaymentId}"`,
		`timeStamp: "${timestamp}"`,
		`mode: ${mode}`,
		`merchantCode: "${$('#merchantCodeInput').val().trim() || DEFAULT_VALUES.credentials.merchantCode}"`,
		`customerReference: "${$('#customerReferenceInput').val().trim() || DEFAULT_VALUES.credentials.customerReference}"`,
		`customerName: "${$('#customerNameInput').val().trim() || DEFAULT_VALUES.extended.customerName}"`,
		`customerEmail: "${$('#customerEmailInput').val().trim() || DEFAULT_VALUES.extended.customerEmail}"`,
		`redirectUrl: "${$('#redirectUrlInput').val().trim() || DEFAULT_VALUES.extended.redirectUrl}"`
	];

	if (extendedOptions.callbackUrl && extendedOptions.callbackUrl.trim() !== '') {
		properties.push(`callbackUrl: "${extendedOptions.callbackUrl.trim()}"`);
	}

	if (extendedOptions.contactNumber && extendedOptions.contactNumber.trim() !== '') {
		properties.push(`contactNumber: "${extendedOptions.contactNumber.trim()}"`);
	}
	
	// Add minHeight if it exists in extendedOptions
	if (extendedOptions.minHeight) {
		properties.push(`minHeight: ${extendedOptions.minHeight}`);
	}

	// Add payment method options if they're enabled
	for (const option in paymentMethodOptions) {
		if (paymentMethodOptions[option]) {
			properties.push(`${option}: true`);
		}
	}

	// Add additional options if they're enabled
	for (const option in additionalOptions) {
		// Skip minHeight as it's handled separately
		if (option === 'minHeight') continue;
		
		// Only include tokenization options if mode is '1' (string comparison)
		if (option === 'showFeeOnTokenising' || option === 'showFailedPaymentFeeOnTokenising') {
			if (mode === '1' && additionalOptions[option]) {
				properties.push(`${option}: true`);
			}
		} else if (additionalOptions[option]) {
			properties.push(`${option}: true`);
		}
	}

	// Construct the final snippet
	let snippet = `var payment = $.zpPayment({\n    ${properties.join(',\n    ')}\n});`;

	// Add payment.open() call
	snippet += `\n\npayment.open();`;

	return snippet.trim();
}

/**
 * Update the code preview with current form values.
 * @returns {void}
 */
export function updateCodePreview() {
	const timestamp = generateCurrentDatetime();
	console.log(`[updateCodePreview] Current timestamp: ${timestamp}`);
	const merchantUniquePaymentId = $('#merchantUniquePaymentIdInput').val().trim();
	const apiKey = $('#apiKeyInput').val().trim();
	const username = $('#usernameInput').val().trim();
	const password = $('#passwordInput').val().trim();
	const paymentAmount = $('#paymentAmountInput').val() || 0.0;
	const mode = $('#modeSelect').val();

	let fingerprint = '';
	if (apiKey && username && password && paymentAmount && mode && timestamp && merchantUniquePaymentId) {
		console.log(`[updateCodePreview] creating fingerprint`);
		fingerprint = generateFingerprint(apiKey, username, password, mode, paymentAmount, merchantUniquePaymentId, timestamp);
	}

	const snippet = buildCodeSnippet({
		apiKey,
		paymentAmount,
		mode,
		timestamp,
		merchantUniquePaymentId,
		fingerprint
	});

	const codeBlock = document.getElementById('codePreview');
	codeBlock.textContent = snippet;
	hljs.highlightElement(codeBlock);
}

/**
 * Copy the code snippet to the clipboard.
 * @returns {void}
 */
export function copyCodeToClipboard() {
	const codeText = $('#codePreview').text();
	navigator.clipboard
		.writeText(codeText)
		.then(() => {
			// Show success feedback
			const copyBtn = $('#copyCodeBtn');
			const originalIcon = copyBtn.html();
			copyBtn.html('<i class="bi bi-check-lg"></i>');

			setTimeout(() => {
				copyBtn.html(originalIcon);
			}, 2000);
		})
		.catch(err => {
			console.error('Failed to copy code:', err);
			alert('Failed to copy code. Please try again.');
		});
}

/**
 * Update the minimum height input based on the selected payment mode.
 * @returns {void}
 */
export function updateMinHeightBasedOnMode() {
	console.log(`[updateMinHeightBasedOnMode] Current mode: ${$('#modeSelect').val()}`);
	const mode = $('#modeSelect').val();

	// If mode is 1, use 600, otherwise use the default from config
	const defaultHeight = mode === '1' ? '600' : DEFAULT_VALUES.options.minHeight;
	if (!$('#minHeightInput').val()) {
		$('#minHeightInput').val(defaultHeight);
		if (extendedOptions) {
			console.log(`[updateMinHeightBasedOnMode] Setting minHeight to ${defaultHeight}`);
			extendedOptions.minHeight = defaultHeight;
		}
	}
}
