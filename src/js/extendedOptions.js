// Import dependencies
import { $ } from './globals.js';
import { generateFirstLastName, generateEmail, generateUUID } from './helpers.js';
import { updateRedirectUrl } from './urlBuilder.js';
import { updateCodePreview } from './codePreview.js';

// Extended options object with default values
export const extendedOptions = {
	redirectUrl: 'https://payuat.travelpay.com.au/demo/',
	callbackUrl: '',
	minHeight: '',
	customerName: 'Test User',
	customerReference: '',
	customerEmail: 'test@zenpay.com.au',
	merchantUniquePaymentId: '',
	contactNumber: '0400123123'
};

/**
 * Generate and set UUIDs for customer reference and merchant unique payment ID
 */
export function generateAndSetUuids() {
	const customerReference = generateUUID();
	const merchantUniquePaymentId = generateUUID();

	$('#customerReferenceInput').val(customerReference);
	$('#merchantUniquePaymentIdInput').val(merchantUniquePaymentId);

	extendedOptions.customerReference = customerReference;
	extendedOptions.merchantUniquePaymentId = merchantUniquePaymentId;

	// Update code preview if already defined
	if (typeof updateCodePreview === 'function') {
		updateCodePreview();
	}
}

/**
 * Initialize extended options functionality.
 * Sets up default values and event handlers for extended options form fields.
 */
export function initExtendedOptions() {
	// Generate Blizzard character data
	const characterName = generateFirstLastName();
	const email = generateEmail();
	const mobileNumber = '0400000000';

	// Set default values
	$('#customerNameInput').val(characterName);
	$('#customerEmailInput').val(email);
	$('#contactNumberInput').val(mobileNumber);

	// Update extended options object
	extendedOptions.customerName = characterName;
	extendedOptions.customerEmail = email;
	extendedOptions.contactNumber = mobileNumber;

	// Handle input changes in extended options
	const inputMap = {
		redirectUrlInput: 'redirectUrl',
		callbackUrlInput: 'callbackUrl',
		customerNameInput: 'customerName',
		customerReferenceInput: 'customerReference',
		customerEmailInput: 'customerEmail',
		merchantUniquePaymentIdInput: 'merchantUniquePaymentId',
		contactNumberInput: 'contactNumber'
	};

	// Add event listeners for all mapped inputs
	Object.entries(inputMap).forEach(([inputId, optionKey]) => {
		$(`#${inputId}`).on('input', function () {
			const value = $(this).val();
			extendedOptions[optionKey] = value;

			// Update code preview if defined
			if (typeof updateCodePreview === 'function') {
				updateCodePreview();
			}
		});
	});

	// Update redirect URL when domain changes
	$('#domainSelect').on('change', () => {
		updateRedirectUrl();
	});

	// Initial redirect URL setup
	updateRedirectUrl();
}

/**
 * Restore extended options values from session storage
 */
export function restoreExtendedOptions() {
	// Restore extended option values
	$('#redirectUrlInput').val(sessionStorage.getItem('demo_redirectUrl') || extendedOptions.redirectUrl);
	$('#callbackUrlInput').val(sessionStorage.getItem('demo_callbackUrl') || '');
	$('#minHeightInput').val(sessionStorage.getItem('demo_minHeight') || '');
	$('#customerNameInput').val(sessionStorage.getItem('demo_customerName') || extendedOptions.customerName);
	$('#customerReferenceInput').val(sessionStorage.getItem('demo_customerReference') || '');
	$('#customerEmailInput').val(sessionStorage.getItem('demo_customerEmail') || extendedOptions.customerEmail);
	$('#merchantUniquePaymentIdInput').val(sessionStorage.getItem('demo_merchantUniquePaymentId') || '');
	$('#contactNumberInput').val(sessionStorage.getItem('demo_contactNumber') || extendedOptions.contactNumber);

	// Update extended options object with restored values
	extendedOptions.redirectUrl = $('#redirectUrlInput').val();
	extendedOptions.callbackUrl = $('#callbackUrlInput').val();
	extendedOptions.minHeight = $('#minHeightInput').val();
	extendedOptions.customerName = $('#customerNameInput').val();
	extendedOptions.customerReference = $('#customerReferenceInput').val();
	extendedOptions.customerEmail = $('#customerEmailInput').val();
	extendedOptions.merchantUniquePaymentId = $('#merchantUniquePaymentIdInput').val();
	extendedOptions.contactNumber = $('#contactNumberInput').val();

	// If customer name, email, or contact number are empty, generate new ones
	if (!$('#customerNameInput').val()) {
		const characterName = generateFirstLastName();
		$('#customerNameInput').val(characterName);
		extendedOptions.customerName = characterName;
	}

	if (!$('#customerEmailInput').val()) {
		const email = generateEmail();
		$('#customerEmailInput').val(email);
		extendedOptions.customerEmail = email;
	}

	if (!$('#contactNumberInput').val()) {
		$('#contactNumberInput').val('0400000000');
		extendedOptions.contactNumber = '0400000000';
	}
}

/**
 * Save extended options values to session storage
 */
export function saveExtendedOptions() {
	// Save extended options
	sessionStorage.setItem('demo_redirectUrl', extendedOptions.redirectUrl);
	sessionStorage.setItem('demo_callbackUrl', extendedOptions.callbackUrl);
	sessionStorage.setItem('demo_minHeight', extendedOptions.minHeight);
	sessionStorage.setItem('demo_customerName', extendedOptions.customerName);
	sessionStorage.setItem('demo_customerReference', extendedOptions.customerReference);
	sessionStorage.setItem('demo_customerEmail', extendedOptions.customerEmail);
	sessionStorage.setItem('demo_merchantUniquePaymentId', extendedOptions.merchantUniquePaymentId);
	sessionStorage.setItem('demo_contactNumber', extendedOptions.contactNumber);
}
