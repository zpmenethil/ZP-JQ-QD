/**
 * ZenPay Payment Plugin Demo - Helper Functions
 * @module helpers
 */

import { sha3_512 } from './globals.js';

/**
 * Generate a random payment amount between 10.00 and 1000.00.
 * @returns {string} A string representing the amount with two decimal places.
 */
export function generateRandomPaymentAmount() {
	return (Math.random() * 990 + 10).toFixed(2);
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
 * Generate a random name pair from NAMES.
 * @returns {{ firstName: string, lastName: string, fullName: string }}
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

// Function to get a fresh timestamp
export function generateCurrentDatetime() {
	return new Date().toISOString().slice(0, 19);
}

// Function to get application start time
export function getAppStartTime() {
	return window.APP_START_TIME;
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
 * Convert a UTF-8 string into an ArrayBuffer.
 * @private
 * @param {string} str - String to convert.
 * @returns {Uint8Array} UTF-8 encoded bytes.
 */
function STR2AB(str) {
	return new TextEncoder().encode(str);
}

/**
 * Convert an ArrayBuffer into a lowercase hex string.
 * @private
 * @param {ArrayBuffer} buffer - Buffer to convert.
 * @returns {string} Hexadecimal representation.
 */
function AB2HEX(buffer) {
	const bytes = new Uint8Array(buffer);
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

/**
 * Compute the SHA-1 hash of the given data string.
 * @param {string} data - Input string to hash.
 * @returns {Promise<string>} Promise resolving to a hex-encoded SHA-1 digest.
 */
export async function sha1(data) {
	const hashBuffer = await crypto.subtle.digest('SHA-1', STR2AB(data));
	return AB2HEX(hashBuffer);
}

/**
 * Compute the SHA-512 hash of the given data string.
 * @param {string} data - Input string to hash.
 * @returns {Promise<string>} Promise resolving to a hex-encoded SHA-512 digest.
 */
export async function sha512(data) {
	const hashBuffer = await crypto.subtle.digest('SHA-512', STR2AB(data));
	return AB2HEX(hashBuffer);
}

/**
 * Create a SHA-1 fingerprint for payment payload.
 * @param {string} apiKey - Merchant API key.
 * @param {string} username - Merchant username.
 * @param {string} password - Merchant password.
 * @param {string|number} mode - Payment mode identifier.
 * @param {string|number} hashAmount - Amount used in the hash.
 * @param {string} merchantUniquePaymentId - Unique payment identifier.
 * @param {string} timestamp - Timestamp string.
 * @returns {Promise<string>} Promise resolving to the SHA-1 fingerprint hash.
 */
export async function createSHA1Hash(
	apiKey,
	username,
	password,
	mode,
	hashAmount,
	merchantUniquePaymentId,
	timestamp
) {
	const data = [
		apiKey,
		username,
		password,
		mode,
		hashAmount,
		merchantUniquePaymentId,
		timestamp,
	].join('|');
	console.log(`[createSHA1Hash] Data: ${data}`);
	console.log(`[createSHA1Hash] Fingerprint Payload 👇`);
	const hash = await sha1(data);
	console.log(`[createSHA1Hash] Fingerprint Payload Hash (SHA1): ${hash}`);
	return hash;
}

/**
 * Create a SHA-512 fingerprint for payment payload.
 * @param {string} apiKey - Merchant API key.
 * @param {string} username - Merchant username.
 * @param {string} password - Merchant password.
 * @param {string|number} mode - Payment mode identifier.
 * @param {string|number} hashAmount - Amount used in the hash.
 * @param {string} merchantUniquePaymentId - Unique payment identifier.
 * @param {string} timestamp - Timestamp string.
 * @returns {Promise<string>} Promise resolving to the SHA-512 fingerprint hash.
 */
export async function createSHA512Hash(
	apiKey,
	username,
	password,
	mode,
	hashAmount,
	merchantUniquePaymentId,
	timestamp
) {
	const data = [
		apiKey,
		username,
		password,
		mode,
		hashAmount,
		merchantUniquePaymentId,
		timestamp,
	].join('|');
	console.log(`[createSHA512Hash] Data: ${data}`);
	console.log(`[createSHA512Hash] Fingerprint Payload 👇`);
	const hash = await sha512(data);
	console.log(`[createSHA512Hash] Fingerprint Payload Hash (SHA512): ${hash}`);
	return hash;
}

/**
 * Create a SHA-3-512 fingerprint for payment payload.
 * @param {string} apiKey - Merchant API key.
 * @param {string} username - Merchant username.
 * @param {string} password - Merchant password.
 * @param {string|number} mode - Payment mode identifier.
 * @param {string|number} hashAmount - Amount used in the hash.
 * @param {string} merchantUniquePaymentId - Unique payment identifier.
 * @param {string} timestamp - Timestamp string.
 * @returns {string} Hex-encoded SHA-3-512 fingerprint hash.
 */
export function createSHA3_512Hash(
	apiKey,
	username,
	password,
	mode,
	hashAmount,
	merchantUniquePaymentId,
	timestamp
) {
	const data = [
		apiKey,
		username,
		password,
		mode,
		hashAmount,
		merchantUniquePaymentId,
		timestamp,
	].join('|');

	console.log(`[createSHA3_512Hash] Data: ${data}`);
	console.log(`[createSHA3_512Hash] Fingerprint Payload 👇`);
	console.trace('[createSHA3_512Hash] Called from:'); // <--- Add this line
	const hash = sha3_512(data);
	console.log(`[createSHA3_512Hash] Fingerprint Payload Hash: ${hash}`);
	return hash;
}

/**
 * Validates the configuration object schema for required fields.
 * @param {object} config - Configuration object to validate.
 * @param {string} config.apiKey - Merchant API key.
 * @param {string} config.username - Merchant username.
 * @param {string} config.password - Merchant password.
 * @param {string} config.merchantCode - Merchant code.
 * @returns {boolean} `true` if the config has all required fields; otherwise `false`.
 */
export function validateConfigSchema(config) {
	if (!config || typeof config !== 'object') return false;

	// Check for required fields
	const requiredFields = ['apiKey', 'username', 'password', 'merchantCode'];
	return requiredFields.every(
		(field) =>
			Object.prototype.hasOwnProperty.call(config, field) &&
			typeof config[field] === 'string' &&
			config[field].trim() !== ''
	);
}
