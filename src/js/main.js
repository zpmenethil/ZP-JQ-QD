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
import { restoreSessionValues } from './session.js';
// import { setupSessionListeners } from './initListeners.js';
import { updateCodePreview, updateMinHeightBasedOnMode } from './codePreview.js';
import './appLogger.js';
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
	initUrlBuilderListeners,
	initEmailConfirmationListeners,
} from './initListeners.js';
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

	// Initialize new listeners that were moved from session.js
	initUrlBuilderListeners();
	initEmailConfirmationListeners();

	initThemeToggle();
	initUrlBuilder(true);
	initExtendedOptions(false);
	initPlaceholder();
	setupPlaceholderStyling();

	initPaymentAmountListener();
	initUserModeToggle();
	initOverrideFeePayerToggle();

	// Restore session values
	restoreSessionValues();
	// setupSessionListeners() is deprecated - all listeners now in initListeners.js

	$('#paymentAmountInput').val($('#paymentAmountInput').val() || generateRandomPaymentAmount());
	updateMinHeightBasedOnMode();
	generateAndSetUuids();
	updateCodePreview();
}

$(document).ready(initializeApp);
