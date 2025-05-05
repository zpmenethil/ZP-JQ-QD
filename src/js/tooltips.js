// Import dependencies
import { $, bootstrap } from './globals.js';

/**
 * Initialize all tooltips in the application.
 * @returns {void}
 */
export function initTooltips() {
    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(
        tooltipTriggerEl =>
            new bootstrap.Tooltip(tooltipTriggerEl, {
                trigger: 'hover focus'
            })
    );

    // Destroy and recreate tooltips when collapsible elements are shown
    $('.collapse').on('shown.bs.collapse', function () {
        // Destroy existing tooltips within the collapse
        $(this).find('[data-bs-toggle="tooltip"]').tooltip('dispose');

        // Reinitialize tooltips
        $(this).find('[data-bs-toggle="tooltip"]').tooltip();
    });
}

/**
 * Initialize tooltips specifically for payment mode info.
 * @returns {void}
 */
export function initPaymentModeTooltips() {
    // Initialize payment mode tooltips
    $('.payment-mode-info').on('mouseenter', function () {
        const currentMode = $('#modeSelect').val();
        let tooltipText = '';
        switch (currentMode) {
            case '0':
                tooltipText = 'Payment mode using a static payment amount supplied via the payload, which cannot be changed after plugin initialization.';
                break;
            case '1':
                tooltipText = 'Tokenization mode, suitable for building wallets.';
                break;
            case '2':
                tooltipText = 'Dynamic payment mode, allowing the payment amount to be changed after plugin initialization.';
                break;
            case '3':
                tooltipText = 'Preauth mode for authorizing payments without immediate capture.';
                break;
            default:
                tooltipText = 'Select the payment processing mode';
        }

        $(this).attr('data-bs-original-title', tooltipText).tooltip('show');
    });
    // Update tooltip when mode changes
    $('#modeSelect').on('change', () => {
        $('.payment-mode-info').tooltip('hide');
    });
}

/**
 * Re-initialize tooltips for theme changes.
 * This should be called after theme changes to ensure proper styling.
 */
export function reinitializeTooltips() {
    $('[data-bs-toggle="tooltip"]').tooltip('dispose');
    initTooltips();
}