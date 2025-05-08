/**
 * Reusable Modal Module
 * A Bootstrap 5 compatible modal utility
 */
import { bootstrap } from './globals.js';

// Modal type constants
export const MODAL_TYPE = {
	SUCCESS: 'success',
	ERROR: 'danger',
	WARNING: 'warning',
	INFO: 'info',
};

/**
 * Show a custom alert modal
 * @param {string} title - Modal title
 * @param {string} message - Modal message content
 * @param {string} type - Modal type (success, danger, warning, info)
 * @param {boolean} autoClose - Close modal automatically after delay
 * @param {number} closeDelay - Delay before auto-close (in ms)
 * @returns {Object} Modal instance
 */
export function showModal(
	title,
	message,
	type = MODAL_TYPE.INFO,
	autoClose = false,
	closeDelay = 3000
) {
	let modal = document.getElementById('appNotificationModal');
	if (!modal) {
		modal = document.createElement('div');
		modal.id = 'appNotificationModal';
		modal.className = 'modal fade notification-modal';
		modal.tabIndex = -1;
		modal.setAttribute('aria-hidden', 'true');
		modal.innerHTML = `
<div class="modal-dialog modal-dialog-centered notification-dialog">
    <div class="modal-content notification-content">
        <div class="modal-header notification-header">
            <h5 class="modal-title"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body notification-body"></div>
        <div class="modal-footer notification-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
    </div>
</div>
`;
		document.body.appendChild(modal);
	}

	// Set modal content
	const modalTitle = modal.querySelector('.modal-title');
	const modalBody = modal.querySelector('.modal-body');
	const modalDialog = modal.querySelector('.modal-dialog');
	const modalHeader = modal.querySelector('.modal-header');

	// Update content
	modalTitle.textContent = title;
	modalBody.innerHTML = message;

	modalDialog.classList.remove(
		'border',
		'border-success',
		'border-danger',
		'border-warning',
		'border-info'
	);
	modalHeader.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'text-white');

	// Apply type styling
	if (type) {
		modalHeader.classList.add(`bg-${type}`, 'text-white');
	}

	// Create and show modal
	const modalInstance = new bootstrap.Modal(modal);
	modalInstance.show();

	// Auto-close if requested
	if (autoClose) {
		setTimeout(() => {
			modalInstance.hide();
		}, closeDelay);
	}

	return modalInstance;
}

/**
 * Show a success modal
 * @param {string} title - Modal title
 * @param {string} message - Modal message content
 * @param {boolean} autoClose - Close modal automatically after delay
 * @returns {Object} Modal instance
 */
export function showSuccess(title, message, autoClose = true) {
	return showModal(title, message, MODAL_TYPE.SUCCESS, autoClose);
}

/**
 * Show an error modal
 * @param {string} title - Modal title
 * @param {string} message - Modal message content
 * @param {boolean} autoClose - Close modal automatically after delay
 * @returns {Object} Modal instance
 */
export function showError(title, message, autoClose = false) {
	return showModal(title, message, MODAL_TYPE.ERROR, autoClose);
}

/**
 * Show a warning modal
 * @param {string} title - Modal title
 * @param {string} message - Modal message content
 * @param {boolean} autoClose - Close modal automatically after delay
 * @returns {Object} Modal instance
 */
export function showWarning(title, message, autoClose = true) {
	return showModal(title, message, MODAL_TYPE.WARNING, autoClose);
}

/**
 * Show an info modal
 * @param {string} title - Modal title
 * @param {string} message - Modal message content
 * @param {boolean} autoClose - Close modal automatically after delay
 * @returns {Object} Modal instance
 */
export function showInfo(title, message, autoClose = true) {
	return showModal(title, message, MODAL_TYPE.INFO, autoClose);
}
