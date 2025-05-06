// Import jQuery
import { jQuery, $ } from '../src/js/globals.js';

const TestSuite = {
	// Test globals.js
	testGlobals() {
		console.group('Testing globals.js');
		console.assert(window.jQuery, 'jQuery is available');
		console.assert(window.bootstrap, 'Bootstrap is available');
		console.assert(window.hljs, 'Highlight.js is available');
		console.groupEnd();
	},

	// Test helpers.js functions
	testHelpers() {
		console.group('Testing helpers.js');
		console.assert(
			typeof generateRandomPaymentAmount === 'function',
			'generateRandomPaymentAmount exists'
		);
		console.assert(typeof generateUUID === 'function', 'generateUUID exists');
		console.assert(typeof createSHA3Hash === 'function', 'createSHA3Hash exists');
		console.groupEnd();
	},

	// Test session storage
	testSession() {
		console.group('Testing session.js');
		// Test saving to session
		sessionStorage.setItem('test_key', 'test_value');
		console.assert(sessionStorage.getItem('test_key') === 'test_value', 'Session storage works');
		console.groupEnd();
	},

	// Test placeholders
	testPlaceholders() {
		console.group('Testing placeholders.js');
		const hasPlaceholder = $('#apiKeyInput').attr('placeholder');
		console.assert(hasPlaceholder, 'Placeholders are set');
		console.groupEnd();
	},

	// Test tooltips
	testTooltips() {
		console.group('Testing tooltips.js');
		const hasTooltip = $('[data-bs-toggle="tooltip"]').length > 0;
		console.assert(hasTooltip, 'Tooltips are initialized');
		console.groupEnd();
	},

	// Test theme toggling
	testTheme() {
		console.group('Testing theme.js');
		const currentTheme = document.documentElement.getAttribute('data-bs-theme');
		console.assert(currentTheme === 'light' || currentTheme === 'dark', 'Theme is set');
		console.groupEnd();
	},

	// Test URL builder
	testUrlBuilder() {
		console.group('Testing urlBuilder.js');
		const hasUrlPreview = $('#urlPreview').length > 0;
		console.assert(hasUrlPreview, 'URL preview element exists');
		console.groupEnd();
	},

	// Test extended options
	testExtendedOptions() {
		console.group('Testing extendedOptions.js');
		console.assert(typeof window.extendedOptions === 'object', 'Extended options object exists');
		console.assert(
			window.extendedOptions.hasOwnProperty('redirectUrl'),
			'Extended options has redirectUrl'
		);
		console.groupEnd();
	},

	// Test code preview
	testCodePreview() {
		console.group('Testing codePreview.js');
		const hasCodePreview = $('#codePreview').length > 0;
		console.assert(hasCodePreview, 'Code preview element exists');
		console.groupEnd();
	},

	// Integration Tests
	testIntegration() {
		console.group('Integration Tests');

		// Test theme change affects tooltips
		const before = $('[data-bs-toggle="tooltip"]').length;
		$('#themeToggle').trigger('click');
		const after = $('[data-bs-toggle="tooltip"]').length;
		console.assert(before === after, 'Tooltips survive theme change');

		// Test URL changes affect code preview
		const initialCode = $('#codePreview').text();
		$('#apiKeyInput').val('test').trigger('change');
		const updatedCode = $('#codePreview').text();
		console.assert(initialCode !== updatedCode, 'Code preview updates with URL changes');

		console.groupEnd();
	},

	// Run all tests
	runAll() {
		console.group('Running All Tests');
		this.testGlobals();
		this.testHelpers();
		this.testSession();
		this.testPlaceholders();
		this.testTooltips();
		this.testTheme();
		this.testUrlBuilder();
		this.testExtendedOptions();
		this.testCodePreview();
		this.testIntegration();
		console.groupEnd();
	},
};

// Run tests when document is ready
$(document).ready(() => {
	// Wait for all modules to initialize
	setTimeout(() => {
		TestSuite.runAll();
	}, 1000);
});
