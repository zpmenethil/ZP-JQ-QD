// fileInput.js
import { $ } from './globals.js';
import { validateConfigSchema } from './helpers.js';
import { showSuccess, showError } from './modal.js';
import { saveSessionValues } from './session.js';
import { updateCodePreview } from './codePreview.js';

/**
 * Browse & load a JSON configuration file
 */
export function initFileInputListener() {
	$('#browseConfigBtn').on('click', () => {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = '.json';

		fileInput.addEventListener('change', (e) => {
			const files = e.target.files;
			if (!files || files.length === 0) return;
			const file = files[0];
			const reader = new FileReader();

			reader.onload = (event) => {
				try {
					const config = JSON.parse(event.target.result);
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
						saveSessionValues();
						updateCodePreview();
						showSuccess(
							'Configuration Loaded',
							`Successfully loaded configuration from <strong>${file.name}</strong>`
						);
					}
				} catch (error) {
					console.error('Error parsing configuration file:', error);
					showError('Load Failed', `Failed to parse JSON: ${error.message}`);
				}
			};

			reader.readAsText(file);
		});

		fileInput.click();
	});
}
