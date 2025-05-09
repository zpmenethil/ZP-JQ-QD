// filepath: F:\_Zenith_Github\ZP-JQ-QD\src\js\modified\codePreview.js
// Import dependencies
import { $, hljs } from './globals.js';
import { extendedOptions, DEFAULT_VALUES } from './globals.js';
import { generateFingerprint } from './hash.js';
import { paymentMethodOptions, additionalOptions } from './globals.js';
import { generateCurrentDatetime, debounce } from './helpers.js';
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
	const merchantCode =
		$('#merchantCodeInput').val().trim() || DEFAULT_VALUES.credentials.merchantCode;

	// Get customer values without fallbacks
	const customerReference = $('#customerReferenceInput').val().trim();
	const customerName = $('#customerNameInput').val().trim();
	const customerEmail = $('#customerEmailInput').val().trim();

	const redirectUrl = $('#redirectUrlInput').val().trim() || DEFAULT_VALUES.extended.redirectUrl;

	// Start with required properties (no customer fields yet)
	const properties = [
		`timeStamp: "${timestamp}"`,
		`url: "${url}"`,
		`merchantCode: "${merchantCode}"`,
		`apiKey: "${apiKey}"`,
		`fingerprint: "${fingerprint}"`,
		`paymentAmount: ${paymentAmount}`,
		`merchantUniquePaymentId: "${merchantUniquePaymentId}"`,
		`mode: ${mode}`,
		`redirectUrl: "${redirectUrl}"`,
	];

	// Only add customer fields if they have values
	if (customerReference) {
		properties.push(`customerReference: "${customerReference}"`);
	}

	if (customerName) {
		properties.push(`customerName: "${customerName}"`);
	}

	if (customerEmail) {
		properties.push(`customerEmail: "${customerEmail}"`);
	}

	if (extendedOptions.callbackUrl && extendedOptions.callbackUrl.trim() !== '') {
		properties.push(`callbackUrl: "${extendedOptions.callbackUrl.trim()}"`);
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
		} else if (option === 'userMode' || option === 'overrideFeePayer') {
			if (additionalOptions[option] !== 0) {
				properties.push(`${option}: ${Number(additionalOptions[option])}`);
			}
		} else if (additionalOptions[option]) {
			properties.push(`${option}: true`);
		}
	}

	const getminheightfield = $('#minHeightInput').val();
	const currentMode = $('#modeSelect').val();
	if (currentMode === '1') {
		if (getminheightfield !== '600') {
			properties.push(`minHeight: ${getminheightfield}`);
		}
	}
	if (currentMode === '0' || currentMode === '2' || currentMode === '3') {
		if (getminheightfield !== '925') {
			properties.push(`minHeight: ${getminheightfield}`);
		}
	}

	if (extendedOptions.contactNumber !== '') {
		properties.push(`contactNumber: ${extendedOptions.contactNumber}`);
	}

	let snippet = `var payment = $.zpPayment({\n    ${properties.join(',\n    ')}\n});`;
	snippet += `\n\npayment.open();`;

	return snippet.trim();
}

/**
 * Original update code preview function.
 * @private
 */

async function _updateCodePreviewInternal() {
	const timestamp = generateCurrentDatetime();
	const merchantUniquePaymentId = $('#merchantUniquePaymentIdInput').val().trim();
	const apiKey = $('#apiKeyInput').val().trim() || DEFAULT_VALUES.credentials.apiKey;
	const username = $('#usernameInput').val().trim() || DEFAULT_VALUES.credentials.username;
	const password = $('#passwordInput').val().trim() || DEFAULT_VALUES.credentials.password;
	const paymentAmount = $('#paymentAmountInput').val().trim();
	const mode = $('#modeSelect').val();
	let fingerprint = '';
	try {
		if (
			apiKey &&
			username &&
			password &&
			paymentAmount &&
			mode &&
			timestamp &&
			merchantUniquePaymentId
		) {
			fingerprint = await generateFingerprint({
				apiKey,
				username,
				password,
				mode,
				paymentAmount,
				merchantUniquePaymentId,
				timestamp,
			});
		}
	} catch (error) {
		console.warn('[updateCodePreview] Could not generate fingerprint:', error);
	}

	const snippet = buildCodeSnippet({
		apiKey,
		paymentAmount,
		mode,
		timestamp,
		merchantUniquePaymentId,
		fingerprint,
	});

	// Update the code preview and re-highlight safely
	const codePreviewEl = document.getElementById('codePreview');
	if (codePreviewEl) {
		// Insert raw text (clears previous HTML)
		codePreviewEl.textContent = snippet;
		// Clear any flag so hljs can highlight again without warning
		delete codePreviewEl.dataset.highlighted;
		// Highlight once
		hljs.highlightElement(codePreviewEl);
	}
}
/**
 * Debounced version of updateCodePreview.
 * Update the code preview with current form values.
 * Waits 250ms after the last call before executing.
 * @returns {void}
 */
export const updateCodePreview = debounce(_updateCodePreviewInternal, 50);

export function updateMinHeightBasedOnMode() {
	const mode = $('#modeSelect').val();
	const defaultHeight = mode === '1' ? '600' : DEFAULT_VALUES.options.minHeight;

	const currentHeight = $('#minHeightInput').val();
	if (!currentHeight || currentHeight === '600' || currentHeight === '925') {
		$('#minHeightInput').val(defaultHeight);
		if (extendedOptions) {
			extendedOptions.minHeight = defaultHeight;
		}
	}
}

/**
 * Parse the configuration object from the code preview content
 * @returns {Object} The parsed configuration object
 */
export function parseCodePreviewConfig() {
	const codePreviewText = $('#codePreview').text();

	try {
		const configMatch = codePreviewText.match(/\$\.zpPayment\(\{\s*([\s\S]*?)\s*\}\)/);

		if (!configMatch || !configMatch[1]) {
			throw new Error('Could not extract configuration from code preview');
		}
		const configText = configMatch[1];
		const configLines = configText.split(',\n');
		const parsedConfig = {};

		configLines.forEach((line) => {
			const match = line.trim().match(/^([^:]+):\s*(.+)$/);
			if (!match) return;

			let [, key, value] = match;
			key = key.trim();
			value = value.trim();

			if (value.startsWith('"') && value.endsWith('"')) {
				parsedConfig[key] = value.substring(1, value.length - 1);
			} else if (value === 'true') {
				parsedConfig[key] = true;
			} else if (value === 'false') {
				parsedConfig[key] = false;
			} else if (!isNaN(Number(value))) {
				parsedConfig[key] = Number(value);
			} else {
				parsedConfig[key] = value;
			}
		});

		if (parsedConfig.timeStamp) {
			parsedConfig.timestamp = parsedConfig.timeStamp;
			delete parsedConfig.timeStamp;
		}
		console.debug(`[parseCodePreviewConfig] Parsed config:`, parsedConfig);
		return parsedConfig;
	} catch (err) {
		console.error('[parseCodePreviewConfig] Error parsing code preview:', err);
		throw new Error('Failed to parse code preview. See console for details.');
	}
}
