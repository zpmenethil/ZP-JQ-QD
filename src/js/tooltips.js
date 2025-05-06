import { $, bootstrap } from './globals.js';

/**
 * Initialize all tooltips in the application.
 * @returns {void}
 */
export function initTooltips() {
	const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	tooltipTriggerList.map(
		(tooltipTriggerEl) =>
			new bootstrap.Tooltip(tooltipTriggerEl, {
				trigger: 'hover focus',
			})
	);
	$('.collapse').on('shown.bs.collapse', function () {
		$(this).find('[data-bs-toggle="tooltip"]').tooltip('dispose');
		$(this).find('[data-bs-toggle="tooltip"]').tooltip();
	});
}

/**
 * Re-initialize tooltips for theme changes.
 * This should be called after theme changes to ensure proper styling.
 * @returns {void}
 */
export function reinitializeTooltips() {
	$('[data-bs-toggle="tooltip"]').tooltip('dispose');
	initTooltips();
}
