/**
 * @jest-environment jsdom
 */

const selectorValueMap = {};

jest.mock('./globals.js', () => {
	const $ = jest.fn((selector) => ({
		val: jest.fn().mockReturnValue(selectorValueMap[selector] || ''),
	}));
	const payment = { open: jest.fn(), options: {} };
	$.zpPayment = jest.fn().mockReturnValue(payment);
	const paymentMethodOptions = {};
	const additionalOptions = {};
	return { $, paymentMethodOptions, additionalOptions };
});

jest.mock('./helpers.js', () => ({
	generateCurrentDatetime: jest.fn().mockReturnValue('2025-05-06T12:00:00'),
	createSHA3_512Hash: jest.fn().mockReturnValue('fakehash'),
}));

jest.mock('./extendedOptions.js', () => ({
	extendedOptions: {
		redirectUrl: '',
		callbackUrl: '',
		minHeight: '',
		customerName: '',
		customerReference: '',
		customerEmail: '',
		merchantUniquePaymentId: '',
		contactNumber: '',
	},
}));

jest.mock('./session.js', () => ({
	saveSessionValues: jest.fn(),
}));

const { $, paymentMethodOptions, additionalOptions } = require('./globals.js');
const { generateCurrentDatetime, createSHA3_512Hash } = require('./helpers.js');
const { extendedOptions } = require('./extendedOptions.js');
const { saveSessionValues } = require('./session.js');

let initializeZenPayPlugin;

beforeEach(() => {
	jest.resetModules();
	// clear selector map
	for (const k of Object.keys(selectorValueMap)) delete selectorValueMap[k];
	// reset options
	for (const k of Object.keys(paymentMethodOptions)) delete paymentMethodOptions[k];
	for (const k of Object.keys(additionalOptions)) delete additionalOptions[k];
	// reset extendedOptions
	for (const k of Object.keys(extendedOptions)) extendedOptions[k] = '';
});

describe('initializeZenPayPlugin', () => {
	const setInputs = (vals) => Object.assign(selectorValueMap, vals);

	const loadPlugin = () => {
		initializeZenPayPlugin = require('./initializeZenPayPlugin.js').initializeZenPayPlugin;
		initializeZenPayPlugin();
	};

	it('creates fingerprint and initializes payment when all fields present', () => {
		extendedOptions.merchantUniquePaymentId = 'mid';
		extendedOptions.customerReference = 'cref';
		setInputs({
			'#apiKeyInput': 'key',
			'#usernameInput': 'user',
			'#passwordInput': 'pass',
			'#merchantCodeInput': 'MC',
			'#urlPreview': 'https://pay.test',
			'#paymentAmountInput': '12.34',
			'#modeSelect': '0',
			'#uiMinHeightInput': '',
		});
		loadPlugin();

		expect(generateCurrentDatetime).toHaveBeenCalled();
		expect(createSHA3_512Hash).toHaveBeenCalledWith(
			'key',
			'user',
			'pass',
			'0',
			Math.round(12.34 * 100),
			'mid',
			'2025-05-06T12:00:00'
		);
		const payment = $.zpPayment.mock.results[0].value;
		expect($.zpPayment).toHaveBeenCalledWith(
			expect.objectContaining({
				apiKey: 'key',
				merchantCode: 'MC',
				fingerprint: 'fakehash',
				timeStamp: '2025-05-06T12:00:00',
				paymentAmount: '12.34',
				mode: '0',
				redirectUrl: '',
				merchantUniquePaymentId: 'mid',
				customerReference: 'cref',
				url: 'https://pay.test',
			})
		);
		expect(payment.open).toHaveBeenCalled();
		expect(saveSessionValues).toHaveBeenCalled();
	});

	it('skips fingerprint when mode is 2 (hashAmount=0)', () => {
		extendedOptions.merchantUniquePaymentId = 'mid';
		extendedOptions.customerReference = 'cref';
		setInputs({
			'#apiKeyInput': 'key',
			'#usernameInput': 'user',
			'#passwordInput': 'pass',
			'#merchantCodeInput': 'MC',
			'#urlPreview': 'https://pay.test',
			'#paymentAmountInput': '50.00',
			'#modeSelect': '2',
			'#uiMinHeightInput': '',
		});
		loadPlugin();

		expect(createSHA3_512Hash).not.toHaveBeenCalled();
		const config = $.zpPayment.mock.calls[0][0];
		expect(config.fingerprint).toBe('');
	});

	it('includes callbackUrl when provided', () => {
		extendedOptions.callbackUrl = 'https://cb.test';
		extendedOptions.merchantUniquePaymentId = 'mid';
		extendedOptions.customerReference = 'cref';
		setInputs({
			'#apiKeyInput': 'key',
			'#usernameInput': 'user',
			'#passwordInput': 'pass',
			'#merchantCodeInput': 'MC',
			'#urlPreview': 'https://pay.test',
			'#paymentAmountInput': '10',
			'#modeSelect': '0',
			'#uiMinHeightInput': '',
		});
		loadPlugin();

		const config = $.zpPayment.mock.calls[0][0];
		expect(config.callbackUrl).toBe('https://cb.test');
	});

	it('parses minHeight when provided', () => {
		extendedOptions.merchantUniquePaymentId = 'mid';
		extendedOptions.customerReference = 'cref';
		setInputs({
			'#apiKeyInput': 'key',
			'#usernameInput': 'user',
			'#passwordInput': 'pass',
			'#merchantCodeInput': 'MC',
			'#urlPreview': 'https://pay.test',
			'#paymentAmountInput': '20',
			'#modeSelect': '0',
			'#uiMinHeightInput': '300',
		});
		loadPlugin();

		const config = $.zpPayment.mock.calls[0][0];
		expect(config.minHeight).toBe(300);
	});

	it('includes payment and additional options when enabled', () => {
		extendedOptions.merchantUniquePaymentId = 'mid';
		extendedOptions.customerReference = 'cref';
		paymentMethodOptions.allowBankAcOneOffPayment = true;
		additionalOptions.hideTermsAndConditions = true;
		additionalOptions.showFeeOnTokenising = true;
		setInputs({
			'#apiKeyInput': 'key',
			'#usernameInput': 'user',
			'#passwordInput': 'pass',
			'#merchantCodeInput': 'MC',
			'#urlPreview': 'u',
			'#paymentAmountInput': '5',
			'#modeSelect': '1',
			'#uiMinHeightInput': '',
		});
		loadPlugin();

		const config = $.zpPayment.mock.calls[0][0];
		expect(config.allowBankAcOneOffPayment).toBe(true);
		expect(config.hideTermsAndConditions).toBe(true);
		expect(config.showFeeOnTokenising).toBe(true);
	});
});
