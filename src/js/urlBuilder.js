import { $, DEFAULT_VALUES } from './globals.js';
import { extendedOptions } from './globals.js';
import { updateCodePreview } from './codePreview.js';
import { saveToSession, getFromSession } from './session.js';
import { SESSION_KEYS } from './globals.js';

/**
 * Update the redirect URL based on selected domain and subdomain.
 * @returns {void}
 */
export function updateRedirectUrl() {
	const domain = $('#domainSelect').val();
	const subdomain = $('input[name="subdomain"]:checked').val();
	const redirectUrl = `https://${subdomain}.${domain}.com.au/demo/`;
	const callbackUrl = `https://${subdomain}.${domain}.com.au/callback/`;
	$('#redirectUrlInput').val(redirectUrl);
	$('#callbackUrlInput').attr('placeholder', callbackUrl);
	extendedOptions.redirectUrl = redirectUrl;
	if (typeof updateCodePreview === 'function') {
		updateCodePreview();
	}
}

/**
 * Initialize URL builder functionality.
 * Handles URL preview updates, modal tooltips, copy functionality,
 * and URL changes application.
 * @param {boolean} restoreFromSession - Whether to restore values from session storage
 * @returns {void}
 */
export function initUrlBuilder(restoreFromSession = true) {
	const subdomainInputs = document.querySelectorAll('input[name="subdomain"]');
	const domainSelect = document.getElementById('domainSelect');
	const versionInputs = document.querySelectorAll('input[name="version"]');
	const urlPreview = document.getElementById('urlPreview');
	const modalUrlPreview = document.getElementById('modalUrlPreview');
	const modalCopyUrlBtn = document.getElementById('modalCopyUrlBtn');
	const applyUrlChangesBtn = document.getElementById('applyUrlChanges');

	// Restore from session if requested
	if (restoreFromSession) {
		const savedSubdomain = getFromSession(SESSION_KEYS.SUBDOMAIN, DEFAULT_VALUES.url.subdomain);
		const savedDomain = getFromSession(SESSION_KEYS.DOMAIN, DEFAULT_VALUES.url.domain);
		const savedVersion = getFromSession(SESSION_KEYS.VERSION, DEFAULT_VALUES.url.version);

		// Apply saved subdomain
		if (savedSubdomain) {
			const subdomainInput = document.querySelector(
				`input[name="subdomain"][value="${savedSubdomain}"]`
			);
			if (subdomainInput) {
				subdomainInput.checked = true;
			}
		}

		// Apply saved domain
		if (savedDomain && domainSelect) {
			domainSelect.value = savedDomain;
		}

		// Apply saved version
		if (savedVersion) {
			const versionInput = document.querySelector(`input[name="version"][value="${savedVersion}"]`);
			if (versionInput) {
				versionInput.checked = true;
			}
		}
	}

	/**
	 * Update the URL preview based on current form values
	 */
	function updateUrlPreview() {
		const subdomain = document.querySelector('input[name="subdomain"]:checked').value;
		const domain = domainSelect.value;
		const version = document.querySelector('input[name="version"]:checked').value;

		// Save to session storage using helper functions
		saveToSession(SESSION_KEYS.SUBDOMAIN, subdomain);
		saveToSession(SESSION_KEYS.DOMAIN, domain);
		saveToSession(SESSION_KEYS.VERSION, version);

		const url = `https://${subdomain}.${domain}.com.au/online/${version}`;
		urlPreview.value = url;

		// Also update the modal URL preview if it exists
		if (modalUrlPreview) {
			modalUrlPreview.value = url;
		}

		// Update redirect URL when domain changes
		updateRedirectUrl();

		// Update the code preview if available
		if (typeof updateCodePreview === 'function') {
			updateCodePreview();
		}
	}

	// Add event listeners to all URL builder elements
	subdomainInputs.forEach((input) => {
		input.addEventListener('change', updateUrlPreview);
	});

	domainSelect.addEventListener('change', updateUrlPreview);

	versionInputs.forEach((input) => {
		input.addEventListener('change', updateUrlPreview);
	});

	// Initialize tooltips for the modal when it's shown
	$('#urlBuilderModal').on('shown.bs.modal', function () {
		$(this).find('[data-bs-toggle="tooltip"]').tooltip();
	});

	// Copy URL from modal to clipboard
	if (modalCopyUrlBtn) {
		modalCopyUrlBtn.addEventListener('click', () => {
			modalUrlPreview.select();
			document.execCommand('copy');
			console.log('[initUrlBuilder] URL copied to clipboard:', modalUrlPreview.value);
			// Show success feedback
			const originalIcon = modalCopyUrlBtn.innerHTML;
			modalCopyUrlBtn.innerHTML = '<i class="bi bi-check-lg"></i>';

			setTimeout(() => {
				modalCopyUrlBtn.innerHTML = originalIcon;
			}, 2000);
		});
	}

	// Apply URL changes from modal
	if (applyUrlChangesBtn) {
		applyUrlChangesBtn.addEventListener('click', () => {
			console.log(`[initUrlBuilder] Applying URL changes from modal ${modalUrlPreview.value}`);
			updateUrlPreview();
		});
	}

	// Initialize URL preview
	updateUrlPreview();
}
