/**
 * ZenPay Payment Plugin Demo - Global Variables and Default Values
 * @module globals
 * @description Centralizes all global objects, constants, and default values for the application
 */

// ============================================================================
// EXTERNAL LIBRARY REFERENCES
// ============================================================================

/**
 * Reference to the global jQuery object
 * @type {Object}
 */
export const jQuery = window.jQuery;

/**
 * Shorthand alias for jQuery
 * @type {Function}
 */
export const $ = jQuery;

/**
 * Reference to the Bootstrap library for UI components
 * @type {Object}
 */
export const bootstrap = window.bootstrap;

/**
 * Reference to the Highlight.js library for syntax highlighting
 * @type {Object}
 */
export const hljs = window.hljs;

/**
 * SHA-3-512 hashing function
 * Falls back to a warning function if not available in the global scope
 * @function sha3_512
 * @param {string} data - Input data to hash
 * @returns {string} Hex-encoded SHA-3-512 hash or empty string if unavailable
 */
export const sha3_512 =
	typeof globalThis.sha3_512 === 'function'
		? globalThis.sha3_512.bind(globalThis)
		: // eslint-disable-next-line no-unused-vars
		  data => {
				console.warn('sha3_512 function is not defined. Ensure the library is loaded.');
				return '';
		  };

// Session Keys
/**
 * Object containing session storage keys for various form fields and settings.
 * @constant {Object}
 */
export const SESSION_KEYS = {
	// CREDS
	API_KEY: 'demoApiKey',
	USERNAME: 'demoUsername',
	PASSWORD: 'demoPassword',
	MERCHANT_CODE: 'demoMerchantCode',
	//
	PAYMENT_AMOUNT: 'demoPaymentAmount',
	// MODE
	MODE: 'demoMode',
	// URL
	SUBDOMAIN: 'demoSubdomain',
	DOMAIN: 'demoDomain',
	VERSION: 'demoVersion',
	// Extended options
	MIN_HEIGHT: 'demo_minHeight ',
	REDIRECT_URL: 'demo_redirectUrl',
	CALLBACK_URL: 'demo_callbackUrl',
	SENDEMAILCONFIRMATIONTOMERCHANT: 'demo_sendEmailConfirmationToMerchant',
	SENDEMAILCONFIRMATIONTOCUSTOMER: 'demo_sendEmailConfirmationToCustomer',
	// Payment method options
	ALLOWBANKONEOFF: 'demo_allowBankOneOff',
	ALLOWPAYTO: 'demo_allowPayTo',
	ALLOWPAYID: 'demo_allowPayID',
	ALLOWAPPLEPAY: 'demo_allowApplePay',
	ALLOWGOOGLEPAY: 'demo_allowGooglePay',
	ALLOWSAVECARDINFO: 'demo_allowSaveCardInfo',
	ALLOWLATITUDEPAY: 'demo_allowLatitudePay'
};

// ============================================================================
// DEFAULT VALUES - Organized by UI tabs
// ============================================================================
/**
 * Centralized default values for the entire application
 * @type {Object}
 */
export const DEFAULT_VALUES = {
	// Credentials tab defaults
	credentials: {
		apiKey: '', // String - left blank
		username: '', // String - left blank
		password: '', // String - left blank
		merchantCode: '', // String - left blank
		paymentAmount: '' // String - randomly generated
	},

	// Extended tab defaults
	extended: {
		redirectUrl: `${window.location.origin}/redirect`,
		callbackUrl: '', // String - left blank
		customerName: '', // String - randomly generated
		customerReference: '', // String - randomly generated UUID
		customerEmail: '', // String - generated from name
		merchantUniquePaymentId: '', // String - randomly generated UUID
		contactNumber: '0400001002' // String - default phone number
	},

	// Payment Methods tab defaults (all booleans default to false)
	paymentMethods: {
		allowBankAcOneOffPayment: false,
		allowPayToOneOffPayment: false,
		allowPayIdOneOffPayment: false,
		allowApplePayOneOffPayment: false,
		allowGooglePayOneOffPayment: false,
		allowLatitudePayOneOffPayment: false,
		allowSaveCardUserOption: false
	},

	// Options tab defaults
	options: {
		// Notification options
		sendConfirmationEmailToCustomer: false,
		sendConfirmationEmailToMerchant: false,
		// UI options
		hideTermsAndConditions: false,
		hideMerchantLogo: false,
		userMode: 0,
		overrideFeePayer: 0,
		// Tokenization options
		showFeeOnTokenising: false,
		showFailedPaymentFeeOnTokenising: false,
		// UI height options based on payment mode
		minHeight: '825'
	},

	// URL builder defaults
	url: {
		subdomain: 'payuat',
		domain: 'travelpay',
		version: 'v5'
	},

	// Special case tracked values
	special: {
		sessionTrackedPaymentAmount: '65.00'
	}
};

// ============================================================================
// PAYMENT METHOD OPTIONS
// ============================================================================

/**
 * Default payment method toggles from the Payment Methods tab
 * All default to false (disabled) until explicitly enabled by the user
 * @type {Object}
 */
export const paymentMethodsTab = {
	allowBankAcOneOffPayment: DEFAULT_VALUES.paymentMethods.allowBankAcOneOffPayment,
	allowPayToOneOffPayment: DEFAULT_VALUES.paymentMethods.allowPayToOneOffPayment,
	allowPayIdOneOffPayment: DEFAULT_VALUES.paymentMethods.allowPayIdOneOffPayment,
	allowApplePayOneOffPayment: DEFAULT_VALUES.paymentMethods.allowApplePayOneOffPayment,
	allowGooglePayOneOffPayment: DEFAULT_VALUES.paymentMethods.allowGooglePayOneOffPayment,
	allowLatitudePayOneOffPayment: DEFAULT_VALUES.paymentMethods.allowLatitudePayOneOffPayment,
	allowSaveCardUserOption: DEFAULT_VALUES.paymentMethods.allowSaveCardUserOption
};
export const paymentMethodOptions = paymentMethodsTab;
// ============================================================================
// ADDITIONAL OPTIONS
// ============================================================================

/**
 * Default additional display and behavior options from the Options tab
 * @type {Object}
 */
export const additionalOptionsTab = {
	// Notification options
	sendConfirmationEmailToCustomer: DEFAULT_VALUES.options.sendConfirmationEmailToCustomer,
	sendConfirmationEmailToMerchant: DEFAULT_VALUES.options.sendConfirmationEmailToMerchant,

	// UI options
	hideTermsAndConditions: DEFAULT_VALUES.options.hideTermsAndConditions,
	hideMerchantLogo: DEFAULT_VALUES.options.hideMerchantLogo,

	// User mode and fee payer options
	userMode: DEFAULT_VALUES.options.userMode,
	overrideFeePayer: DEFAULT_VALUES.options.overrideFeePayer,

	// Tokenization options
	showFeeOnTokenising: DEFAULT_VALUES.options.showFeeOnTokenising,
	showFailedPaymentFeeOnTokenising: DEFAULT_VALUES.options.showFailedPaymentFeeOnTokenising,
	// UI settings
	minHeight: DEFAULT_VALUES.options.minHeight
};
export const additionalOptions = additionalOptionsTab;

// ============================================================================
// CREDENTIAL VALUES
// ============================================================================

/**
 * Values from the Credentials tab
 * @type {Object}
 */
export const credentialsTab = {
	apiKey: DEFAULT_VALUES.credentials.apiKey,
	username: DEFAULT_VALUES.credentials.username,
	password: DEFAULT_VALUES.credentials.password,
	merchantCode: DEFAULT_VALUES.credentials.merchantCode,
	paymentAmount: DEFAULT_VALUES.credentials.paymentAmount
};
// ============================================================================
// EXTENDED OPTIONS
// ============================================================================

/**
 * Values from the Extended tab
 * @type {Object}
 */
export const extendedOptionsTab = {
	// URL settings
	redirectUrl: DEFAULT_VALUES.extended.redirectUrl,
	callbackUrl: DEFAULT_VALUES.extended.callbackUrl,

	// Customer information - all populated in initExtendedOptions
	customerName: DEFAULT_VALUES.extended.customerName,
	customerReference: DEFAULT_VALUES.extended.customerReference,
	customerEmail: DEFAULT_VALUES.extended.customerEmail,

	// Payment information
	merchantUniquePaymentId: DEFAULT_VALUES.extended.merchantUniquePaymentId,

	// Contact information
	contactNumber: DEFAULT_VALUES.extended.contactNumber,

	// UI settings - populated based on mode
	minHeight: ''
};
export const extendedOptions = extendedOptionsTab;
