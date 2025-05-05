/**
 * ZenPay Payment Plugin Demo - Session Management
 */

import { $ } from './globals.js';
import { paymentMethodOptions, additionalOptions } from './globals.js';

// Session storage keys
export const SESSION_KEYS = {
    API_KEY: 'demoApiKey',
    USERNAME: 'demoUsername',
    PASSWORD: 'demoPassword',
    MERCHANT_CODE: 'demoMerchantCode',
    PAYMENT_AMOUNT: 'demoPaymentAmount',
    MODE: 'demoMode',
    SUBDOMAIN: 'demoSubdomain',
    DOMAIN: 'demoDomain',
    VERSION: 'demoVersion',
    UI_MIN_HEIGHT: 'demo_uiMinHeight',
    REDIRECT_URL: 'demo_redirectUrl',
    CALLBACK_URL: 'demo_callbackUrl',
    MIN_HEIGHT: 'demo_minHeight',
    CUSTOMER_NAME: 'demo_customerName',
    CUSTOMER_REFERENCE: 'demo_customerReference',
    CUSTOMER_EMAIL: 'demo_customerEmail',
    MERCHANT_UNIQUE_PAYMENT_ID: 'demo_merchantUniquePaymentId',
    CONTACT_NUMBER: 'demo_contactNumber'
};

/**
 * Save a value to session storage with error handling
 */
export function saveToSession(key, value) {
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error saving to session storage:', e);
    }
}

/**
 * Get a value from session storage with error handling
 */
export function getFromSession(key, defaultValue = null) {
    try {
        const value = sessionStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
        console.error('Error retrieving from session storage:', e);
        return defaultValue;
    }
}

/**
 * Restore all session values to form fields
 */
export function restoreSessionValues() {
    // Restore credential fields
    $('#apiKeyInput').val(getFromSession(SESSION_KEYS.API_KEY, ''));
    $('#usernameInput').val(getFromSession(SESSION_KEYS.USERNAME, ''));
    $('#passwordInput').val(getFromSession(SESSION_KEYS.PASSWORD, ''));
    $('#merchantCodeInput').val(getFromSession(SESSION_KEYS.MERCHANT_CODE, ''));
    $('#paymentAmountInput').val(getFromSession(SESSION_KEYS.PAYMENT_AMOUNT, ''));
    $('#modeSelect').val(getFromSession(SESSION_KEYS.MODE, '0'));

    // Show tokenization options if mode is 1
    if ($('#modeSelect').val() === '1') {
        $('#tokenizationOptions').removeClass('d-none');
    }

    // Restore payment method options
    $('.payment-method-toggle').each(function() {
        const option = $(this).data('option');
        const savedValue = getFromSession(`demo_${option}`, false);
        if (savedValue === true) {
            $(this).prop('checked', true);
            if (paymentMethodOptions && option in paymentMethodOptions) {
                paymentMethodOptions[option] = true;
            }
        }
    });

    // Restore additional options
    $('.option-toggle').each(function() {
        const option = $(this).data('option');
        const savedValue = getFromSession(`demo_${option}`, false);
        if (savedValue === true) {
            $(this).prop('checked', true);
            if (additionalOptions && option in additionalOptions) {
                additionalOptions[option] = true;
            }
        }
    });

    // Restore URL builder settings
    const savedSubdomain = getFromSession(SESSION_KEYS.SUBDOMAIN);
    if (savedSubdomain) {
        $(`input[name="subdomain"][value="${savedSubdomain}"]`).prop('checked', true);
    }

    const savedDomain = getFromSession(SESSION_KEYS.DOMAIN);
    if (savedDomain) {
        $('#domainSelect').val(savedDomain);
    }

    const savedVersion = getFromSession(SESSION_KEYS.VERSION);
    if (savedVersion) {
        $(`input[name="version"][value="${savedVersion}"]`).prop('checked', true);
    }

    // Restore UI minHeight
    $('#uiMinHeightInput').val(getFromSession(SESSION_KEYS.UI_MIN_HEIGHT, ''));
}

/**
 * Save all form field values to session storage
 */
export function saveSessionValues() {
    // Save credential fields
    saveToSession(SESSION_KEYS.API_KEY, $('#apiKeyInput').val().trim());
    saveToSession(SESSION_KEYS.USERNAME, $('#usernameInput').val().trim());
    saveToSession(SESSION_KEYS.PASSWORD, $('#passwordInput').val().trim());
    saveToSession(SESSION_KEYS.MERCHANT_CODE, $('#merchantCodeInput').val().trim());
    saveToSession(SESSION_KEYS.PAYMENT_AMOUNT, $('#paymentAmountInput').val().trim());
    saveToSession(SESSION_KEYS.MODE, $('#modeSelect').val());

    // Save payment method options
    $('.payment-method-toggle').each(function() {
        const option = $(this).data('option');
        saveToSession(`demo_${option}`, $(this).prop('checked'));
    });

    // Save additional options
    $('.option-toggle').each(function() {
        const option = $(this).data('option');
        saveToSession(`demo_${option}`, $(this).prop('checked'));
    });

    // Save URL builder settings
    saveToSession(SESSION_KEYS.SUBDOMAIN, $('input[name="subdomain"]:checked').val());
    saveToSession(SESSION_KEYS.DOMAIN, $('#domainSelect').val());
    saveToSession(SESSION_KEYS.VERSION, $('input[name="version"]:checked').val());

    // Save extended options
    saveToSession(SESSION_KEYS.REDIRECT_URL, $('#redirectUrlInput').val());
    saveToSession(SESSION_KEYS.CALLBACK_URL, $('#callbackUrlInput').val());
    saveToSession(SESSION_KEYS.MIN_HEIGHT, $('#minHeightInput').val());
    saveToSession(SESSION_KEYS.CUSTOMER_NAME, $('#customerNameInput').val());
    saveToSession(SESSION_KEYS.CUSTOMER_REFERENCE, $('#customerReferenceInput').val());
    saveToSession(SESSION_KEYS.CUSTOMER_EMAIL, $('#customerEmailInput').val());
    saveToSession(SESSION_KEYS.MERCHANT_UNIQUE_PAYMENT_ID, $('#merchantUniquePaymentIdInput').val());
    saveToSession(SESSION_KEYS.CONTACT_NUMBER, $('#contactNumberInput').val());

    // Save UI minHeight
    saveToSession(SESSION_KEYS.UI_MIN_HEIGHT, $('#uiMinHeightInput').val());
}

/**
 * Setup event listeners for automatic session storage
 */
export function setupSessionListeners() {
    // Listen to all form field changes
    $('#apiKeyInput, #usernameInput, #passwordInput, #merchantCodeInput, #paymentAmountInput, #modeSelect').on('input change', saveSessionValues);

    // Listen to payment method toggles
    $('.payment-method-toggle').on('change', saveSessionValues);

    // Listen to URL builder changes
    $('#domainSelect, input[name="subdomain"], input[name="version"]').on('change', saveSessionValues);

    // Listen to extended option changes
    $('#redirectUrlInput, #callbackUrlInput, #customerNameInput, #customerReferenceInput, #customerEmailInput, #merchantUniquePaymentIdInput, #contactNumberInput').on('input', saveSessionValues);

    // Listen to UI option changes
    $('#uiMinHeightInput').on('input', saveSessionValues);
}