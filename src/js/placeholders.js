/**
 * ZenPay Payment Plugin Demo - Placeholder Management
 */

import { $ } from './globals.js';

/**
 * Setup placeholder consistency and enhancement
 */
export function initPlaceholderFix() {
    // List of credential input fields
    const credentialFields = [
        '#apiKeyInput',
        '#usernameInput',
        '#passwordInput',
        '#merchantCodeInput',
        '#paymentAmountInput'
    ];

    // Add placeholders to these fields
    $(credentialFields.join(', ')).each(function() {
        const $this = $(this);
        const placeholderText = $this.attr('placeholder') || '';

        // Store the original placeholder if not already done
        if (!$this.data('original-placeholder')) {
            $this.data('original-placeholder', placeholderText);
        }

        // Set the placeholder explicitly
        $this.attr('placeholder', $this.data('original-placeholder'));
    });
}

/**
 * Enhanced placeholder handling for consistent styling
 * This function modifies input fields to treat placeholders visually like actual values
 */
export function enhancePlaceholderConsistency() {
    // Target all form-floating inputs that should have consistent placeholder behavior
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
        '#uiMinHeightInput'
    ];

    $(inputSelectors.join(', ')).each(function() {
        const $input = $(this);
        const originalPlaceholder = $input.attr('placeholder');

        if (!originalPlaceholder) return; // Skip if no placeholder

        // Store original placeholder
        $input.data('original-placeholder', originalPlaceholder);

        // When the input field has no value, add the has-placeholder class and show placeholder
        function updatePlaceholderState() {
            if (!$input.val()) {
                $input.addClass('has-placeholder');
                $input.attr('placeholder', $input.data('original-placeholder'));
            } else {
                $input.removeClass('has-placeholder');
                // Keep placeholder empty when value exists to avoid confusion
                $input.attr('placeholder', '');
            }
        }

        // Initial state
        updatePlaceholderState();

        // Update on value change
        $input.on('input change blur', updatePlaceholderState);

        // Special handling for focus - keep the has-placeholder class but update text
        $input.on('focus', function() {
            if (!$input.val()) {
                $input.addClass('has-placeholder');
                $input.attr('placeholder', $input.data('original-placeholder'));
            }
        });
    });
}

/**
 * Setup placeholder styling for all inputs with placeholders
 */
export function setupPlaceholderStyling() {
    $('.form-floating input[placeholder], .form-floating textarea[placeholder]').each(function() {
        const $input = $(this);
        const originalPlaceholder = $input.attr('placeholder');

        if (!originalPlaceholder) return;

        // Function to update the class based on value state
        function updatePlaceholderState() {
            if (!$input.val()) {
                $input.addClass('placeholder-as-value');
            } else {
                $input.removeClass('placeholder-as-value');
            }
        }

        // Set initial state
        updatePlaceholderState();

        // Update on input events
        $input.on('input change blur', updatePlaceholderState);
    });
}

/**
 * Initialize all placeholder functionality
 */
export function initPlaceholders() {
    initPlaceholderFix();
    enhancePlaceholderConsistency();
    setupPlaceholderStyling();

    // Also call whenever there might be dynamically loaded content
    $(document).on('valueLoaded formReset', setupPlaceholderStyling);
}