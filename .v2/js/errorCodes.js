/**
 * ZenPay Error Codes Reference
 *
 * This script manages the display and filtering of error codes used in ZenPay Payment Plugin.
 */

// Create a self-executing function to avoid global namespace pollution
(function () {
	// Error codes data structure
	const ERROR_CODES = {
		E01: {
			code: 'E01',
			category: 'Authentication',
			description: 'Make sure fingerprint and apikey are passed.',
			solution: 'Ensure both parameters are included in your request.',
		},
		E02: {
			code: 'E02',
			category: 'Validation',
			description: 'MerchantUniquePaymentId cannot be empty.',
			solution: 'Generate and provide a unique MerchantUniquePaymentId for the transaction.',
		},
		E03: {
			code: 'E03',
			category: 'Security',
			description:
				'The fingerprint should be unique everytime. This can be achieved by using new MerchantUniquePaymentId and current Timestamp everytime the plugin is opened.',
			solution:
				'Generate a new fingerprint with a unique MerchantUniquePaymentId and current timestamp for each transaction.',
		},
		E04: {
			code: 'E04',
			category: 'Authentication',
			description: 'Invalid Credentials. Applicable for V1 and V2(V1 and V2 are deprecated).',
			solution: 'Verify your credentials. Consider upgrading to a newer API version.',
		},
		E05: {
			code: 'E05',
			category: 'Authentication',
			description: 'Make sure fingerprint and apikey are passed.',
			solution: 'Ensure both parameters are included in your request.',
		},
		E06: {
			code: 'E06',
			category: 'Account',
			description: 'Account is not active. Contact administrator.',
			solution: 'Contact the ZenPay administrator to activate your account.',
		},
		E07: {
			code: 'E07',
			category: 'Configuration',
			description: 'Provided endpoint is not supported.',
			solution: "Verify that you're using a valid and supported endpoint URL.",
		},
		E08: {
			code: 'E08',
			category: 'Authentication',
			description:
				'Invalid Credentials. Make sure fingerprint is correctly generated, refer to fingerprint generation logic.',
			solution: "Check the fingerprint generation logic to ensure it's correctly implemented.",
		},
		E09: {
			code: 'E09',
			category: 'Security',
			description: 'Security violation. Close and open the plugin with fresh fingerprint.',
			solution: 'Restart the payment flow with a newly generated fingerprint.',
		},
		E10: {
			code: 'E10',
			category: 'Security',
			description: 'Security violation. Close and open the plugin with fresh fingerprint.',
			solution: 'Restart the payment flow with a newly generated fingerprint.',
		},
		E11: {
			code: 'E11',
			category: 'Validation',
			description:
				'Timestamp cannot be empty. Make sure to pass same timestamp as in generated fingerprint.',
			solution:
				'Provide the timestamp parameter and ensure it matches the one used in fingerprint generation.',
		},
		E13: {
			code: 'E13',
			category: 'Configuration',
			description: 'MerchantCode provided does not match with the provided credentials.',
			solution: "Verify that the merchant code matches the credentials you're using.",
		},
		E14: {
			code: 'E14',
			category: 'Security',
			description: 'Security violation. Close and open the plugin with fresh fingerprint.',
			solution: 'Restart the payment flow with a newly generated fingerprint.',
		},
		E15: {
			code: 'E15',
			category: 'Validation',
			description: 'MerchantCode cannot be empty(V4 onwards).',
			solution: 'Provide the merchantCode parameter for API version 4 and above.',
		},
		E16: {
			code: 'E16',
			category: 'Validation',
			description: 'Version can not be empty.',
			solution: 'Specify the API version you are using.',
		},
		E17: {
			code: 'E17',
			category: 'Validation',
			description: 'CustomerEmail can not be empty(V4 onwards).',
			solution: 'Provide the customerEmail parameter for API version 4 and above.',
		},
	};

	// Get unique categories from error codes
	function getUniqueCategories() {
		const categories = new Set();

		for (const errorKey in ERROR_CODES) {
			const error = ERROR_CODES[errorKey];
			if (error.category) {
				categories.add(error.category);
			}
		}

		return Array.from(categories).sort();
	}

	// Filter error codes based on search text and category
	function filterErrorCodes(searchText, category) {
		searchText = (searchText || '').toLowerCase();

		return Object.values(ERROR_CODES).filter((error) => {
			// Match search text
			const matchesSearch =
				!searchText ||
				error.code.toLowerCase().includes(searchText) ||
				error.description.toLowerCase().includes(searchText) ||
				(error.solution && error.solution.toLowerCase().includes(searchText)) ||
				(error.category && error.category.toLowerCase().includes(searchText));

			// Match category
			const matchesCategory = !category || error.category === category;

			return matchesSearch && matchesCategory;
		});
	}

	// Render error codes to the table
	function renderErrorCodes(filteredCodes) {
		const tableBody = document.getElementById('errorCodesTableBody');
		const noResultsElement = document.getElementById('noErrorCodesFound');

		// Clear existing rows
		tableBody.innerHTML = '';

		if (filteredCodes.length === 0) {
			// Show no results message
			noResultsElement.classList.remove('d-none');
			return;
		}

		// Hide no results message
		noResultsElement.classList.add('d-none');

		// Add rows for each error code
		filteredCodes.forEach((error) => {
			const row = document.createElement('tr');

			// Create cells with error data
			const codeCell = document.createElement('td');
			codeCell.innerHTML = `<span class="badge bg-primary-subtle text-primary">${error.code}</span>`;

			const categoryCell = document.createElement('td');
			categoryCell.textContent = error.category || '';

			const descriptionCell = document.createElement('td');
			// If solution exists, add it with some formatting
			if (error.solution) {
				descriptionCell.innerHTML = `
                    <div>${error.description}</div>
                    <div class="text-secondary small mt-1"><strong>Solution:</strong> ${error.solution}</div>
                `;
			} else {
				descriptionCell.textContent = error.description;
			}

			// Add cells to row
			row.appendChild(codeCell);
			row.appendChild(categoryCell);
			row.appendChild(descriptionCell);

			// Add row to table
			tableBody.appendChild(row);
		});
	}

	// Initialize error codes modal
	function initErrorCodesModal() {
		// Get DOM elements
		const modal = document.getElementById('errorCodesModal');
		const searchInput = document.getElementById('errorSearchInput');
		const categoryFilter = document.getElementById('errorCategoryFilter');
		const errorCodesBtn = document.getElementById('errorCodesBtn');

		// Initialize Bootstrap modal
		const modalInstance = new bootstrap.Modal(modal);

		// Populate category filter options
		const categories = getUniqueCategories();
		categories.forEach((category) => {
			const option = document.createElement('option');
			option.value = category;
			option.textContent = category;
			categoryFilter.appendChild(option);
		});

		// Add event listener to search input
		searchInput.addEventListener('input', () => {
			const searchText = searchInput.value;
			const category = categoryFilter.value;
			const filteredCodes = filterErrorCodes(searchText, category);
			renderErrorCodes(filteredCodes);
		});

		// Add event listener to category filter
		categoryFilter.addEventListener('change', () => {
			const searchText = searchInput.value;
			const category = categoryFilter.value;
			const filteredCodes = filterErrorCodes(searchText, category);
			renderErrorCodes(filteredCodes);
		});

		// Add event listener to error codes button
		if (errorCodesBtn) {
			errorCodesBtn.addEventListener('click', () => {
				// Reset filters
				searchInput.value = '';
				categoryFilter.value = '';

				// Render all error codes
				renderErrorCodes(Object.values(ERROR_CODES));

				// Show modal
				modalInstance.show();
			});
		}

		// Reset filters when modal is hidden
		modal.addEventListener('hidden.bs.modal', () => {
			searchInput.value = '';
			categoryFilter.value = '';
		});

		// Theme-aware styling for the modal
		function updateModalTheme() {
			const isDarkTheme = document.documentElement.getAttribute('data-bs-theme') === 'dark';
			if (isDarkTheme) {
				modal.querySelectorAll('.table').forEach((table) => {
					table.classList.add('table-dark');
				});
			} else {
				modal.querySelectorAll('.table').forEach((table) => {
					table.classList.remove('table-dark');
				});
			}
		}

		// Update modal theme when shown
		modal.addEventListener('shown.bs.modal', updateModalTheme);

		// Update modal theme when theme changes
		document.getElementById('themeToggle')?.addEventListener('click', () => {
			if (modal.classList.contains('show')) {
				setTimeout(updateModalTheme, 100);
			}
		});
	}

	// Initialize when DOM is ready
	document.addEventListener('DOMContentLoaded', () => {
		initErrorCodesModal();
	});

	// Expose some functions for potential external use
	window.ZenPayErrorCodes = {
		getErrorByCode: function (code) {
			return ERROR_CODES[code] || null;
		},
		getAllErrors: function () {
			return Object.values(ERROR_CODES);
		},
		showModal: function () {
			const modal = document.getElementById('errorCodesModal');
			if (modal) {
				const modalInstance = new bootstrap.Modal(modal);
				modalInstance.show();
			}
		},
		showErrorDetails: function (code) {
			const error = ERROR_CODES[code];
			if (!error) {
				console.warn(`Error code ${code} not found.`);
				return;
			}

			// Reset search and filter to show all errors
			document.getElementById('errorSearchInput').value = code;
			document.getElementById('errorCategoryFilter').value = '';

			// Filter to show only this error
			const filteredCodes = filterErrorCodes(code, '');
			renderErrorCodes(filteredCodes);

			// Show the modal
			const modal = document.getElementById('errorCodesModal');
			if (modal) {
				const modalInstance = new bootstrap.Modal(modal);
				modalInstance.show();
			}
		},
	};
})();
