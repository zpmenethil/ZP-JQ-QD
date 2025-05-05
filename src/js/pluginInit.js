// Import dependencies
import { $ } from './globals.js';
import { generateCurrentDatetime, generateUUID, createSHA3Hash } from './helpers.js';
import { extendedOptions } from './extendedOptions.js';
import { paymentMethodOptions, additionalOptions } from './globals.js';
import { saveSessionValues } from './session.js';

/**
 * Initialize the ZenPay plugin with current configuration
 */
export function initializeZenPayPlugin() {
    try {
        // Save current session values
        saveSessionValues();

        const timestamp = generateCurrentDatetime();
        const merchantUniquePaymentId = extendedOptions.merchantUniquePaymentId || generateUUID();
        const customerReference = extendedOptions.customerReference || generateUUID();
        const apiKey = $('#apiKeyInput').val().trim();
        const username = $('#usernameInput').val().trim();
        const password = $('#passwordInput').val().trim();
        const merchantCode = $('#merchantCodeInput').val().trim();
        const url = document.getElementById('urlPreview').value;

        const inputPaymentAmount = Number.parseFloat($('#paymentAmountInput').val()) || 0.0;
        const paymentAmount = +inputPaymentAmount.toFixed(2);

        const selectedMode = $('#modeSelect').val();

        // For the fingerprint process, if Mode 2 is selected, use 0 as the payment amount for fingerprinting.
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

        // Initialize plugin with base configuration
        const paymentConfig = {
            url: url,
            merchantCode: merchantCode,
            apiKey: apiKey,
            fingerprint: fingerprint,
            timeStamp: timestamp,
            paymentAmount: paymentAmount,
            mode: Number.parseInt(selectedMode, 10),
            redirectUrl: extendedOptions.redirectUrl,
            merchantUniquePaymentId: merchantUniquePaymentId,
            customerName: extendedOptions.customerName,
            contactNumber: extendedOptions.contactNumber,
            customerEmail: extendedOptions.customerEmail,
            customerReference: customerReference
        };

        // Add callback URL if provided
        if (extendedOptions.callbackUrl) {
            paymentConfig.callbackUrl = extendedOptions.callbackUrl;
        }

        // Add minHeight from UI Options tab
        const minHeight = $('#uiMinHeightInput').val();
        if (minHeight) {
            paymentConfig.minHeight = Number.parseInt(minHeight, 10);
        }

        // Add payment method options if they're enabled
        for (const option in paymentMethodOptions) {
            if (paymentMethodOptions[option]) {
                paymentConfig[option] = true;
            }
        }

        // Add additional options if they're enabled
        for (const option in additionalOptions) {
            // Only include tokenization options if mode is 1
            if (option === 'showFeeOnTokenising' || option === 'showFailedPaymentFeeOnTokenising') {
                if (selectedMode === '1' && additionalOptions[option]) {
                    paymentConfig[option] = true;
                }
            } else if (additionalOptions[option]) {
                paymentConfig[option] = true;
            }
        }

        const payment = $.zpPayment(paymentConfig);

        console.log('Payment object initialized with payload:', payment.options);
        payment.open();
    } catch (err) {
        console.error('Error initializing plugin:', err);
        alert('Unable to initialize plugin. See console for details.');
    }
}