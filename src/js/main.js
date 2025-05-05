// Import all module dependencies
import { $, paymentMethodOptions, additionalOptions } from './globals.js';
import { generateRandomPaymentAmount, validateConfigSchema, generateUUID } from './helpers.js';
import { initTooltips, initPaymentModeTooltips } from './tooltips.js';
import { initThemeToggle } from './theme.js';
import { initUrlBuilder } from './urlBuilder.js';
import { initExtendedOptions, generateAndSetUuids } from './extendedOptions.js';
import { initPlaceholderFix, setupPlaceholderStyling } from './placeholders.js';
import { restoreSessionValues, saveSessionValues, setupSessionListeners } from './session.js';
import { updateCodePreview, copyCodeToClipboard, updateMinHeightBasedOnMode } from './codePreview.js';
import { initializeZenPayPlugin } from './pluginInit.js';

$(document).ready(() => {
	initTooltips();
	initPaymentModeTooltips();
	initThemeToggle();
	initUrlBuilder();
	initExtendedOptions();
	initPlaceholderFix();
	setupPlaceholderStyling();
	restoreSessionValues();
	setupSessionListeners();
	$('#paymentAmountInput').val($('#paymentAmountInput').val() || generateRandomPaymentAmount());
	updateMinHeightBasedOnMode();
	if (!$('#customerReferenceInput').val()) {
		generateAndSetUuids();
	}

	// Generate the initial code preview
	updateCodePreview();

	// Event Listeners

	// Update preview whenever form inputs or mode changes
	$('#apiKeyInput, #usernameInput, #passwordInput, #merchantCodeInput, #paymentAmountInput, #modeSelect').on('input change', updateCodePreview);

	// Handle payment method toggles
	$('.payment-method-toggle').on('change', function () {
		const option = $(this).data('option');
		paymentMethodOptions[option] = $(this).prop('checked');
		// Save to session storage immediately
		sessionStorage.setItem(`demo_${option}`, paymentMethodOptions[option]);
		updateCodePreview();
	});

	// Handle additional option toggles
	$('.option-toggle').on('change', function () {
		const option = $(this).data('option');
		additionalOptions[option] = $(this).prop('checked');
		updateCodePreview();
	});

	// Handle minHeight input in UI Options
	$('#uiMinHeightInput').on('input', updateCodePreview);

	// Show/hide tokenization options based on mode
	$('#modeSelect').on('change', function () {
		const mode = $(this).val();
		if (mode === '1') {
			$('#tokenizationOptions').removeClass('d-none');
		} else {
			$('#tokenizationOptions').addClass('d-none');
		}
		updateMinHeightBasedOnMode();
		updateCodePreview();
	});

	// Click to initialize plugin
	$('#initializePlugin').on('click', initializeZenPayPlugin);

	// Copy to clipboard icon
	$('#copyCodeBtn').on('click', copyCodeToClipboard);

	// Browse configuration button
	$('#browseConfigBtn').on('click', () => {
		// Create a file input element
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = '.json';

		// Handle file selection
		fileInput.addEventListener('change', e => {
			if (e.target.files.length > 0) {
				const file = e.target.files[0];
				const reader = new FileReader();

				reader.onload = event => {
					try {
						const config = JSON.parse(event.target.result);

						// Validate schema
						if (!validateConfigSchema(config)) {
							alert('Invalid configuration file format. Please ensure it contains apiKey, username, password, and merchantCode.');
							return;
						}

						// Populate form with config values
						if (config.apiKey) $('#apiKeyInput').val(config.apiKey);
						if (config.username) $('#usernameInput').val(config.username);
						if (config.password) $('#passwordInput').val(config.password);
						if (config.merchantCode) $('#merchantCodeInput').val(config.merchantCode);

						// Save to session storage
						saveSessionValues();

						// Update code preview
						updateCodePreview();

						// Show success message
						alert('Configuration loaded successfully!');
					} catch (error) {
						console.error('Error parsing configuration file:', error);
						alert('Failed to load configuration. Invalid file format.');
					}
				};

				reader.readAsText(file);
			}
		});

		// Trigger click on the file input
		fileInput.click();
	});

	// Add tooltips to payment mode options
	$('#modeSelect option').each(function () {
		const tooltipText = $(this).data('tooltip');
		if (tooltipText) {
			$(this).attr('title', tooltipText);
		}
	});
});
