/**
 * ZenPay Payment Plugin Demo - Placeholder Management
 * @module placeholderManagement
 */

import { $ } from './globals.js';

/**
 * Setup placeholder consistency and enhancement.
 * @returns {void}
 */
export function initPlaceholder() {
	const credentialFields = [
		'#apiKeyInput',
		'#usernameInput',
		'#passwordInput',
		'#merchantCodeInput',
		'#paymentAmountInput',
	];
	$(credentialFields.join(', ')).each(function () {
		const $this = $(this);
		const placeholderText = $this.attr('placeholder') || '';
		if (!$this.data('original-placeholder')) {
			$this.data('original-placeholder', placeholderText);
		}
		$this.attr('placeholder', $this.data('original-placeholder'));
	});
}

/**
 * Enhanced placeholder handling for consistent styling.
 * This function modifies input fields to treat placeholders visually like actual values.
 * @returns {void}
 */
export function enhancePlaceholderConsistency() {
	const inputSelectors = [
		'#apiKeyInput',
		'#usernameInput',
		'#passwordInput',
		'#merchantCodeInput',
		'#paymentAmountInput',
		'#redirectUrlInput',
		'#callbackUrlInput',
		'#customerNameInput',
		'#contactNumberInput',
		'#customerEmailInput',
		'#customerReferenceInput',
		'#merchantUniquePaymentIdInput',
		'#minHeightInput',
	];

	$(inputSelectors.join(', ')).each(function () {
		const $input = $(this);
		const originalPlaceholder = $input.attr('placeholder');

		if (!originalPlaceholder) return;
		$input.data('original-placeholder', originalPlaceholder);

		function updatePlaceholderState() {
			if (!$input.val()) {
				$input.addClass('has-placeholder');
				$input.attr('placeholder', $input.data('original-placeholder'));
			} else {
				$input.removeClass('has-placeholder');
				$input.attr('placeholder', '');
			}
		}

		updatePlaceholderState();

		$input.on('input change blur', updatePlaceholderState);

		$input.on('focus', function () {
			if (!$input.val()) {
				$input.addClass('has-placeholder');
				$input.attr('placeholder', $input.data('original-placeholder'));
			}
		});
	});
}

/**
 * Setup placeholder styling for all inputs with placeholders.
 * @returns {void}
 */
export function setupPlaceholderStyling() {
	$('.form-floating input[placeholder], .form-floating textarea[placeholder]').each(function () {
		const $input = $(this);
		const originalPlaceholder = $input.attr('placeholder');

		if (!originalPlaceholder) return;

		function updatePlaceholderState() {
			if (!$input.val()) {
				$input.addClass('placeholder-as-value');
			} else {
				$input.removeClass('placeholder-as-value');
			}
		}

		updatePlaceholderState();

		$input.on('input change blur', updatePlaceholderState);
	});
}

/**
 * Initialize all placeholder functionality.
 * @returns {void}
 */
export function initPlaceholders() {
	initPlaceholder();
	enhancePlaceholderConsistency();
	setupPlaceholderStyling();
	$(document).on('valueLoaded formReset', setupPlaceholderStyling);
}
