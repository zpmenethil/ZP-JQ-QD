/**
 * @module extendedOptionsManager
 * @description Handles extended options for the ZenPay demo plugin, including generating UUIDs,
 * setting default customer details, updating redirect URLs, and wiring up UI event handlers.
 */

import { $ } from './globals.js';
import { generateFirstLastName, generateEmail, generateAndSetUuids } from './helpers.js';
import { updateRedirectUrl } from './urlBuilder.js';
import { updateCodePreview } from './codePreview.js';
import { extendedOptions } from './globals.js';

/**
 * Initialize the extended options UI:
 * 1. Populate default customer name, email, and contact number.
 * 2. Wire up `blur` listeners on inputs to update `extendedOptions` and refresh preview.
 * 3. Wire up `change` listener on domain selector to update redirect URL.
 * 4. Perform an initial redirect URL update.
 * @returns {void}
 */
export function initExtendedOptions() {
	// Generate fresh customer data
	const customerNameData = generateFirstLastName();
	const customerEmail = generateEmail(customerNameData.firstName);
	const customerMobileNumber = extendedOptions.contactNumber || '0400001002';

	// Set values in UI form fields
	$('#customerNameInput').val(customerNameData.fullName);
	$('#customerEmailInput').val(customerEmail);
	$('#contactNumberInput').val(customerMobileNumber);

	// Update extendedOptions with generated values
	extendedOptions.customerName = customerNameData.fullName;
	extendedOptions.customerEmail = customerEmail;
	extendedOptions.contactNumber = customerMobileNumber;

	// Generate UUIDs for customer reference and merchant unique payment ID
	generateAndSetUuids();
	// Maps HTML input IDs to their corresponding property names in the extendedOptions object
	const formFieldToOptionMapping = {
		redirectUrlInput: 'redirectUrl',
		callbackUrlInput: 'callbackUrl',
		customerNameInput: 'customerName',
		customerReferenceInput: 'customerReference',
		customerEmailInput: 'customerEmail',
		merchantUniquePaymentIdInput: 'merchantUniquePaymentId',
		contactNumberInput: 'contactNumber',
	};

	// Set up event listeners for each form field to update the corresponding option
	Object.entries(formFieldToOptionMapping).forEach(([inputElementId, optionPropertyName]) => {
		/**
		 * Update the corresponding extended option when the input loses focus.
		 * @param {Event} blur event
		 */
		$(`#${inputElementId}`).on('blur', function () {
			const inputValue = $(this).val();
			extendedOptions[optionPropertyName] = inputValue;

			if (typeof updateCodePreview === 'function') {
				updateCodePreview();
			}
		});
	});

	// Update redirect URL when the selected domain changes
	$('#domainSelect').on('change', () => {
		updateRedirectUrl();
	});

	// Initial redirect URL calculation
	updateRedirectUrl();
}
