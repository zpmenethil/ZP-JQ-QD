// listener.js
import { $ } from './globals.js';
import { paymentMethodOptions, additionalOptions } from './globals.js';
import {
	updateCodePreview,
	copyCodeToClipboard,
	updateMinHeightBasedOnMode,
} from './codePreview.js';
import { initializeZenPayPlugin } from './pluginInit.js';

/**
 * Update code preview on inputs and mode change
 */
export function initInputPreviewListeners() {
	$(
		'#apiKeyInput, #usernameInput, #passwordInput, #merchantCodeInput, #paymentAmountInput, #modeSelect'
	).on('input change', updateCodePreview);
}

/**
 * Payment-method toggles
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
 * Additional-options toggles
 */
export function initAdditionalOptionsListeners() {
	$('.option-toggle').on('change', function () {
		const option = $(this).data('option');
		additionalOptions[option] = $(this).prop('checked');
		updateCodePreview();
	});
}

/**
 * Dynamic minHeight input
 */
export function initUiMinHeightListener() {
	$('#uiMinHeightInput').on('input', updateCodePreview);
}

/**
 * Show/hide tokenization & update preview on mode change
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
 * Initialize ZenPay plugin
 */
export function initInitializePluginListener() {
	$('#initializePlugin').on('click', initializeZenPayPlugin);
}

/**
 * Copy code preview to clipboard
 */
export function initCopyCodeListener() {
	$('#copyCodeBtn').on('click', copyCodeToClipboard);
}

/**
 * Native tooltips on each <option> in mode selector
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
 * Show payment mode tooltip on hover
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
 * Hide payment mode tooltip when the mode changes
 */
export function initPaymentModeChangeTooltip() {
	$('#modeSelect').on('change', function () {
		$('.payment-mode-info').tooltip('hide');
	});
}
