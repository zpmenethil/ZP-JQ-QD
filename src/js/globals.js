/**
 * ZenPay Payment Plugin Demo - Global Variables
 */

// Core library references
export const jQuery = window.jQuery;
export const $ = jQuery;
export const bootstrap = window.bootstrap;
export const hljs = window.hljs;
export const sha3_512 =
	typeof globalThis.sha3_512 === 'function'
		? globalThis.sha3_512.bind(globalThis)
		: // eslint-disable-next-line no-unused-vars
			(data) => {
				console.warn('sha3_512 function is not defined. Ensure the library is loaded.');
				return '';
			};

export const paymentMethodOptions = {
	allowBankAcOneOffPayment: false,
	allowPayToOneOffPayment: false,
	allowPayIdOneOffPayment: false,
	allowApplePayOneOffPayment: false,
	allowGooglePayOneOffPayment: false,
	allowLatitudePayOneOffPayment: false,
	allowSaveCardUserOption: false,
};

export const additionalOptions = {
	hideTermsAndConditions: false,
	hideMerchantLogo: false,
	sendConfirmationEmailToCustomer: false,
	sendConfirmationEmailToMerchant: false,
	showFeeOnTokenising: false,
	showFailedPaymentFeeOnTokenising: false,
};
