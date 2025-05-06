/**
 * @module listener
 * @description Sets up UI event listeners for the ZenPay demo plugin page.
 */

import { $ } from './globals.js';
import { paymentMethodOptions, additionalOptions } from './globals.js';
import {
	updateCodePreview,
	copyCodeToClipboard,
	updateMinHeightBasedOnMode,
} from './codePreview.js';
import { initializeZenPayPlugin } from './initZP.js';
import { extendedOptions } from './globals.js';

// /**
//  * Initialize input and select change listeners to trigger code preview updates.
//  * @returns {void}
//  */
// export function initInputPreviewListeners() {
// 	$('#apiKeyInput, #usernameInput, #passwordInput, #merchantCodeInput, #paymentAmountInput, #modeSelect').on('input change', updateCodePreview);
// }

/**
 * Initialize input and select change listeners to trigger code preview updates.
 * @returns {void}
 */
export function initCredentialsListeners() {
	$('#apiKeyInput, #usernameInput, #passwordInput, #merchantCodeInput').on('blur', function () {
		// const fieldName = $(this).attr('id');
		// extendedOptions[fieldName] = $(this).val();
		updateCodePreview();
	});
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
		sessionStorage.setItem(`demo_${option}`, paymentMethodOptions[option]);
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
 * @returns {void}
 */
export function initPaymentAmountListener() {
	$('#paymentAmountInput').on('blur', updateCodePreview);
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
		} else {
			$('#tokenizationOptions').addClass('d-none');
		}
		updateMinHeightBasedOnMode();
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
		extendedOptions.userMode = Number(this.value);
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
		extendedOptions.overrideFeePayer = Number(this.value);
		updateCodePreview();
	});
}

/**
 * Initialize click listener to launch the ZenPay plugin initialization.
 * @returns {void}
 */
export function initInitializePluginListener() {
	console.debug(`[initInitializePluginListener] Initializing plugin listener`);
	$('#initializePlugin').on('click', initializeZenPayPlugin);
}

/**
 * Initialize click listener to copy the current code preview to the clipboard.
 * @returns {void}
 */
export function initCopyCodeListener() {
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
