/**
 * ZenPay Payment Plugin Demo
 *
 * This script handles the functionality for the ZenPay Payment Plugin demo,
 * including form handling, code preview generation, and plugin initialization.
 */

// Declare global variables for libraries
var jQuery = window.jQuery;
var $ = jQuery; // Assuming jQuery is used and available globally
var bootstrap = window.bootstrap; // Bootstrap JS
var hljs = typeof hljs !== 'undefined' && hljs ? hljs : {}; // Check if hljs is already defined, otherwise initialize as an empty object
var sha3_512 =
	typeof sha3_512 !== 'undefined'
		? sha3_512
		: () => {
				console.warn('sha3_512 function is not defined. Ensure the library is loaded.');
				return '';
		  };

// Blizzard character names for random generation
const blizzardFirstNames = [
	'Thrall',
	'Jaina',
	'Arthas',
	'Sylvanas',
	'Illidan',
	'Tyrande',
	'Malfurion',
	'Anduin',
	'Varian',
	'Grom',
	'Kael',
	'Uther',
	'Medivh',
	"Gul'dan",
	'Garrosh',
	"Vol'jin",
	'Valeera',
	'Rexxar',
	'Maiev',
	'Cairne',
	'Baine',
	"Lor'themar",
	'Jim',
	'Sarah',
	'Tychus',
	'Zeratul',
	'Tassadar',
	'Artanis',
	'Nova',
	'Fenix',
	'Diablo',
	'Tyrael',
	'Deckard',
	'Leoric',
	'Li-Ming',
	'Johanna',
	'Kharazim',
	'Sonya',
	'Valla',
	'Malthael'
];

const blizzardLastNames = [
	'Hellscream',
	'Proudmoore',
	'Menethil',
	'Windrunner',
	'Stormrage',
	'Whisperwind',
	'Wrynn',
	'Thassarian',
	'Thas',
	'Lightbringer',
	'Doomhammer',
	'Bloodhoof',
	'Theron',
	'Raynor',
	'Kerrigan',
	'Findlay',
	'Cain',
	'Adria',
	'Nephalem',
	'Blackthorn',
	'Kul',
	'Horadrim',
	'Darkbane',
	'Sunstrider',
	'Shadowsong',
	'Bronzebeard',
	'Wildhammer',
	'Mograine',
	'Fordragon',
	'Prestor',
	'Sanguinar',
	'Trollbane',
	'Marris',
	'Faol',
	'Ravencrest',
	'Shadowsun',
	'Executor'
];

// Store payment method options
const paymentMethodOptions = {
	allowBankAcOneOffPayment: false,
	allowPayToOneOffPayment: false,
	allowPayIdOneOffPayment: false,
	allowApplePayOneOffPayment: false,
	allowGooglePayOneOffPayment: false,
	allowLatitudePayOneOffPayment: false,
	allowSaveCardUserOption: false
};

// Store additional options
const additionalOptions = {
	hideTermsAndConditions: false,
	hideMerchantLogo: false,
	sendConfirmationEmailToCustomer: false,
	sendConfirmationEmailToMerchant: false,
	showFeeOnTokenising: false,
	showFailedPaymentFeeOnTokenising: false
};

// Store extended options
const extendedOptions = {
	redirectUrl: 'https://payuat.travelpay.com.au/demo/',
	callbackUrl: '',
	minHeight: '',
	customerName: 'Test User',
	customerReference: '',
	customerEmail: 'test@zenpay.com.au',
	merchantUniquePaymentId: '',
	contactNumber: '0400123123'
};

// Generate random payment amount between 10 and 1000 with 2 decimal places
function generateRandomPaymentAmount() {
	return (Math.random() * 990 + 10).toFixed(2);
}

$(document).ready(() => {
	// Initialize tooltips
	initTooltips();

	// Initialize payment mode tooltips
	$('.payment-mode-info').on('mouseenter', function () {
		const currentMode = $('#modeSelect').val();
		let tooltipText = '';

		switch (currentMode) {
			case '0':
				tooltipText = 'Payment mode using a static payment amount supplied via the payload, which cannot be changed after plugin initialization.';
				break;
			case '1':
				tooltipText = 'Tokenization mode, suitable for building wallets.';
				break;
			case '2':
				tooltipText = 'Dynamic payment mode, allowing the payment amount to be changed after plugin initialization.';
				break;
			case '3':
				tooltipText = 'Preauth mode for authorizing payments without immediate capture.';
				break;
			default:
				tooltipText = 'Select the payment processing mode';
		}

		$(this).attr('data-bs-original-title', tooltipText).tooltip('show');
	});

	// Update tooltip when mode changes
	$('#modeSelect').on('change', () => {
		$('.payment-mode-info').tooltip('hide');
	});

	// Initialize URL builder
	initUrlBuilder();

	// Initialize extended options
	initExtendedOptions();

	// Theme toggle functionality
	initThemeToggle();

	// Restore saved session values (if any) into the form fields
	restoreSessionValues();

	// Set default payment amount or generate a random one
	$('#paymentAmountInput').val($('#paymentAmountInput').val() || generateRandomPaymentAmount());

	// Set default minHeight based on mode
	updateMinHeightBasedOnMode();

	// Generate UUIDs if empty
	if (!$('#customerReferenceInput').val()) {
		generateAndSetUuids();
	}

	// Generate the initial code preview
	updateCodePreview();

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
	$('#uiMinHeightInput').on('input', () => {
		updateCodePreview();
	});

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

	// Initialize our placeholder fix for Credentials form
	initPlaceholderFix();
});

// Fix for placeholder visibility in Credentials form fields
function initPlaceholderFix() {
	// List of credential input fields
	const credentialFields = ['#apiKeyInput', '#usernameInput', '#passwordInput', '#merchantCodeInput', '#paymentAmountInput'];

	// Add placeholders to these fields
	$(credentialFields.join(', ')).each(function () {
		const $this = $(this);
		const placeholderText = $this.attr('placeholder') || '';

		// Store the original placeholder if not already done
		if (!$this.data('original-placeholder')) {
			$this.data('original-placeholder', placeholderText);
		}

		// Set the placeholder explicitly
		$this.attr('placeholder', $this.data('original-placeholder'));
	});
}

// Add schema validation function
function validateConfigSchema(config) {
	// Check if all required fields exist and are strings
	return config && typeof config === 'object' && typeof config.apiKey === 'string' && typeof config.username === 'string' && typeof config.password === 'string' && typeof config.merchantCode === 'string';
}

/************************************************************
 *  INITIALIZE EXTENDED OPTIONS
 ************************************************************/
function initExtendedOptions() {
	// Generate Blizzard character data
	const characterName = generateBlizzardCharacterName();
	const email = generateBlizzardEmail();
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
	$('#redirectUrlInput, #callbackUrlInput, #customerNameInput, #customerReferenceInput, #customerEmailInput, #merchantUniquePaymentIdInput, #contactNumberInput').on('input', function () {
		const id = $(this).attr('id');
		const value = $(this).val();

		// Map input IDs to extendedOptions properties
		const optionMap = {
			redirectUrlInput: 'redirectUrl',
			callbackUrlInput: 'callbackUrl',
			customerNameInput: 'customerName',
			customerReferenceInput: 'customerReference',
			customerEmailInput: 'customerEmail',
			merchantUniquePaymentIdInput: 'merchantUniquePaymentId',
			contactNumberInput: 'contactNumber'
		};

		// Update the corresponding option
		if (optionMap[id]) {
			extendedOptions[optionMap[id]] = value;
			updateCodePreview();
		}
	});

	// Update redirect URL when domain changes
	$('#domainSelect').on('change', () => {
		updateRedirectUrl();
	});

	// Initial redirect URL setup
	updateRedirectUrl();
}

// Generate and set UUIDs for customer reference and merchant unique payment ID
function generateAndSetUuids() {
	const customerReference = generateUUID();
	const merchantUniquePaymentId = generateUUID();

	$('#customerReferenceInput').val(customerReference);
	$('#merchantUniquePaymentIdInput').val(merchantUniquePaymentId);

	extendedOptions.customerReference = customerReference;
	extendedOptions.merchantUniquePaymentId = merchantUniquePaymentId;

	updateCodePreview();
}

// Update redirect URL based on selected domain
function updateRedirectUrl() {
	const domain = $('#domainSelect').val();
	const subdomain = $('input[name="subdomain"]:checked').val();
	const redirectUrl = `https://${subdomain}.${domain}.com.au/demo/`;
	const callbackUrl = `https://${subdomain}.${domain}.com.au/callback/`;

	$('#redirectUrlInput').val(redirectUrl);
	$('#callbackUrlInput').attr('placeholder', callbackUrl);
	extendedOptions.redirectUrl = redirectUrl;

	updateCodePreview();
}

/************************************************************
 *  DYNAMIC URL BUILDER
 ************************************************************/
function initUrlBuilder() {
	// Get all the URL builder elements
	const subdomainInputs = document.querySelectorAll('input[name="subdomain"]');
	const domainSelect = document.getElementById('domainSelect');
	const versionInputs = document.querySelectorAll('input[name="version"]');
	const urlPreview = document.getElementById('urlPreview');
	const modalUrlPreview = document.getElementById('modalUrlPreview');
	const modalCopyUrlBtn = document.getElementById('modalCopyUrlBtn');
	const applyUrlChangesBtn = document.getElementById('applyUrlChanges');

	// Function to update the URL preview
	function updateUrlPreview() {
		const subdomain = document.querySelector('input[name="subdomain"]:checked').value;
		const domain = domainSelect.value;
		const version = document.querySelector('input[name="version"]:checked').value;

		const url = `https://${subdomain}.${domain}.com.au/online/${version}`;
		urlPreview.value = url;

		// Also update the modal URL preview if it exists
		if (modalUrlPreview) {
			modalUrlPreview.value = url;
		}

		// Update redirect URL when domain changes
		updateRedirectUrl();

		// Update the code preview as well
		updateCodePreview();
	}

	// Add event listeners to all URL builder elements
	subdomainInputs.forEach(input => {
		input.addEventListener('change', updateUrlPreview);
	});

	domainSelect.addEventListener('change', updateUrlPreview);

	versionInputs.forEach(input => {
		input.addEventListener('change', updateUrlPreview);
	});

	// Initialize tooltips for the modal when it's shown
	$('#urlBuilderModal').on('shown.bs.modal', function () {
		$(this).find('[data-bs-toggle="tooltip"]').tooltip();
	});

	// Copy URL from modal to clipboard
	if (modalCopyUrlBtn) {
		modalCopyUrlBtn.addEventListener('click', () => {
			modalUrlPreview.select();
			document.execCommand('copy');

			// Show success feedback
			const originalIcon = modalCopyUrlBtn.innerHTML;
			modalCopyUrlBtn.innerHTML = '<i class="bi bi-check-lg"></i>';

			setTimeout(() => {
				modalCopyUrlBtn.innerHTML = originalIcon;
			}, 2000);
		});
	}

	// Apply URL changes from modal
	if (applyUrlChangesBtn) {
		applyUrlChangesBtn.addEventListener('click', () => {
			updateUrlPreview();
		});
	}

	// Initialize URL preview
	updateUrlPreview();
}

/************************************************************
 *  INITIALIZE TOOLTIPS
 ************************************************************/
function initTooltips() {
	// Initialize all tooltips
	const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	tooltipTriggerList.map(
		tooltipTriggerEl =>
			new bootstrap.Tooltip(tooltipTriggerEl, {
				trigger: 'hover focus'
			})
	);

	// Destroy and recreate tooltips when collapsible elements are shown
	$('.collapse').on('shown.bs.collapse', function () {
		// Destroy existing tooltips within the collapse
		$(this).find('[data-bs-toggle="tooltip"]').tooltip('dispose');

		// Reinitialize tooltips
		$(this).find('[data-bs-toggle="tooltip"]').tooltip();
	});
}

/************************************************************
 *  THEME TOGGLE FUNCTIONALITY
 ************************************************************/
function initThemeToggle() {
	const themeToggle = $('#themeToggle');
	const lightIcon = $('#lightIcon');
	const darkIcon = $('#darkIcon');
	const storedTheme = localStorage.getItem('theme') || 'light';

	// Set initial theme
	if (storedTheme === 'dark') {
		document.documentElement.setAttribute('data-bs-theme', 'dark');
		lightIcon.addClass('d-none');
		darkIcon.removeClass('d-none');
	}

	themeToggle.on('click', () => {
		const currentTheme = document.documentElement.getAttribute('data-bs-theme');
		const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

		document.documentElement.setAttribute('data-bs-theme', newTheme);
		localStorage.setItem('theme', newTheme);

		if (newTheme === 'dark') {
			lightIcon.addClass('d-none');
			darkIcon.removeClass('d-none');
		} else {
			darkIcon.addClass('d-none');
			lightIcon.removeClass('d-none');
		}

		// Re-highlight code with new theme
		hljs.highlightElement(document.getElementById('codePreview'));

		// Destroy and recreate tooltips for proper styling
		$('[data-bs-toggle="tooltip"]').tooltip('dispose');
		initTooltips();
	});
}

/************************************************************
 *  RESTORE & SAVE CREDENTIALS in sessionStorage
 ************************************************************/
function restoreSessionValues() {
	// If sessionStorage is empty (or not used yet), these will be empty strings
	$('#apiKeyInput').val(sessionStorage.getItem('demoApiKey') || '');
	$('#usernameInput').val(sessionStorage.getItem('demoUsername') || '');
	$('#passwordInput').val(sessionStorage.getItem('demoPassword') || '');
	$('#merchantCodeInput').val(sessionStorage.getItem('demoMerchantCode') || '');
	$('#paymentAmountInput').val(sessionStorage.getItem('demoPaymentAmount') || '');
	$('#modeSelect').val(sessionStorage.getItem('demoMode') || '0');

	// Check if mode is 1 to show tokenization options
	if ($('#modeSelect').val() === '1') {
		$('#tokenizationOptions').removeClass('d-none');
	}

	// Restore payment method options
	for (const option in paymentMethodOptions) {
		const savedValue = sessionStorage.getItem(`demo_${option}`);
		if (savedValue === 'true') {
			paymentMethodOptions[option] = true;
			$(`#${option}`).prop('checked', true);
		}
	}

	// Restore additional options
	for (const option in additionalOptions) {
		const savedValue = sessionStorage.getItem(`demo_${option}`);
		if (savedValue === 'true') {
			additionalOptions[option] = true;
			$(`#${option}`).prop('checked', true);
		}
	}

	// Restore extended option values
	$('#redirectUrlInput').val(sessionStorage.getItem('demo_redirectUrl') || extendedOptions.redirectUrl);
	$('#callbackUrlInput').val(sessionStorage.getItem('demo_callbackUrl') || '');
	$('#minHeightInput').val(sessionStorage.getItem('demo_minHeight') || '');
	$('#customerNameInput').val(sessionStorage.getItem('demo_customerName') || extendedOptions.customerName);
	$('#customerReferenceInput').val(sessionStorage.getItem('demo_customerReference') || '');
	$('#customerEmailInput').val(sessionStorage.getItem('demo_customerEmail') || extendedOptions.customerEmail);
	$('#merchantUniquePaymentIdInput').val(sessionStorage.getItem('demo_merchantUniquePaymentId') || '');
	$('#contactNumberInput').val(sessionStorage.getItem('demo_contactNumber') || extendedOptions.contactNumber);

	// Restore URL builder settings
	const savedSubdomain = sessionStorage.getItem('demoSubdomain');
	if (savedSubdomain) {
		$(`input[name="subdomain"][value="${savedSubdomain}"]`).prop('checked', true);
	}

	const savedDomain = sessionStorage.getItem('demoDomain');
	if (savedDomain) {
		$('#domainSelect').val(savedDomain);
	}

	const savedVersion = sessionStorage.getItem('demoVersion');
	if (savedVersion) {
		$(`input[name="version"][value="${savedVersion}"]`).prop('checked', true);
	}

	// Update extended options object with restored values
	extendedOptions.redirectUrl = $('#redirectUrlInput').val();
	extendedOptions.callbackUrl = $('#callbackUrlInput').val();
	extendedOptions.minHeight = $('#minHeightInput').val();
	extendedOptions.customerName = $('#customerNameInput').val();
	extendedOptions.customerReference = $('#customerReferenceInput').val();
	extendedOptions.customerEmail = $('#customerEmailInput').val();
	extendedOptions.merchantUniquePaymentId = $('#merchantUniquePaymentIdInput').val();
	extendedOptions.contactNumber = $('#contactNumberInput').val();

	// Restore UI minHeight value
	$('#uiMinHeightInput').val(sessionStorage.getItem('demo_uiMinHeight') || '');

	// If customer name, email, or contact number are empty, generate new ones
	if (!$('#customerNameInput').val()) {
		const characterName = generateBlizzardCharacterName();
		$('#customerNameInput').val(characterName);
		extendedOptions.customerName = characterName;
	}

	if (!$('#customerEmailInput').val()) {
		const email = generateBlizzardEmail();
		$('#customerEmailInput').val(email);
		extendedOptions.customerEmail = email;
	}

	if (!$('#contactNumberInput').val()) {
		$('#contactNumberInput').val('0400000000');
		extendedOptions.contactNumber = '0400000000';
	}
}

// Save all form fields to session storage
function saveSessionValues() {
	sessionStorage.setItem('demoApiKey', $('#apiKeyInput').val().trim());
	sessionStorage.setItem('demoUsername', $('#usernameInput').val().trim());
	sessionStorage.setItem('demoPassword', $('#passwordInput').val().trim());
	sessionStorage.setItem('demoMerchantCode', $('#merchantCodeInput').val().trim());
	sessionStorage.setItem('demoPaymentAmount', $('#paymentAmountInput').val().trim());
	sessionStorage.setItem('demoMode', $('#modeSelect').val());

	// Save payment method options
	for (const option in paymentMethodOptions) {
		sessionStorage.setItem(`demo_${option}`, paymentMethodOptions[option]);
	}

	// Save additional options
	for (const option in additionalOptions) {
		sessionStorage.setItem(`demo_${option}`, additionalOptions[option]);
	}

	// Save extended options
	sessionStorage.setItem('demo_redirectUrl', extendedOptions.redirectUrl);
	sessionStorage.setItem('demo_callbackUrl', extendedOptions.callbackUrl);
	sessionStorage.setItem('demo_minHeight', extendedOptions.minHeight);
	sessionStorage.setItem('demo_customerName', extendedOptions.customerName);
	sessionStorage.setItem('demo_customerReference', extendedOptions.customerReference);
	sessionStorage.setItem('demo_customerEmail', extendedOptions.customerEmail);
	sessionStorage.setItem('demo_merchantUniquePaymentId', extendedOptions.merchantUniquePaymentId);
	sessionStorage.setItem('demo_contactNumber', extendedOptions.contactNumber);

	// Save UI minHeight
	sessionStorage.setItem('demo_uiMinHeight', $('#uiMinHeightInput').val());

	// Save URL builder settings
	sessionStorage.setItem('demoSubdomain', $('input[name="subdomain"]:checked').val());
	sessionStorage.setItem('demoDomain', $('#domainSelect').val());
	sessionStorage.setItem('demoVersion', $('input[name="version"]:checked').val());
}

/************************************************************
 *  HELPER FUNCTIONS
 ************************************************************/
function generateCurrentDatetime() {
	return new Date().toISOString().slice(0, 19);
}

function generateUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

function createSHA3Hash(apiKey, username, password, mode, hashAmount, merchantUniquePaymentId, timestamp) {
	const data = [apiKey, username, password, mode, hashAmount, merchantUniquePaymentId, timestamp].join('|');
	return sha3_512(data);
}

/************************************************************
 *  BLIZZARD CHARACTER GENERATION
 ************************************************************/
function generateBlizzardCharacterName() {
	const firstName = blizzardFirstNames[Math.floor(Math.random() * blizzardFirstNames.length)];
	const lastName = blizzardLastNames[Math.floor(Math.random() * blizzardLastNames.length)];
	return `${firstName} ${lastName}`;
}

function generateBlizzardEmail() {
	const firstName = blizzardFirstNames[Math.floor(Math.random() * blizzardFirstNames.length)];
	return `${firstName.toLowerCase()}@zenpay.com.au`;
}

function buildCodeSnippet({ apiKey, username, password, merchantCode, paymentAmount, mode, timestamp, merchantUniquePaymentId, customerReference, fingerprint }) {
	// Get the URL from the URL preview
	const url = document.getElementById('urlPreview').value;

	// Start with the basic configuration
	let snippet = `
var payment = $.zpPayment({
  url: "${url}",
  merchantCode: "${merchantCode}",
  apiKey: "${apiKey}",
  fingerprint: "${fingerprint}",`;

	// Add redirect URL
	snippet += `
  redirectUrl: "${extendedOptions.redirectUrl}",`;

	// Add callback URL if provided
	if (extendedOptions.callbackUrl) {
		snippet += `
  callbackUrl: "${extendedOptions.callbackUrl}",`;
	}

	// Add minHeight from UI Options tab
	const minHeight = $('#uiMinHeightInput').val();
	if (minHeight) {
		snippet += `
  minHeight: ${minHeight},`;
	}

	// Add other required fields
	snippet += `
  mode: ${mode},
  merchantUniquePaymentId: "${extendedOptions.merchantUniquePaymentId || merchantUniquePaymentId}",
  customerName: "${extendedOptions.customerName}",
  contactNumber: "${extendedOptions.contactNumber}",
  customerEmail: "${extendedOptions.customerEmail}",
  customerReference: "${extendedOptions.customerReference || customerReference}",
  paymentAmount: ${paymentAmount},
  timeStamp: "${timestamp}"`;

	// Add payment method options if they're enabled
	for (const option in paymentMethodOptions) {
		if (paymentMethodOptions[option]) {
			snippet += `,
  ${option}: true`;
		}
	}

	// Add additional options if they're enabled
	for (const option in additionalOptions) {
		// Only include tokenization options if mode is 1
		if (option === 'showFeeOnTokenising' || option === 'showFailedPaymentFeeOnTokenising') {
			if (mode === '1' && additionalOptions[option]) {
				snippet += `,
  ${option}: true`;
			}
		} else if (additionalOptions[option]) {
			snippet += `,
  ${option}: true`;
		}
	}

	// Close the configuration object
	snippet += `
});

payment.open();`;

	return snippet.trim();
}

/************************************************************
 *  UPDATE CODE PREVIEW
 ************************************************************/
function updateCodePreview() {
	const timestamp = generateCurrentDatetime();
	const merchantUniquePaymentId = extendedOptions.merchantUniquePaymentId || generateUUID();
	const customerReference = extendedOptions.customerReference || generateUUID();
	const apiKey = $('#apiKeyInput').val().trim();
	const username = $('#usernameInput').val().trim();
	const password = $('#passwordInput').val().trim();
	const merchantCode = $('#merchantCodeInput').val().trim();

	const inputPaymentAmount = Number.parseFloat($('#paymentAmountInput').val()) || 0.0;
	const paymentAmount = +inputPaymentAmount.toFixed(2);

	const selectedMode = $('#modeSelect').val();

	// For the fingerprint process, if Mode 2 is selected, use 0 as the payment amount.
	const fingerprintPaymentAmount = selectedMode === '2' ? 0 : paymentAmount;
	const hashAmount = Math.round(fingerprintPaymentAmount * 100);

	const fingerprint = createSHA3Hash(apiKey, username, password, selectedMode, hashAmount, merchantUniquePaymentId, timestamp);

	const snippet = buildCodeSnippet({
		apiKey,
		username,
		password,
		merchantCode,
		paymentAmount,
		mode: selectedMode,
		timestamp,
		merchantUniquePaymentId,
		customerReference,
		fingerprint
	});

	const codeBlock = document.getElementById('codePreview');
	codeBlock.textContent = snippet;
	hljs.highlightElement(codeBlock);
}

/************************************************************
 *  PLUGIN INITIALIZATION
 ************************************************************/
function initializeZenPayPlugin() {
	try {
		saveSessionValues(); // Demo only.

		const timestamp = generateCurrentDatetime();
		const merchantUniquePaymentId = extendedOptions.merchantUniquePaymentId || generateUUID();
		const customerReference = extendedOptions.customerReference || generateUUID();
		const apiKey = $('#apiKeyInput').val().trim();
		const username = $('#usernameInput').val().trim();
		const password = $('#passwordInput').val().trim();
		const merchantCode = $('#merchantCodeInput').val().trim();
		const url = document.getElementById('urlPreview').value;

		const inputPaymentAmount = Number.parseFloat($('#paymentAmountInput').val()) || 0.0;
		const paymentAmount = +inputPaymentAmount.toFixed(2);

		const selectedMode = $('#modeSelect').val();

		// For the fingerprint process, if Mode 2 is selected, use 0 as the payment amount for fingerprinting.
		const fingerprintPaymentAmount = selectedMode === '2' ? 0 : paymentAmount;
		const hashAmount = Math.round(fingerprintPaymentAmount * 100);

		const fingerprint = createSHA3Hash(apiKey, username, password, selectedMode, hashAmount, merchantUniquePaymentId, timestamp);

		// Initialize plugin with base configuration
		const paymentConfig = {
			url: url,
			merchantCode: merchantCode,
			apiKey: apiKey,
			fingerprint: fingerprint,
			timeStamp: timestamp,
			paymentAmount: paymentAmount,
			mode: Number.parseInt(selectedMode, 10),
			redirectUrl: extendedOptions.redirectUrl,
			merchantUniquePaymentId: merchantUniquePaymentId,
			customerName: extendedOptions.customerName,
			contactNumber: extendedOptions.contactNumber,
			customerEmail: extendedOptions.customerEmail,
			customerReference: customerReference
		};

		// Add callback URL if provided
		if (extendedOptions.callbackUrl) {
			paymentConfig.callbackUrl = extendedOptions.callbackUrl;
		}

		// Add minHeight from UI Options tab
		const minHeight = $('#uiMinHeightInput').val();
		if (minHeight) {
			paymentConfig.minHeight = Number.parseInt(minHeight, 10);
		}

		// Add payment method options if they're enabled
		for (const option in paymentMethodOptions) {
			if (paymentMethodOptions[option]) {
				paymentConfig[option] = true;
			}
		}

		// Add additional options if they're enabled
		for (const option in additionalOptions) {
			// Only include tokenization options if mode is 1
			if (option === 'showFeeOnTokenising' || option === 'showFailedPaymentFeeOnTokenising') {
				if (selectedMode === '1' && additionalOptions[option]) {
					paymentConfig[option] = true;
				}
			} else if (additionalOptions[option]) {
				paymentConfig[option] = true;
			}
		}

		const payment = $.zpPayment(paymentConfig);

		console.log('Payment object initialized with payload:', payment.options);
		payment.open();
	} catch (err) {
		console.error('Error initializing plugin:', err);
		alert('Unable to initialize plugin. See console for details.');
	}
}

/************************************************************
 *  COPY SNIPPET TO CLIPBOARD
 ************************************************************/
function copyCodeToClipboard() {
	const codeText = $('#codePreview').text();
	navigator.clipboard
		.writeText(codeText)
		.then(() => {
			// Show success feedback
			const copyBtn = $('#copyCodeBtn');
			const originalIcon = copyBtn.html();
			copyBtn.html('<i class="bi bi-check-lg"></i>');

			setTimeout(() => {
				copyBtn.html(originalIcon);
			}, 2000);
		})
		.catch(err => {
			console.error('Failed to copy code:', err);
			alert('Failed to copy code. Please try again.');
		});
}

function updateMinHeightBasedOnMode() {
	const mode = $('#modeSelect').val();
	const defaultHeight = mode === '1' ? '600' : '825';

	// Only set if user hasn't manually changed it
	if (!$('#uiMinHeightInput').val()) {
		$('#uiMinHeightInput').val(defaultHeight);
		extendedOptions.minHeight = defaultHeight;
	}
}

//
/**
 * Enhanced placeholder handling to ensure consistent styling with real values
 * This function modifies input fields to treat placeholders visually like actual values
 */
function enhancePlaceholderConsistency() {
	// Target all form-floating inputs that should have consistent placeholder behavior
	const inputSelectors = [
		'#apiKeyInput',
		'#usernameInput',
		'#passwordInput',
		'#merchantCodeInput',
		'#paymentAmountInput',
		'#redirectUrlInput',
		'#callbackUrlInput',
		'#customerNameInput',
		'#contactNumberInput',
		'#customerEmailInput',
		'#customerReferenceInput',
		'#merchantUniquePaymentIdInput',
		'#uiMinHeightInput'
	];

	$(inputSelectors.join(', ')).each(function () {
		const $input = $(this);
		const originalPlaceholder = $input.attr('placeholder');

		if (!originalPlaceholder) return; // Skip if no placeholder

		// Store original placeholder
		$input.data('original-placeholder', originalPlaceholder);

		// When the input field has no value, add the has-placeholder class and show placeholder
		function updatePlaceholderState() {
			if (!$input.val()) {
				$input.addClass('has-placeholder');
				$input.attr('placeholder', $input.data('original-placeholder'));
			} else {
				$input.removeClass('has-placeholder');
				// Keep placeholder empty when value exists to avoid confusion
				$input.attr('placeholder', '');
			}
		}

		// Initial state
		updatePlaceholderState();

		// Update on value change
		$input.on('input change blur', updatePlaceholderState);

		// Special handling for focus - keep the has-placeholder class but update text
		$input.on('focus', function () {
			if (!$input.val()) {
				$input.addClass('has-placeholder');
				$input.attr('placeholder', $input.data('original-placeholder'));
			}
		});
	});
}

// consistent-placeholders.js
$(document).ready(function () {
	// Add placeholder-as-value class to any input with a placeholder to make it look like it has a value
	function setupPlaceholderStyling() {
		$('.form-floating input[placeholder], .form-floating textarea[placeholder]').each(function () {
			const $input = $(this);
			const originalPlaceholder = $input.attr('placeholder');

			if (!originalPlaceholder) return;

			// Function to update the class based on value state
			function updatePlaceholderState() {
				if (!$input.val()) {
					$input.addClass('placeholder-as-value');
				} else {
					$input.removeClass('placeholder-as-value');
				}
			}

			// Set initial state
			updatePlaceholderState();

			// Update on input events
			$input.on('input change blur', updatePlaceholderState);
		});
	}

	// Call the function on document ready
	setupPlaceholderStyling();

	// Also call whenever there might be dynamically loaded content
	$(document).on('valueLoaded formReset', setupPlaceholderStyling);
});
