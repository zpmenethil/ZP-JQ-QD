import { showSuccess, showError } from './modal.js';

document.addEventListener('keydown', function (event) {
	if (event.ctrlKey && event.shiftKey && event.altKey && (event.key === 'C' || event.key === 'c')) {
		event.preventDefault(); // Prevent any default browser action

		try {
			sessionStorage.clear();
			localStorage.clear();
			console.info('Session and Local Storage cleared via Ctrl+Shift+C.');
			showSuccess(
				'Storage Cleared',
				'Session and Local Storage have been successfully cleared.',
				true
			);
		} catch (error) {
			console.error('Error clearing storage via Ctrl+Shift+C:', error);
			showError(
				'Error Clearing Storage',
				`An error occurred while clearing storage: ${error.message}`,
				false
			);
		}
	}
});

console.log('Keyboard shortcuts module loaded and active.');
