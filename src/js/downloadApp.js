import { DEFAULT_VALUES } from './globals.js';
import { $ } from './globals.js';
import { showError } from './modal.js'; // Import showError

/**
 * Downloads a standalone version of the ZenPay tester with current configuration
 */
export function downloadStandaloneDemo() {
	try {
		// Gather current configuration
		const apiKey = $('#apiKeyInput').val() || DEFAULT_VALUES.credentials.apiKey;
		const username = $('#usernameInput').val() || DEFAULT_VALUES.credentials.username;
		const password = $('#passwordInput').val() || DEFAULT_VALUES.credentials.password;
		const merchantCode = $('#merchantCodeInput').val() || DEFAULT_VALUES.credentials.merchantCode;
		const gateway = $('#urlPreview').val();
		const mode = $('#modeSelect').val();

		// Get current code snippet
		const codeSnippet = $('#codePreview').text();

		// Parse URL components
		let subdomain = 'payuat';
		let domain = 'travelpay';
		let version = 'v5';

		try {
			if (gateway) {
				const urlRegex = /https?:\/\/([^.]+)\.([^.]+)\.com\.au\/Online\/([^/]+)/;
				const match = gateway.match(urlRegex);

				if (match && match.length >= 4) {
					subdomain = match[1];
					domain = match[2];
					version = match[3];
				}
			}
		} catch (parseError) {
			console.error('Error parsing URL:', parseError);
		}

		// Map mode to descriptive text
		// const getModeText = modeValue => {
		// 	switch (parseInt(modeValue)) {
		// 		case 0:
		// 			return 'Mode 0: Make Payment';
		// 		case 1:
		// 			return 'Mode 1: Tokenize Card';
		// 		case 2:
		// 			return 'Mode 2: Custom Payment';
		// 		case 3:
		// 			return 'Mode 3: Preauth';
		// 		default:
		// 			return `Mode ${modeValue}: Unknown Mode`;
		// 	}
		// };

		// const modeText = getModeText(mode);

		// Fetch the template file using a relative path
		fetch('./Template.html')
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.text();
			})
			.then((templateHtml) => {
				// Create injection script
				const injectScript = `
        <script>
        document.addEventListener('DOMContentLoaded', function() {
          // Set credentials
          document.getElementById('apiKey').value = "${apiKey}";
          document.getElementById('username').value = "${username}";
          document.getElementById('password').value = "${password}";
          document.getElementById('merchantCode').value = "${merchantCode}";
          
          // Set URL dropdown components
          const subdomainDropdown = document.querySelectorAll('.dropdown-menu[aria-labelledby="subdomainText"] .dropdown-item');
          if (subdomainDropdown.length) {
            subdomainDropdown.forEach(item => {
              if (item.dataset.value === "${subdomain}") {
                item.click();
              }
            });
          }
          
          const domainDropdown = document.querySelectorAll('.dropdown-menu[aria-labelledby="domainText"] .dropdown-item');
          if (domainDropdown.length) {
            domainDropdown.forEach(item => {
              if (item.dataset.value === "${domain}") {
                item.click();
              }
            });
          }
          
          const versionDropdown = document.querySelectorAll('.dropdown-menu[aria-labelledby="versionText"] .dropdown-item');
          if (versionDropdown.length) {
            versionDropdown.forEach(item => {
              if (item.dataset.value === "${version}") {
                item.click();
              }
            });
          }
          
          // Set mode via dropdown
          const modeDropdown = document.querySelectorAll('.dropdown-menu a[data-value]');
          if (modeDropdown.length) {
            modeDropdown.forEach(item => {
              if (item.dataset.value === "${mode}") {
                item.click();
              }
            });
          }
          
          // Initialize plugin button handling
          document.getElementById('initializePlugin').addEventListener('click', function() {
            try {
              ${codeSnippet.trim()}
            } catch(error) {
              console.error('Error initializing payment:', error);
              alert('Error initializing payment. See console for details.');
            }
          });
        });
        </script>
        `;

				// Insert script before closing body tag
				const modifiedTemplate = templateHtml.replace('</body>', `${injectScript}\n</body>`);

				// Create downloadable blob
				const blob = new Blob([modifiedTemplate], { type: 'text/html' });
				const url = URL.createObjectURL(blob);

				// Trigger download
				const link = document.createElement('a');
				link.href = url;
				link.download = `ZenPay_Tester_${merchantCode || 'Demo'}.html`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);

				console.log('Template fetched and demo prepared for download.');
			})
			.catch((error) => {
				console.error('Error fetching or processing template:', error);
			});
	} catch (error) {
		console.error('Error preparing download:', error);
	}
}

export function initDownloadFunctionality(buttonSelector) {
	const button = $(buttonSelector);
	if (button.length) {
		// Initial state is handled by initCredentialsListeners calling updateActionButtonsState
		// which will add/remove 'btn-disabled' class and set the title.

		button.on('click', function () {
			// Changed to a function to access 'this'
			if ($(this).hasClass('btn-disabled')) {
				showError(
					'Missing Credentials',
					'Please fill in API Key, Username, Password, and Merchant Code to download the demo.'
				);
			} else {
				downloadStandaloneDemo(); // Call the original download function
			}
		});
	} else {
		console.warn(`Download button with selector "${buttonSelector}" not found for initialization.`);
	}
}
