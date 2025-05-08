/**
 * @module fileInput
 * @description Handles browsing and loading of JSON configuration files for the ZenPay demo plugin.
 */

import { $ } from './globals.js';
import { showSuccess, showError } from './modal.js';
import { saveToSession } from './session.js';
import { updateCodePreview } from './codePreview.js';
import { SESSION_KEYS } from './globals.js';
import { updateActionButtonsState } from './initListeners.js';
/**
 * Save only credential fields to session storage.
 * @returns {void}
 */
function saveCredsToSession() {
	saveToSession(SESSION_KEYS.API_KEY, $('#apiKeyInput').val().trim());
	saveToSession(SESSION_KEYS.USERNAME, $('#usernameInput').val().trim());
	saveToSession(SESSION_KEYS.PASSWORD, $('#passwordInput').val().trim());
	saveToSession(SESSION_KEYS.MERCHANT_CODE, $('#merchantCodeInput').val().trim());
}

/**
 * Initialize file input listener on the "Browse Configuration" button.
 * Opens a file picker for `.json` files, validates the loaded configuration,
 * populates the corresponding input fields, saves session values, updates the code preview,
 * and displays a success or error modal.
 * @returns {void}
 */
export function initFileInputListener() {
	$('#browseConfigBtn').on('click', () => {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = '.json';

		/**
		 * Handle file selection event, read and process the JSON configuration.
		 * @param {Event} e - The change event from the file input.
		 */
		fileInput.addEventListener('change', (e) => {
			const files = /** @type {FileList} */ (e.target.files);
			if (!files || files.length === 0) return;
			const file = files[0];
			const reader = new FileReader();

			/**
			 * Handle file read completion, parse and apply configuration.
			 * @param {ProgressEvent<FileReader>} event - The load event containing file contents.
			 */
			reader.onload = (event) => {
				try {
					const text = event.target.result;
					const config = JSON.parse(text);

					if (!validateConfigSchema(config)) {
						showError(
							'Invalid Configuration',
							'Configuration must include non-empty string values for: apiKey, username, password, and merchantCode.'
						);
						return;
					}

					const apiKeyField = $('#apiKeyInput');
					const usernameField = $('#usernameInput');
					const passwordField = $('#passwordInput');
					const merchantField = $('#merchantCodeInput');

					if (apiKeyField.length) apiKeyField.val(config.apiKey);
					if (usernameField.length) usernameField.val(config.username);
					if (passwordField.length) passwordField.val(config.password);
					if (merchantField.length) merchantField.val(config.merchantCode);

					if (
						apiKeyField.length &&
						usernameField.length &&
						passwordField.length &&
						merchantField.length
					) {
						saveCredsToSession();
						updateCodePreview();

						updateActionButtonsState();
						showSuccess(
							'Configuration Loaded',
							`Successfully loaded configuration from <strong>${file.name}</strong>`,
							'success',
							3000
						);
					}
				} catch (error) {
					showError('Load Failed', `Failed to parse JSON: ${error.message}`);
				}
			};

			reader.readAsText(file);
		});

		fileInput.click();
	});
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
