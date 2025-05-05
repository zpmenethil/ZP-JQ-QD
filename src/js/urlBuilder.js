// Import dependencies
import { $ } from './globals.js';
import { extendedOptions } from './extendedOptions.js'; 
import { updateCodePreview } from './codePreview.js';

/**
 * Update the redirect URL based on selected domain and subdomain
 */
export function updateRedirectUrl() {
    const domain = $('#domainSelect').val();
    const subdomain = $('input[name="subdomain"]:checked').val();
    const redirectUrl = `https://${subdomain}.${domain}.com.au/demo/`;
    const callbackUrl = `https://${subdomain}.${domain}.com.au/callback/`;

    $('#redirectUrlInput').val(redirectUrl);
    $('#callbackUrlInput').attr('placeholder', callbackUrl);

    // Update extended options
    extendedOptions.redirectUrl = redirectUrl;

    // Trigger code preview update if available
    if (typeof updateCodePreview === 'function') {
        updateCodePreview();
    }
}

/**
 * Initialize URL builder functionality.
 * Handles URL preview updates, modal tooltips, copy functionality,
 * and URL changes application.
 */
export function initUrlBuilder() {
    // Get all the URL builder elements
    const subdomainInputs = document.querySelectorAll('input[name="subdomain"]');
    const domainSelect = document.getElementById('domainSelect');
    const versionInputs = document.querySelectorAll('input[name="version"]');
    const urlPreview = document.getElementById('urlPreview');
    const modalUrlPreview = document.getElementById('modalUrlPreview');
    const modalCopyUrlBtn = document.getElementById('modalCopyUrlBtn');
    const applyUrlChangesBtn = document.getElementById('applyUrlChanges');

    /**
     * Update the URL preview based on current form values
     */
    function updateUrlPreview() {
        const subdomain = document.querySelector('input[name="subdomain"]:checked').value;
        const domain = domainSelect.value;
        const version = document.querySelector('input[name="version"]:checked').value;

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
    subdomainInputs.forEach(input => {
        input.addEventListener('change', updateUrlPreview);
    });

    domainSelect.addEventListener('change', updateUrlPreview);

    versionInputs.forEach(input => {
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
            updateUrlPreview();
        });
    }

    // Initialize URL preview
    updateUrlPreview();
}