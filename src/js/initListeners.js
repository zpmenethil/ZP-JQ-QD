/**
 * @module listener
 * @description Sets up UI event listeners for the ZenPay demo plugin page.
 */

import { $ } from './globals.js';
import { paymentMethodOptions, additionalOptions } from './globals.js';
import { updateCodePreview, updateMinHeightBasedOnMode } from './codePreview.js';
import { initializeZenPayPlugin } from './initZP.js';
import { extendedOptions } from './globals.js';
import {
	saveSessionValues,
	saveToSession,
	savePaymentMethodValuesToSession,
	saveAdditionalOptionsToSession,
} from './session.js';
import { SESSION_KEYS } from './globals.js';
import { copyCodeToClipboard } from './helpers.js';

/**
 * Update the action buttons' state based on credential fields.
 * @returns {void}
 */
export function updateActionButtonsState() {
	// Renamed from updateDownloadButtonState
	const apiKey = $('#apiKeyInput').val();
	const username = $('#usernameInput').val();
	const password = $('#passwordInput').val();
	const merchantCode = $('#merchantCodeInput').val();
	const downloadButton = $('#downloadDemoBtn');
	const initializeButton = $('#initializePlugin');

	if (apiKey && username && password && merchantCode) {
		// Enable Download Button
		downloadButton.removeClass('btn-disabled'); // Use class for visual state
		downloadButton.attr('title', 'Download Standalone Demo');

		// Enable Initialize Plugin Button
		initializeButton.prop('disabled', false);
		initializeButton.attr('title', 'Initialize Plugin');
	} else {
		// "Disable" Download Button (visually, remains clickable)
		downloadButton.addClass('btn-disabled');
		downloadButton.attr(
			'title',
			'Please fill in API Key, Username, Password, and Merchant Code to enable download.'
		);

		// Disable Initialize Plugin Button (truly disabled)
		initializeButton.prop('disabled', true);
		initializeButton.attr(
			'title',
			'Please fill in API Key, Username, Password, and Merchant Code to initialize plugin.'
		);
	}
}

/**
 * Initialize input and select change listeners to trigger code preview updates.
 * @returns {void}
 */
export function initCredentialsListeners() {
	$('#apiKeyInput, #usernameInput, #passwordInput, #merchantCodeInput').on('blur', function () {
		const paymentConfig = {
			apiKey: $('#apiKeyInput').val(),
			username: $('#usernameInput').val(),
			password: $('#passwordInput').val(),
			merchantCode: $('#merchantCodeInput').val(),
		};
		saveSessionValues(paymentConfig);
		updateCodePreview();
		updateActionButtonsState(); // Call renamed function
	});
	updateActionButtonsState(); // Initial check on page load using renamed function
}

/**
 * Initialize toggles for payment methods. Persists selections to sessionStorage
 * and updates the code preview on change.
 * @returns {void}
 */
export function initPaymentMethodToggleListeners() {
	$('.payment-method-toggle').on('change', function () {
		const option = $(this).data('option');
		paymentMethodOptions[option] = $(this).prop('checked');
		savePaymentMethodValuesToSession();
		updateCodePreview();
	});
}
/**
 * Initialize toggles for additional plugin options and update the code preview on change.
 * @returns {void}
 */
export function initAdditionalOptionsListeners() {
	$('.option-toggle').on('change', function () {
		const option = $(this).data('option');
		additionalOptions[option] = $(this).prop('checked');
		saveAdditionalOptionsToSession();
		updateCodePreview();
	});
}

/**
 * Initialize listener for dynamic UI min-height input to update the code preview.
 * @returns {void}
 */
export function initUiMinHeightListener() {
	$('#minHeightInput').on('blur', updateCodePreview);
}

/**
 * Initialize listener for payment amount input to update the code preview.
 * Also formats the payment amount to two decimal places.
 * @returns {void}
 */
export function initPaymentAmountListener() {
	$('#paymentAmountInput').on('blur', function () {
		let value = $(this).val().trim();
		if (value) {
			const numValue = parseFloat(value);
			if (!isNaN(numValue)) {
				const formattedValue = numValue.toFixed(2);
				$(this).val(formattedValue);
			}
		}
		updateCodePreview();
	});
}

/**
 * Initialize listener on the mode selector to show/hide tokenization options,
 * adjust UI min-height, and update the code preview.
 * @returns {void}
 */
export function initModeSelectListener() {
	$('#modeSelect').on('change', function () {
		const mode = $(this).val();
		if (mode === '1') {
			$('#tokenizationOptions').removeClass('d-none');
			updateMinHeightBasedOnMode();
		} else {
			$('#tokenizationOptions').addClass('d-none');
			updateMinHeightBasedOnMode();
		}
		// updateMinHeightBasedOnMode();

		const paymentConfig = {
			mode,
		};
		saveSessionValues(paymentConfig);
		updateCodePreview();
	});
}

/**
 * Initialize exclusive radio toggles for User Mode (0=Customer, 1=Merchant).
 * Updates extendedOptions.userMode and refreshes preview on change.
 * @returns {void}
 */
export function initUserModeToggle() {
	$('input[name="userMode"]').on('change', function () {
		const numValue = Number(this.value);
		console.debug(`[initUserModeToggle] User mode changed to: ${numValue}`);
		additionalOptions.userMode = numValue; // Update additionalOptions directly
		extendedOptions.userMode = numValue;
		saveToSession(SESSION_KEYS.USER_MODE, numValue);
		updateCodePreview();
	});
}

/**
 * Initialize exclusive radio toggles for Override Fee Payer (0=Default, 1=Customer, 2=Merchant).
 * Updates extendedOptions.overrideFeePayer and refreshes preview on change.
 * @returns {void}
 */
export function initOverrideFeePayerToggle() {
	$('input[name="overrideFeePayer"]').on('change', function () {
		const numValue = Number(this.value);
		console.debug(`[initOverrideFeePayerToggle] Override fee payer changed to: ${numValue}`);
		additionalOptions.overrideFeePayer = numValue; // Update additionalOptions directly
		extendedOptions.overrideFeePayer = numValue;
		saveToSession(SESSION_KEYS.OVERRIDE_FEE_PAYER, numValue);
		updateCodePreview();
	});
}

/**
 * Initialize click listener to launch the ZenPay plugin initialization.
 * @returns {void}
 */
export function initInitializePluginListener() {
	// console.debug(`[initInitializePluginListener] Initializing plugin listener`);
	$('#initializePlugin').on('click', initializeZenPayPlugin);
}

/**
 * Initialize click listener to copy the current code preview to the clipboard.
 * @returns {void}
 */
export function initCopyCodeListener() {
	// console.debug(`[initCopyCodeListener] Initializing copy code listener`);
	$('#copyCodeBtn').on('click', copyCodeToClipboard);
}

/**
 * Initialize native browser tooltips on each <option> in the mode selector,
 * using the data-tooltip attribute.
 * @returns {void}
 */
export function initOptionTooltips() {
	$('#modeSelect option').each(function () {
		const tooltipText = $(this).data('tooltip');
		if (tooltipText) {
			$(this).attr('title', tooltipText);
		}
	});
}

/**
 * Initialize hover listener on the payment mode info icon to show a contextual tooltip
 * describing the currently selected payment mode.
 * @returns {void}
 */
export function initPaymentModeHoverTooltip() {
	$('.payment-mode-info').on('mouseenter', function () {
		const currentMode = $('#modeSelect').val();
		let tooltipText = '';
		switch (currentMode) {
			case '0':
				tooltipText =
					'Payment mode using a static payment amount supplied via the payload, which cannot be changed after plugin initialization.';
				break;
			case '1':
				tooltipText = 'Tokenization mode, suitable for building wallets.';
				break;
			case '2':
				tooltipText =
					'Dynamic payment mode, allowing the payment amount to be changed after plugin initialization.';
				break;
			case '3':
				tooltipText = 'Preauth mode for authorizing payments without immediate capture.';
				break;
			default:
				tooltipText = 'Select the payment processing mode';
		}
		$(this).attr('data-bs-original-title', tooltipText).tooltip('show');
	});
}

/**
 * Initialize change listener on the mode selector to hide any open
 * payment mode tooltips when the selection changes.
 * @returns {void}
 */
export function initPaymentModeChangeTooltip() {
	$('#modeSelect').on('change', function () {
		$('.payment-mode-info').tooltip('hide');
	});
}

/**
 * Initialize URL builder change listeners.
 * @returns {void}
 */
export function initUrlBuilderListeners() {
	$('#domainSelect, input[name="subdomain"], input[name="version"]').on('change', function () {
		const protocol = 'https://';
		const subdomain = $('input[name="subdomain"]:checked').val();
		const domain = $('#domainSelect').val();
		const suffix = '.com.au/Online/';
		const version = $('input[name="version"]:checked').val();
		const url = `${protocol}${subdomain}${domain}${suffix}${version}`;

		const paymentConfig = {
			domain: $('#domainSelect').val(),
			subdomain: $('input[name="subdomain"]:checked').val(),
			version: $('input[name="version"]:checked').val(),
			url,
		};
		console.log(`[initUrlBuilderListeners] URL: ${url}`);
		console.log(`[initUrlBuilderListeners] paymentConfig: ${JSON.stringify(paymentConfig)}`);
		saveSessionValues(paymentConfig);
		updateCodePreview();
	});
}

/**
 * Initialize email confirmation option listeners.
 * @returns {void}
 */
export function initEmailConfirmationListeners() {
	$('#sendEmailConfirmationToMerchant, #sendEmailConfirmationToCustomer').on('change', function () {
		const paymentConfig = {
			sendEmailConfirmationToMerchant: $('#sendEmailConfirmationToMerchant').prop('checked'),
			sendEmailConfirmationToCustomer: $('#sendEmailConfirmationToCustomer').prop('checked'),
		};
		console.log(`[initEmailConfirmationListeners] paymentConfig: ${JSON.stringify(paymentConfig)}`);
		saveSessionValues(paymentConfig);
		updateCodePreview();
	});
}
