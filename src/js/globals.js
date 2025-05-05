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
		: data => {
				console.warn('sha3_512 function is not defined. Ensure the library is loaded.');
				return '';
		  };

export const FirstNames = [
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

export const LastNames = [
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

export const paymentMethodOptions = {
	allowBankAcOneOffPayment: false,
	allowPayToOneOffPayment: false,
	allowPayIdOneOffPayment: false,
	allowApplePayOneOffPayment: false,
	allowGooglePayOneOffPayment: false,
	allowLatitudePayOneOffPayment: false,
	allowSaveCardUserOption: false
};

export const additionalOptions = {
	hideTermsAndConditions: false,
	hideMerchantLogo: false,
	sendConfirmationEmailToCustomer: false,
	sendConfirmationEmailToMerchant: false,
	showFeeOnTokenising: false,
	showFailedPaymentFeeOnTokenising: false
};
