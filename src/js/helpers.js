/**
 * ZenPay Payment Plugin Demo - Helper Functions
 * @module helpers
 */

import { $ } from './globals.js';
import { extendedOptions } from './globals.js';
// import { updateCodePreview } from './codePreview.js';

/**
 * Generate a random payment amount between 10.00 and 1000.00.
 * @returns {string} A string representing the amount with two decimal places.
 */
export function generateRandomPaymentAmount() {
	return (Math.random() * 990 + 10).toFixed(2);
}

/**
 * Generate new UUIDs for `customerReference` and `merchantUniquePaymentId`,
 * populate the corresponding input fields, update `extendedOptions`, and
 * refresh the code preview if available.
 * @returns {void}
 */
export function generateAndSetUuids() {
	const customerReference = generateUUID();
	const merchantUniquePaymentId = generateUUID();

	$('#customerReferenceInput').val(customerReference);
	$('#merchantUniquePaymentIdInput').val(merchantUniquePaymentId);

	extendedOptions.customerReference = customerReference;
	extendedOptions.merchantUniquePaymentId = merchantUniquePaymentId;
}

const NAMES = [
	{ firstName: 'Tyrael', lastName: 'Justice' },
	{ firstName: 'Imperius', lastName: 'Valor' },
	{ firstName: 'Baal', lastName: 'Destruction' },
	{ firstName: 'Leah', lastName: 'Adria' },
	{ firstName: 'Deckard', lastName: 'Cain' },
	{ firstName: 'Durotan', lastName: 'Frostwolf' },
	{ firstName: 'Orgrim', lastName: 'Doomhammer' },
	{ firstName: "Kael'thas", lastName: 'Sunstrider' },
	{ firstName: 'Maiev', lastName: 'Shadowsong' },
	{ firstName: 'Medivh', lastName: 'Guardian' },
	{ firstName: 'Jim', lastName: 'Raynor' },
	{ firstName: 'Sarah', lastName: 'Kerrigan' },
	{ firstName: 'Arcturus', lastName: 'Mengsk' },
	{ firstName: 'Zeratul', lastName: 'Darkblade' },
	{ firstName: 'Tassadar', lastName: 'Executor' },
	{ firstName: 'Arthas', lastName: 'Menethil' },
	{ firstName: 'Thrall', lastName: "Go'el" },
	{ firstName: 'Illidan', lastName: 'Stormrage' },
	{ firstName: 'Jaina', lastName: 'Proudmoore' },
	{ firstName: 'Sylvanas', lastName: 'Windrunner' },
	{ firstName: 'Bolvar', lastName: 'Fordragon' },
	{ firstName: 'Garrosh', lastName: 'Hellscream' },
	{ firstName: 'Varian', lastName: 'Wrynn' },
	{ firstName: 'Anduin', lastName: 'Wrynn' },
	{ firstName: 'Tyrande', lastName: 'Whisperwind' },
	{ firstName: 'Calia', lastName: 'Menethil' },
];
/**
 * @typedef {Object} PersonName
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} fullName
 */
export function generateFirstLastName() {
	const { firstName, lastName } = NAMES[Math.floor(Math.random() * NAMES.length)];
	return { firstName, lastName, fullName: `${firstName} ${lastName}` };
}

/**
 * Generate an email using the provided first name.
 * @param {string} firstName
 * @returns {string}
 */
export function generateEmail(firstName) {
	return `${firstName.toLowerCase()}@zenpay.com.au`;
}

/**
 * @returns {string} A randomly generated UUID.
 */
export function generateUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

/**
 * Get the current timestamp in ISO format (YYYY-MM-DDTHH:MM:SS).
 * @returns {string}
 */
export function generateCurrentDatetime() {
	return new Date().toISOString().slice(0, 19);
}

/**
 * Encode a binary string (ASCII only) to Base64.
 * @param {string} str - ASCII string to encode.
 * @returns {string} Base64-encoded string.
 */
export function base64EncodeASCII(str) {
	return btoa(str);
}

/**
 * Decode a Base64-encoded ASCII string.
 * @param {string} b64 - Base64 string to decode.
 * @returns {string} Decoded ASCII string.
 */
export function base64DecodeASCII(b64) {
	return atob(b64);
}

/**
 * Debounces a function, delaying its execution until after a specified wait time
 * has elapsed since the last time it was invoked.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @param {boolean} immediate - Trigger the function on the leading edge instead of the trailing.
 * @returns {Function} The new debounced function.
 */
export function debounce(func, wait, immediate) {
	let timeout;
	return function executedFunction() {
		const context = this;
		const args = arguments;
		const later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

/**
 * Copy the code snippet to the clipboard.
 * @returns {void}
 */
export function copyCodeToClipboard() {
	const codeText = $('#codePreview').text();
	navigator.clipboard
		.writeText(codeText)
		.then(() => {
			const copyBtn = $('#copyCodeBtn');
			const originalIcon = copyBtn.html();
			copyBtn.html('<i class="bi bi-check-lg"></i>');

			setTimeout(() => {
				copyBtn.html(originalIcon);
			}, 2000);
		})
		.catch((err) => {
			console.error('Failed to copy code:', err);
			alert('Failed to copy code. Please try again.');
		});
}
