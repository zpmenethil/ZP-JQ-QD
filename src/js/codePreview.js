// filepath: F:\_Zenith_Github\ZP-JQ-QD\src\js\modified\codePreview.js
// Import dependencies
import { $, hljs } from './globals.js';
import { extendedOptions, DEFAULT_VALUES } from './globals.js';
import { generateFingerprint } from './hash.js';
import { paymentMethodOptions, additionalOptions } from './globals.js';
import { generateCurrentDatetime, debounce } from './helpers.js'; // Import debounce

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
	paymentAmount,
	mode,
	timestamp,
	merchantUniquePaymentId,
	fingerprint,
}) {
	const url = $('#urlPreview').val().trim();
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
		`redirectUrl: "${$('#redirectUrlInput').val().trim() || DEFAULT_VALUES.extended.redirectUrl}"`,
	];

	if (extendedOptions.callbackUrl && extendedOptions.callbackUrl.trim() !== '') {
		properties.push(`callbackUrl: "${extendedOptions.callbackUrl.trim()}"`);
	}

	if (extendedOptions.contactNumber && extendedOptions.contactNumber.trim() !== '') {
		properties.push(`contactNumber: "${extendedOptions.contactNumber.trim()}"`);
	}

	// Only add minHeight if it's defined and different from the default
	if (
		extendedOptions.minHeight &&
		String(extendedOptions.minHeight) !== DEFAULT_VALUES.options.minHeight
	) {
		console.debug(
			`[buildCodeSnippet] Adding minHeight: ${extendedOptions.minHeight} (Different from default: ${DEFAULT_VALUES.options.minHeight})`
		);
		properties.push(`minHeight: ${extendedOptions.minHeight}`);
	}

	for (const option in paymentMethodOptions) {
		if (paymentMethodOptions[option]) {
			properties.push(`${option}: true`);
		}
	}

	for (const option in additionalOptions) {
		if (option === 'minHeight') continue;
		if (option === 'showFeeOnTokenising' || option === 'showFailedPaymentFeeOnTokenising') {
			if (mode === '1' && additionalOptions[option]) {
				properties.push(`${option}: true`);
			}
		} else if (additionalOptions[option]) {
			properties.push(`${option}: true`);
		}
	}
	let snippet = `var payment = $.zpPayment({\n    ${properties.join(',\n    ')}\n});`;
	snippet += `\n\npayment.open();`;

	return snippet.trim();
}

/**
 * Original update code preview function.
 * @private
 */
function _updateCodePreviewInternal() {
	console.trace(`[updateCodePreview] Updating code preview...`);
	const timestamp = generateCurrentDatetime();
	const merchantUniquePaymentId = $('#merchantUniquePaymentIdInput').val().trim();
	const apiKey = $('#apiKeyInput').val().trim();
	const username = $('#usernameInput').val().trim();
	const password = $('#passwordInput').val().trim();
	const paymentAmount = $('#paymentAmountInput').val() || 0.0;
	const mode = $('#modeSelect').val();

	let fingerprint = '';
	if (
		apiKey &&
		username &&
		password &&
		paymentAmount &&
		mode &&
		timestamp &&
		merchantUniquePaymentId
	) {
		// console.log(`[updateCodePreview] creating fingerprint`);
		fingerprint = generateFingerprint({
			apiKey,
			username,
			password,
			mode,
			paymentAmount,
			merchantUniquePaymentId,
			timestamp,
		});
	}

	const snippet = buildCodeSnippet({
		apiKey,
		paymentAmount,
		mode,
		timestamp,
		merchantUniquePaymentId,
		fingerprint,
	});

	// Use jQuery selector for consistency
	$('#codePreview').text(snippet);
	hljs.highlightElement($('#codePreview')[0]);
}

/**
 * Debounced version of updateCodePreview.
 * Update the code preview with current form values.
 * Waits 250ms after the last call before executing.
 * @returns {void}
 */
export const updateCodePreview = debounce(_updateCodePreviewInternal, 250);

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

	const defaultHeight = mode === '1' ? '600' : DEFAULT_VALUES.options.minHeight;
	if (!$('#minHeightInput').val()) {
		$('#minHeightInput').val(defaultHeight);
		if (extendedOptions) {
			// console.log(`[updateMinHeightBasedOnMode] Setting minHeight to ${defaultHeight}`);
			extendedOptions.minHeight = defaultHeight;
		}
	}
}

/**
 * Parse the configuration object from the code preview content
 * @returns {Object} The parsed configuration object
 */
export function parseCodePreviewConfig() {
	// Get the code preview text using jQuery for consistency
	const codePreviewText = $('#codePreview').text();

	try {
		// Extract the configuration object portion using regex
		const configMatch = codePreviewText.match(/\$\.zpPayment\(\{\s*([\s\S]*?)\s*\}\)/);

		if (!configMatch || !configMatch[1]) {
			throw new Error('Could not extract configuration from code preview');
		}

		// Process each line into key-value pairs
		const configText = configMatch[1];
		const configLines = configText.split(',\n');
		const parsedConfig = {};

		configLines.forEach((line) => {
			// Extract key and value using regex
			const match = line.trim().match(/^([^:]+):\s*(.+)$/);
			if (!match) return;

			let [, key, value] = match;
			key = key.trim();
			value = value.trim();

			// Handle different value types
			if (value.startsWith('"') && value.endsWith('"')) {
				// String value
				parsedConfig[key] = value.substring(1, value.length - 1);
			} else if (value === 'true') {
				// Boolean true
				parsedConfig[key] = true;
			} else if (value === 'false') {
				// Boolean false
				parsedConfig[key] = false;
			} else if (!isNaN(Number(value))) {
				// Numeric value
				parsedConfig[key] = Number(value);
			} else {
				// Default as string
				parsedConfig[key] = value;
			}
		});

		// Handle the timeStamp/timestamp difference
		if (parsedConfig.timeStamp) {
			parsedConfig.timestamp = parsedConfig.timeStamp;
			delete parsedConfig.timeStamp;
		}

		console.log('[parseCodePreviewConfig] Successfully parsed configuration:', parsedConfig);
		return parsedConfig;
	} catch (err) {
		console.error('[parseCodePreviewConfig] Error parsing code preview:', err);
		throw new Error('Failed to parse code preview. See console for details.');
	}
}
