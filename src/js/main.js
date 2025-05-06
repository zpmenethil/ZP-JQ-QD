/**
 * @file main.js
 * @description Main module for event-handler registration and user interactions.
 */
import { $ } from './globals.js';
import { initTooltips } from './tooltips.js';
import './keyboardShortcuts.js';
import { initThemeToggle } from './theme.js';
import { initUrlBuilder } from './urlBuilder.js';
import { initExtendedOptions } from './extendedOptions.js';
import { initPlaceholder, setupPlaceholderStyling } from './placeholders.js';
import { restoreSessionValues, setupSessionListeners } from './session.js';
import { updateCodePreview, updateMinHeightBasedOnMode } from './codePreview.js';
import './applogger.js';
import {
	initCredentialsListeners,
	initPaymentMethodToggleListeners,
	initAdditionalOptionsListeners,
	initUiMinHeightListener,
	initModeSelectListener,
	initInitializePluginListener,
	initCopyCodeListener,
	initOptionTooltips,
	initPaymentModeHoverTooltip,
	initPaymentModeChangeTooltip,
	initPaymentAmountListener,
	initUserModeToggle,
	initOverrideFeePayerToggle,
} from './listener.js';
import { generateAndSetUuids } from './helpers.js';
import { initFileInputListener } from './fileInput.js';
import { generateRandomPaymentAmount } from './helpers.js';

export function initializeApp() {
	// Initialize UI components first
	initTooltips();
	initPaymentModeHoverTooltip();
	initPaymentModeChangeTooltip();
	initCredentialsListeners();
	initPaymentMethodToggleListeners();
	initAdditionalOptionsListeners();
	initUiMinHeightListener();
	initModeSelectListener();
	initInitializePluginListener();
	initCopyCodeListener();
	initFileInputListener();
	initOptionTooltips();

	initThemeToggle();
	initUrlBuilder(true);
	initExtendedOptions(false);
	initPlaceholder();
	setupPlaceholderStyling();

	initPaymentAmountListener();
	initUserModeToggle();
	initOverrideFeePayerToggle(); //

	restoreSessionValues();
	setupSessionListeners();

	$('#paymentAmountInput').val($('#paymentAmountInput').val() || generateRandomPaymentAmount());
	updateMinHeightBasedOnMode();
	generateAndSetUuids();
	// if (!$('#customerReferenceInput').val()) {
	// 	generateAndSetUuids();
	// }
	updateCodePreview();
}

$(document).ready(initializeApp);
