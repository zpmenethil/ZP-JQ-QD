/**
 * @file main.js
 * @description Main module for event-handler registration and user interactions.
 */

import { $ } from './globals.js';
// import { generateRandomPaymentAmount } from './helpers.js';
// import { initTooltips, initPaymentModeTooltips } from './tooltips.js';
import { initTooltips } from './tooltips.js';

import { initThemeToggle } from './theme.js';
import { initUrlBuilder } from './urlBuilder.js';
import { initExtendedOptions, generateAndSetUuids } from './extendedOptions.js';
import { initPlaceholder, setupPlaceholderStyling } from './placeholders.js';
import { restoreSessionValues, setupSessionListeners } from './session.js';
import { updateCodePreview, updateMinHeightBasedOnMode } from './codePreview.js';
import './applogger.js';
import {
	initInputPreviewListeners,
	initPaymentMethodToggleListeners,
	initAdditionalOptionsListeners,
	initUiMinHeightListener,
	initModeSelectListener,
	initInitializePluginListener,
	initCopyCodeListener,
	initOptionTooltips,
	initPaymentModeHoverTooltip,
	initPaymentModeChangeTooltip,
} from './listener.js';
import { initFileInputListener } from './fileInput.js';

export const APP_START_TIME = new Date().toISOString().slice(0, 19);
window.APP_START_TIME = APP_START_TIME;

export function initializeApp() {
	// Initialize UI components first
	initTooltips();
	initPaymentModeHoverTooltip();
	initPaymentModeChangeTooltip();
	initInputPreviewListeners();
	initPaymentMethodToggleListeners();
	initAdditionalOptionsListeners();
	initUiMinHeightListener();
	initModeSelectListener();
	initInitializePluginListener();
	initCopyCodeListener();
	initFileInputListener();
	initOptionTooltips();

	initThemeToggle();
	initUrlBuilder(false);
	initExtendedOptions(false);
	initPlaceholder();
	setupPlaceholderStyling();
	restoreSessionValues();
	setupSessionListeners();

	// $('#paymentAmountInput').val($('#paymentAmountInput').val() || generateRandomPaymentAmount());
	updateMinHeightBasedOnMode();
	generateAndSetUuids();
	// Run this only once at the end
	// if (!$('#customerReferenceInput').val()) {
	// 	generateAndSetUuids();
	// }
	// Call this only once at the end
	updateCodePreview();
}

$(document).ready(initializeApp);
