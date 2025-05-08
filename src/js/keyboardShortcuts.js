import { showSuccess, showError } from './modal.js';

document.addEventListener('keydown', function (event) {
	if (event.ctrlKey && event.shiftKey && event.altKey && (event.key === 'C' || event.key === 'c')) {
		event.preventDefault();

		try {
			sessionStorage.clear();
			localStorage.clear();
			console.info('Session and Local Storage cleared via Ctrl+Alt+Shift+C.');
			showSuccess(
				'Storage Cleared',
				'Session and Local Storage have been successfully cleared.',
				true
			);
		} catch (error) {
			console.error('Error clearing storage via Ctrl+Alt+Shift+C:', error);
			showError(
				'Error Clearing Storage',
				`An error occurred while clearing storage: ${error.message}`,
				false
			);
		}
	}

	if (event.ctrlKey && event.shiftKey && event.altKey && (event.key === 'J' || event.key === 'j')) {
		event.preventDefault();

		try {
			const codePreview = document.getElementById('codePreview');

			if (codePreview) {
				const isCurrentlyEditable = codePreview.contentEditable === 'true';
				codePreview.contentEditable = !isCurrentlyEditable;

				codePreview.classList.toggle('editable-code');

				codePreview.spellcheck = !isCurrentlyEditable;

				if (!isCurrentlyEditable) {
					codePreview.tabIndex = 0;
					codePreview.focus();

					showSuccess(
						'Code Preview Unlocked',
						'You can now edit the code preview directly. Press Ctrl+Alt+Shift+J again to lock it.',
						true
					);

					if (!document.getElementById('edit-code-styles')) {
						const styleTag = document.createElement('style');
						styleTag.id = 'edit-code-styles';
						styleTag.textContent = `
							.editable-code {
								border: 2px solid #4CAF50 !important;
								background-color: rgba(76, 175, 80, 0.05) !important;
								cursor: text !important;
							}
							.editable-code:focus {
								outline: none !important;
								box-shadow: 0 0 5px #4CAF50 !important;
							}
						`;
						document.head.appendChild(styleTag);
					}

					console.info('Code preview unlocked for editing via Ctrl+Alt+Shift+J');
				} else {
					codePreview.tabIndex = -1;

					showSuccess('Code Preview Locked', 'The code preview is now locked for editing.', true);

					console.info('Code preview locked for editing via Ctrl+Alt+Shift+J');
				}
			} else {
				showError(
					'Code Preview Not Found',
					'Could not find the code preview element to unlock.',
					false
				);
				console.error('Code preview element not found for Ctrl+Alt+Shift+J shortcut');
			}
		} catch (error) {
			console.error('Error toggling code preview editability via Ctrl+Alt+Shift+J:', error);
			showError(
				'Error Unlocking Code Preview',
				`An error occurred while trying to make the code preview editable: ${error.message}`,
				false
			);
		}
	}
});
