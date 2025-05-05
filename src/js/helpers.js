/**
 * ZenPay Payment Plugin Demo - Helper Functions
 */

import { FirstNames, LastNames, sha3_512, sha1, sha512 } from './globals.js';

export function generateRandomPaymentAmount() {
	return (Math.random() * 990 + 10).toFixed(2);
}

export function generateUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export function generateCurrentDatetime() {
	return new Date().toISOString().slice(0, 19);
}

export function createSHA3_512Hash(apiKey, username, password, mode, hashAmount, merchantUniquePaymentId, timestamp) {
	// log each value joining them `|`
	const data = [apiKey, username, password, mode, hashAmount, merchantUniquePaymentId, timestamp].join('|');
	console.log(`[createSHA1Hash] d`, data);
	console.log(`[createSHA1Hash] Data: ${data}`);
	console.log(`[createSHA3_512Hash] Fingerprint Payload 👇`);
	hash = sha3_512(data);
	console.log(`[createSHA3_512Hash] Fingerprint Payload Hash: ${hash}`);
	return hash;
}

export function createSHA1Hash(apiKey, username, password, mode, hashAmount, merchantUniquePaymentId, timestamp) {
	const data = [apiKey, username, password, mode, hashAmount, merchantUniquePaymentId, timestamp].join('|');
	console.log(`[createSHA1Hash] Data: ${data}`);
	console.log(`[createSHA1Hash] Fingerprint Payload 👇`);
	const hash = sha1(data);
	console.log(`[createSHA1Hash] Fingerprint Payload Hash (SHA1): ${hash}`);
	return hash;
}

export function createSHA512Hash(apiKey, username, password, mode, hashAmount, merchantUniquePaymentId, timestamp) {
	const data = [apiKey, username, password, mode, hashAmount, merchantUniquePaymentId, timestamp].join('|');
	console.log(`[createSHA512Hash] Data: ${data}`);
	console.log(`[createSHA512Hash] Fingerprint Payload 👇`);
	const hash = sha512(data);
	console.log(`[createSHA512Hash] Fingerprint Payload Hash (SHA512): ${hash}`);
	return hash;
}

export function generateFirstLastName() {
	const firstName = FirstNames[Math.floor(Math.random() * FirstNames.length)];
	const lastName = LastNames[Math.floor(Math.random() * LastNames.length)];
	return `${firstName} ${lastName}`;
}

export function generateEmail() {
	const firstName = FirstNames[Math.floor(Math.random() * FirstNames.length)];
	return `${firstName.toLowerCase()}@zenpay.com.au`;
}

export function validateConfigSchema(config) {
	return config && typeof config === 'object' && typeof config.apiKey === 'string' && typeof config.username === 'string' && typeof config.password === 'string' && typeof config.merchantCode === 'string';
}
