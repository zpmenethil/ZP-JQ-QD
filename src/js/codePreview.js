// Import dependencies
import { $, hljs } from './globals.js';
import { extendedOptions } from './extendedOptions.js';
import { generateCurrentDatetime, generateUUID, createSHA3Hash } from './helpers.js';
import { paymentMethodOptions, additionalOptions } from './globals.js';

/**
 * Build the code snippet based on current form values and options
 * @param {Object} config - Configuration object containing all necessary values
 * @returns {string} Formatted code snippet
 */
function buildCodeSnippet({
    apiKey,
    merchantCode,
    paymentAmount,
    mode,
    timestamp,
    merchantUniquePaymentId,
    customerReference,
    fingerprint
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
 * Update the code preview with current form values
 */
export function updateCodePreview() {
    const timestamp = generateCurrentDatetime();
    const merchantUniquePaymentId = extendedOptions.merchantUniquePaymentId || generateUUID();
    const customerReference = extendedOptions.customerReference || generateUUID();
    const apiKey = $('#apiKeyInput').val().trim();
    const username = $('#usernameInput').val().trim();
    const password = $('#passwordInput').val().trim();
    const merchantCode = $('#merchantCodeInput').val().trim();

    const inputPaymentAmount = Number.parseFloat($('#paymentAmountInput').val()) || 0.0;
    const paymentAmount = +inputPaymentAmount.toFixed(2);

    const selectedMode = $('#modeSelect').val();

    // For the fingerprint process, if Mode 2 is selected, use 0 as the payment amount.
    const fingerprintPaymentAmount = selectedMode === '2' ? 0 : paymentAmount;
    const hashAmount = Math.round(fingerprintPaymentAmount * 100);

    const fingerprint = createSHA3Hash(
        apiKey,
        username,
        password,
        selectedMode,
        hashAmount,
        merchantUniquePaymentId,
        timestamp
    );

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
        fingerprint
    });

    const codeBlock = document.getElementById('codePreview');
    codeBlock.textContent = snippet;
    hljs.highlightElement(codeBlock);
}

/**
 * Copy the code snippet to clipboard
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
 * Update minHeight based on selected mode
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