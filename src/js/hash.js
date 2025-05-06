import { sha3_512, $ } from './globals.js';
import { showError } from './modal.js';
/**
 * @typedef {Object} FingerprintPayload
 * @property {string} apiKey
 * @property {string} username
 * @property {string} password
 * @property {string} mode
 * @property {number} paymentAmount   -  amount in whole number i.e. 1000 for 10.00
 * @property {string} merchantUniquePaymentId
 * @property {string} timestamp    – 'yyyy-mm-ddThh:mm:ss' format
 */

/**
 * Validate timestamp format yyyy-mm-ddThh:mm:ss
 * @param {string} timestamp
 * @returns {boolean}
 */
function validateTimestampFormat(timestamp) {
	const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
	return regex.test(timestamp);
}

/**
 * Validate fingerprint payload fields.
 * @param {string} apiKey
 * @param {string} username
 * @param {string} password
 * @param {string} mode
 * @param {number} paymentAmount
 * @param {string} merchantUniquePaymentId
 * @param {string} timestamp
 * @returns {boolean} True if all required fields are valid, false otherwise.
 */
function validateFingerprintPayload(
	apiKey,
	username,
	password,
	mode,
	paymentAmount,
	merchantUniquePaymentId,
	timestamp
) {
	if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
		showError('Validation Error', 'apiKey is required and must be a non-empty string.');
		return false;
	}
	if (!username || typeof username !== 'string' || username.trim() === '') {
		showError('Validation Error', 'username is required and must be a non-empty string.');
		return false;
	}
	if (!password || typeof password !== 'string' || password.trim() === '') {
		showError('Validation Error', 'password is required and must be a non-empty string.');
		return false;
	}
	if (!mode || typeof mode !== 'string' || mode.trim() === '') {
		showError('Validation Error', 'mode is required and must be a non-empty string.');
		return false;
	}
	if (
		paymentAmount === undefined ||
		paymentAmount === null ||
		isNaN(Number(paymentAmount)) ||
		Number(paymentAmount) <= 0
	) {
		showError('Validation Error', 'paymentAmount is required and must be a positive number.');
		return false;
	}
	if (
		!merchantUniquePaymentId ||
		typeof merchantUniquePaymentId !== 'string' ||
		merchantUniquePaymentId.trim() === ''
	) {
		showError(
			'Validation Error',
			'merchantUniquePaymentId is required and must be a non-empty string.'
		);
		return false;
	}
	if (!timestamp || typeof timestamp !== 'string' || timestamp.trim() === '') {
		showError('Validation Error', 'timestamp is required and must be a non-empty string.');
		return false;
	}
	if (!validateTimestampFormat(timestamp)) {
		showError('Validation Error', 'timestamp must be in the format yyyy-mm-ddThh:mm:ss.');
		return false;
	}
	return true;
}

export function buildFingerprintPayload(
	apiKey,
	username,
	password,
	mode,
	paymentAmount,
	merchantUniquePaymentId,
	timestamp
) {
	console.log(`[buildFingerprintPayload] apiKey: ${apiKey}`);
	console.log(`[buildFingerprintPayload] username: ${username}`);
	console.log(`[buildFingerprintPayload] password: ${password}`);
	console.log(`[buildFingerprintPayload] mode: ${mode}`);
	console.log(`[buildFingerprintPayload] paymentAmount: ${paymentAmount}`);
	console.log(`[buildFingerprintPayload] merchantUniquePaymentId: ${merchantUniquePaymentId}`);
	console.log(`[buildFingerprintPayload] timestamp: ${timestamp}`);
	validateFingerprintPayload(
		apiKey,
		username,
		password,
		mode,
		paymentAmount,
		merchantUniquePaymentId,
		timestamp
	);
	if (
		!validateFingerprintPayload(
			apiKey,
			username,
			password,
			mode,
			paymentAmount,
			merchantUniquePaymentId,
			timestamp
		)
	) {
		throw new Error('[buildFingerprintPayloadInvalid fingerprint payload');
	}
	const payload = {
		apiKey,
		username,
		password,
		mode,
		paymentAmount,
		merchantUniquePaymentId,
		timestamp,
	};
	console.log(`[buildFingerprintPayload] Payload:`);
	console.log(payload);
	console.log('{payload}');
	console.json(payload);
	console.log('{json-payload}');
	console.log(`[buildFingerprintPayload] Payload: ${JSON.stringify(payload)}`);
	return payload;
}

/**
 * Generate the SHA-3-512 fingerprint from a payload object.
 * (Keeps cryptography in one place.)
 */
export function generateFingerprint({
	apiKey,
	username,
	password,
	mode,
	paymentAmount,
	merchantUniquePaymentId,
	timestamp,
}) {
	const selectedVersion = $('input[name="version"]:checked').val();
	console.log(`[generateFingerprint] Selected version: ${selectedVersion}`);

	const payload = {
		apiKey,
		username,
		password,
		mode,
		paymentAmount,
		merchantUniquePaymentId,
		timestamp,
	};

	console.log('[generateFingerprint] Payload:');
	console.json(payload);

	let hash = '';
	if (selectedVersion === 'v3') {
		hash = createSHA1Hash(
			apiKey,
			username,
			password,
			mode,
			paymentAmount,
			merchantUniquePaymentId,
			timestamp
		);
	} else if (selectedVersion === 'v4') {
		hash = createSHA512Hash(
			apiKey,
			username,
			password,
			mode,
			paymentAmount,
			merchantUniquePaymentId,
			timestamp
		);
	} else {
		hash = createSHA3_512Hash(
			apiKey,
			username,
			password,
			mode,
			paymentAmount,
			merchantUniquePaymentId,
			timestamp
		);
	}
	console.log(`[generateFingerprint] Fingerprint: ${hash}`);
	return hash;
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
 * @param {string|number} paymentAmount - Amount used in the hash.
 * @param {string} merchantUniquePaymentId - Unique payment identifier.
 * @param {string} timestamp - Timestamp string.
 * @returns {Promise<string>} Promise resolving to the SHA-1 fingerprint hash.
 */
export async function createSHA1Hash(
	apiKey,
	username,
	password,
	mode,
	paymentAmount,
	merchantUniquePaymentId,
	timestamp
) {
	const data = [
		apiKey,
		username,
		password,
		mode,
		paymentAmount,
		merchantUniquePaymentId,
		timestamp,
	].join('|');
	console.trace('[createSHA1Hash] Called from:');
	console.log(`[createSHA1Hash] Fingerprint Payload 👇`);
	console.json({
		apiKey,
		username,
		password,
		mode,
		paymentAmount,
		merchantUniquePaymentId,
		timestamp,
	});
	const hash = await sha1(data);
	console.log(`[createSHA1Hash] SHA1 👉 ${hash}`);
	return hash;
}

/**
 * Create a SHA-512 fingerprint for payment payload.
 * @param {string} apiKey - Merchant API key.
 * @param {string} username - Merchant username.
 * @param {string} password - Merchant password.
 * @param {string|number} mode - Payment mode identifier.
 * @param {string|number} paymentAmount - Amount used in the hash.
 * @param {string} merchantUniquePaymentId - Unique payment identifier.
 * @param {string} timestamp - Timestamp string.
 * @returns {Promise<string>} Promise resolving to the SHA-512 fingerprint hash.
 */
export async function createSHA512Hash(
	apiKey,
	username,
	password,
	mode,
	paymentAmount,
	merchantUniquePaymentId,
	timestamp
) {
	const data = [
		apiKey,
		username,
		password,
		mode,
		paymentAmount,
		merchantUniquePaymentId,
		timestamp,
	].join('|');
	console.trace('[createSHAA512Hash] Called from:');
	console.log(`[createSHA512Hash] Fingerprint Payload 👇`);
	console.json({
		apiKey,
		username,
		password,
		mode,
		paymentAmount,
		merchantUniquePaymentId,
		timestamp,
	});
	const hash = await sha512(data);
	console.log(`[createSHA512Hash] SHA-512 👉 ${hash}`);
	return hash;
}

/**
 * Create a SHA-3-512 fingerprint for payment payload.
 * @param {string} apiKey - Merchant API key.
 * @param {string} username - Merchant username.
 * @param {string} password - Merchant password.
 * @param {string|number} mode - Payment mode identifier.
 * @param {string|number} paymentAmount - Amount used in the hash.
 * @param {string} merchantUniquePaymentId - Unique payment identifier.
 * @param {string} timestamp - Timestamp string.
 * @returns {string} Hex-encoded SHA-3-512 fingerprint hash.
 */
export function createSHA3_512Hash(
	apiKey,
	username,
	password,
	mode,
	paymentAmount,
	merchantUniquePaymentId,
	timestamp
) {
	const data = [
		apiKey,
		username,
		password,
		mode,
		paymentAmount,
		merchantUniquePaymentId,
		timestamp,
	].join('|');

	console.trace('[createSHA3_512Hash] Called from');
	console.log(`[createSHA3_512Hash] Fingerprint Payload 👇`);
	console.json({
		apiKey,
		username,
		password,
		mode,
		paymentAmount,
		merchantUniquePaymentId,
		timestamp,
	});
	const hash = sha3_512(data);
	console.log(`[createSHA3_512Hash] SHA3-512 👉 ${hash}`);
	return hash;
}
