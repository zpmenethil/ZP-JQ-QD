// Import dependencies
import { $, hljs } from './globals.js';
import { extendedOptions } from './extendedOptions.js';
// import { generateUUID, createSHA3_512Hash } from './helpers.js';
import { createSHA3_512Hash } from './helpers.js';
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
function buildCodeSnippet({
	apiKey,
	merchantCode,
	paymentAmount,
	mode,
	timestamp,
	merchantUniquePaymentId,
	customerReference,
	fingerprint,
}) {
	// Get the URL from the URL preview
	const url = document.getElementById('urlPreview').value;

	// Start with the basic configuration
	let snippet = `
var payment = $.zpPayment({
  url: "${url}",
  merchantCode: "${merchantCode}",
  apiKey: "${apiKey}",
  fingerprint: "${fingerprint}",`;

	// Add redirect URL
	snippet += `
  redirectUrl: "${extendedOptions.redirectUrl}",`;

	// Add callback URL if provided
	if (extendedOptions.callbackUrl) {
		snippet += `
  callbackUrl: "${extendedOptions.callbackUrl}",`;
	}

	// Add minHeight from UI Options tab
	const minHeight = $('#uiMinHeightInput').val();
	if (minHeight) {
		snippet += `
  minHeight: ${minHeight},`;
	}

	// Add other required fields
	snippet += `
  mode: ${mode},
  merchantUniquePaymentId: "${merchantUniquePaymentId}",
  customerName: "${extendedOptions.customerName}",
  contactNumber: "${extendedOptions.contactNumber}",
  customerEmail: "${extendedOptions.customerEmail}",
  customerReference: "${customerReference}",
  paymentAmount: ${paymentAmount},
  timeStamp: "${timestamp}"`;

	// Add payment method options if they're enabled
	for (const option in paymentMethodOptions) {
		if (paymentMethodOptions[option]) {
			snippet += `,
  ${option}: true`;
		}
	}

	// Add additional options if they're enabled
	for (const option in additionalOptions) {
		// Only include tokenization options if mode is 1
		if (option === 'showFeeOnTokenising' || option === 'showFailedPaymentFeeOnTokenising') {
			if (mode === '1' && additionalOptions[option]) {
				snippet += `,
  ${option}: true`;
			}
		} else if (additionalOptions[option]) {
			snippet += `,
  ${option}: true`;
		}
	}

	// Close the configuration object
	snippet += `
});

payment.open();`;

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
	const customerReference = $('#customerReferenceInput').val().trim();
	const apiKey = $('#apiKeyInput').val().trim();
	const username = $('#usernameInput').val().trim();
	const password = $('#passwordInput').val().trim();
	const merchantCode = $('#merchantCodeInput').val().trim();

	const inputPaymentAmount = $('#paymentAmountInput').val() || 0.0;
	const paymentAmount = Number(inputPaymentAmount);
	const selectedMode = $('#modeSelect').val();

	// For the fingerprint process, if Mode 2 is selected, use 0 as the payment amount.
	if (selectedMode === '2') {
		$('#paymentAmountInput').val(0);
		console.log(`[updateCodePreview] Selected mode is ${selectedMode} setting payment amount to 0`);
	}
	const fingerprintPaymentAmount = selectedMode === '2' ? 0 : paymentAmount;
	const hashAmount = Math.round(fingerprintPaymentAmount * 100);

	let fingerprint = '';
	if (
		apiKey &&
		username &&
		password &&
		merchantCode &&
		paymentAmount &&
		selectedMode &&
		timestamp &&
		merchantUniquePaymentId
	) {
		console.log(`[updateCodePreview] All required fields are filled, creating fingerprint`);
		fingerprint = createSHA3_512Hash(
			apiKey,
			username,
			password,
			selectedMode,
			hashAmount,
			merchantUniquePaymentId,
			timestamp
		);
		console.log(`[updateCodePreview] Fingerprint: ${fingerprint}`);
	} else {
		console.log(`[updateCodePreview] Not all required fields are filled, not creating fingerprint`);
		console.log(
			`[updateCodePreview] Only have following values: apiKey: ${apiKey}, username: ${username}, password: ${password}, merchantCode: ${merchantCode}, paymentAmount: ${paymentAmount}, mode: ${selectedMode}, timestamp: ${timestamp}, merchantUniquePaymentId: ${merchantUniquePaymentId}`
		);
	}

	const snippet = buildCodeSnippet({
		apiKey,
		username,
		password,
		merchantCode,
		paymentAmount,
		mode: selectedMode,
		timestamp,
		merchantUniquePaymentId,
		customerReference,
		fingerprint,
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
		.catch((err) => {
			console.error('Failed to copy code:', err);
			alert('Failed to copy code. Please try again.');
		});
}

/**
 * Update the minimum height input based on the selected payment mode.
 * @returns {void}
 */
export function updateMinHeightBasedOnMode() {
	const mode = $('#modeSelect').val();
	const defaultHeight = mode === '1' ? '600' : '825';

	// Only set if user hasn't manually changed it
	if (!$('#uiMinHeightInput').val()) {
		$('#uiMinHeightInput').val(defaultHeight);
		if (extendedOptions) {
			extendedOptions.minHeight = defaultHeight;
		}
	}
}
