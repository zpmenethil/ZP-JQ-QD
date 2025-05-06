// Import dependencies
import { $ } from './globals.js';
import { generateFirstLastName, generateEmail, generateUUID } from './helpers.js';
import { updateRedirectUrl } from './urlBuilder.js';
import { updateCodePreview } from './codePreview.js';

// Extended options object with default values
export const extendedOptions = {
	redirectUrl: '',
	callbackUrl: '',
	minHeight: '',
	customerName: '',
	customerReference: '',
	customerEmail: '',
	merchantUniquePaymentId: '',
	contactNumber: '',
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
	const Name = generateFirstLastName();
	const email = generateEmail(Name.firstName);
	const mobileNumber = '0400000000';
	$('#customerNameInput').val(Name.fullName);
	$('#customerEmailInput').val(email);
	$('#contactNumberInput').val(mobileNumber);
	extendedOptions.customerName = Name.fullName;
	extendedOptions.customerEmail = email;
	extendedOptions.contactNumber = mobileNumber;

	// Handle input changes in extended options
	const inputMap = {
		redirectUrlInput: 'redirectUrl', // Text field
		callbackUrlInput: 'callbackUrl', // Text field
		customerNameInput: 'customerName', // Text field
		customerReferenceInput: 'customerReference', // Text field
		customerEmailInput: 'customerEmail', // Text field
		merchantUniquePaymentIdInput: 'merchantUniquePaymentId', // Text field
		contactNumberInput: 'contactNumber', // Text field
	};

	// Add event listeners for all mapped inputs
	Object.entries(inputMap).forEach(([inputId, optionKey]) => {
		$(`#${inputId}`).on('blur', function () {
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
