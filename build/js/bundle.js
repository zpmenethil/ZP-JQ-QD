/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/codePreview.js":
/*!*******************************!*\
  !*** ./src/js/codePreview.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   copyCodeToClipboard: () => (/* binding */ copyCodeToClipboard),
/* harmony export */   updateCodePreview: () => (/* binding */ updateCodePreview),
/* harmony export */   updateMinHeightBasedOnMode: () => (/* binding */ updateMinHeightBasedOnMode)
/* harmony export */ });
/* harmony import */ var _globals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./globals.js */ "./src/js/globals.js");
/* harmony import */ var _extendedOptions_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extendedOptions.js */ "./src/js/extendedOptions.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers.js */ "./src/js/helpers.js");
// Import dependencies





/**
 * Build the code snippet based on current form values and options
 * @param {Object} config - Configuration object containing all necessary values
 * @returns {string} Formatted code snippet
 */
function buildCodeSnippet(_ref) {
  var apiKey = _ref.apiKey,
    merchantCode = _ref.merchantCode,
    paymentAmount = _ref.paymentAmount,
    mode = _ref.mode,
    timestamp = _ref.timestamp,
    merchantUniquePaymentId = _ref.merchantUniquePaymentId,
    customerReference = _ref.customerReference,
    fingerprint = _ref.fingerprint;
  // Get the URL from the URL preview
  var url = document.getElementById('urlPreview').value;

  // Start with the basic configuration
  var snippet = "\nvar payment = $.zpPayment({\n  url: \"".concat(url, "\",\n  merchantCode: \"").concat(merchantCode, "\",\n  apiKey: \"").concat(apiKey, "\",\n  fingerprint: \"").concat(fingerprint, "\",");

  // Add redirect URL
  snippet += "\n  redirectUrl: \"".concat(_extendedOptions_js__WEBPACK_IMPORTED_MODULE_1__.extendedOptions.redirectUrl, "\",");

  // Add callback URL if provided
  if (_extendedOptions_js__WEBPACK_IMPORTED_MODULE_1__.extendedOptions.callbackUrl) {
    snippet += "\n  callbackUrl: \"".concat(_extendedOptions_js__WEBPACK_IMPORTED_MODULE_1__.extendedOptions.callbackUrl, "\",");
  }

  // Add minHeight from UI Options tab
  var minHeight = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#uiMinHeightInput').val();
  if (minHeight) {
    snippet += "\n  minHeight: ".concat(minHeight, ",");
  }

  // Add other required fields
  snippet += "\n  mode: ".concat(mode, ",\n  merchantUniquePaymentId: \"").concat(merchantUniquePaymentId, "\",\n  customerName: \"").concat(_extendedOptions_js__WEBPACK_IMPORTED_MODULE_1__.extendedOptions.customerName, "\",\n  contactNumber: \"").concat(_extendedOptions_js__WEBPACK_IMPORTED_MODULE_1__.extendedOptions.contactNumber, "\",\n  customerEmail: \"").concat(_extendedOptions_js__WEBPACK_IMPORTED_MODULE_1__.extendedOptions.customerEmail, "\",\n  customerReference: \"").concat(customerReference, "\",\n  paymentAmount: ").concat(paymentAmount, ",\n  timeStamp: \"").concat(timestamp, "\"");

  // Add payment method options if they're enabled
  for (var option in _globals_js__WEBPACK_IMPORTED_MODULE_0__.paymentMethodOptions) {
    if (_globals_js__WEBPACK_IMPORTED_MODULE_0__.paymentMethodOptions[option]) {
      snippet += ",\n  ".concat(option, ": true");
    }
  }

  // Add additional options if they're enabled
  for (var _option in _globals_js__WEBPACK_IMPORTED_MODULE_0__.additionalOptions) {
    // Only include tokenization options if mode is 1
    if (_option === 'showFeeOnTokenising' || _option === 'showFailedPaymentFeeOnTokenising') {
      if (mode === '1' && _globals_js__WEBPACK_IMPORTED_MODULE_0__.additionalOptions[_option]) {
        snippet += ",\n  ".concat(_option, ": true");
      }
    } else if (_globals_js__WEBPACK_IMPORTED_MODULE_0__.additionalOptions[_option]) {
      snippet += ",\n  ".concat(_option, ": true");
    }
  }

  // Close the configuration object
  snippet += "\n});\n\npayment.open();";
  return snippet.trim();
}

/**
 * Update the code preview with current form values
 */
function updateCodePreview() {
  var timestamp = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.generateCurrentDatetime)();
  var merchantUniquePaymentId = _extendedOptions_js__WEBPACK_IMPORTED_MODULE_1__.extendedOptions.merchantUniquePaymentId || (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.generateUUID)();
  var customerReference = _extendedOptions_js__WEBPACK_IMPORTED_MODULE_1__.extendedOptions.customerReference || (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.generateUUID)();
  var apiKey = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#apiKeyInput').val().trim();
  var username = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#usernameInput').val().trim();
  var password = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#passwordInput').val().trim();
  var merchantCode = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#merchantCodeInput').val().trim();
  var inputPaymentAmount = Number.parseFloat((0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#paymentAmountInput').val()) || 0.0;
  var paymentAmount = +inputPaymentAmount.toFixed(2);
  var selectedMode = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#modeSelect').val();

  // For the fingerprint process, if Mode 2 is selected, use 0 as the payment amount.
  var fingerprintPaymentAmount = selectedMode === '2' ? 0 : paymentAmount;
  var hashAmount = Math.round(fingerprintPaymentAmount * 100);
  var fingerprint = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.createSHA3Hash)(apiKey, username, password, selectedMode, hashAmount, merchantUniquePaymentId, timestamp);
  var snippet = buildCodeSnippet({
    apiKey: apiKey,
    username: username,
    password: password,
    merchantCode: merchantCode,
    paymentAmount: paymentAmount,
    mode: selectedMode,
    timestamp: timestamp,
    merchantUniquePaymentId: merchantUniquePaymentId,
    customerReference: customerReference,
    fingerprint: fingerprint
  });
  var codeBlock = document.getElementById('codePreview');
  codeBlock.textContent = snippet;
  _globals_js__WEBPACK_IMPORTED_MODULE_0__.hljs.highlightElement(codeBlock);
}

/**
 * Copy the code snippet to clipboard
 */
function copyCodeToClipboard() {
  var codeText = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#codePreview').text();
  navigator.clipboard.writeText(codeText).then(function () {
    // Show success feedback
    var copyBtn = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#copyCodeBtn');
    var originalIcon = copyBtn.html();
    copyBtn.html('<i class="bi bi-check-lg"></i>');
    setTimeout(function () {
      copyBtn.html(originalIcon);
    }, 2000);
  })["catch"](function (err) {
    console.error('Failed to copy code:', err);
    alert('Failed to copy code. Please try again.');
  });
}

/**
 * Update minHeight based on selected mode
 */
function updateMinHeightBasedOnMode() {
  var mode = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#modeSelect').val();
  var defaultHeight = mode === '1' ? '600' : '825';

  // Only set if user hasn't manually changed it
  if (!(0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#uiMinHeightInput').val()) {
    (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#uiMinHeightInput').val(defaultHeight);
    if (_extendedOptions_js__WEBPACK_IMPORTED_MODULE_1__.extendedOptions) {
      _extendedOptions_js__WEBPACK_IMPORTED_MODULE_1__.extendedOptions.minHeight = defaultHeight;
    }
  }
}

/***/ }),

/***/ "./src/js/errorCodes.js":
/*!******************************!*\
  !*** ./src/js/errorCodes.js ***!
  \******************************/
/***/ (() => {

/**
 * ZenPay Error Codes Reference
 *
 * This script manages the display and filtering of error codes used in ZenPay Payment Plugin.
 */

// Create a self-executing function to avoid global namespace pollution
(function () {
  // Error codes data structure
  var ERROR_CODES = {
    E01: {
      code: 'E01',
      category: 'Authentication',
      description: 'Make sure fingerprint and apikey are passed.',
      solution: 'Ensure both parameters are included in your request.'
    },
    E02: {
      code: 'E02',
      category: 'Validation',
      description: 'MerchantUniquePaymentId cannot be empty.',
      solution: 'Generate and provide a unique MerchantUniquePaymentId for the transaction.'
    },
    E03: {
      code: 'E03',
      category: 'Security',
      description: 'The fingerprint should be unique everytime. This can be achieved by using new MerchantUniquePaymentId and current Timestamp everytime the plugin is opened.',
      solution: 'Generate a new fingerprint with a unique MerchantUniquePaymentId and current timestamp for each transaction.'
    },
    E04: {
      code: 'E04',
      category: 'Authentication',
      description: 'Invalid Credentials. Applicable for V1 and V2(V1 and V2 are deprecated).',
      solution: 'Verify your credentials. Consider upgrading to a newer API version.'
    },
    E05: {
      code: 'E05',
      category: 'Authentication',
      description: 'Make sure fingerprint and apikey are passed.',
      solution: 'Ensure both parameters are included in your request.'
    },
    E06: {
      code: 'E06',
      category: 'Account',
      description: 'Account is not active. Contact administrator.',
      solution: 'Contact the ZenPay administrator to activate your account.'
    },
    E07: {
      code: 'E07',
      category: 'Configuration',
      description: 'Provided endpoint is not supported.',
      solution: "Verify that you're using a valid and supported endpoint URL."
    },
    E08: {
      code: 'E08',
      category: 'Authentication',
      description: 'Invalid Credentials. Make sure fingerprint is correctly generated, refer to fingerprint generation logic.',
      solution: "Check the fingerprint generation logic to ensure it's correctly implemented."
    },
    E09: {
      code: 'E09',
      category: 'Security',
      description: 'Security violation. Close and open the plugin with fresh fingerprint.',
      solution: 'Restart the payment flow with a newly generated fingerprint.'
    },
    E10: {
      code: 'E10',
      category: 'Security',
      description: 'Security violation. Close and open the plugin with fresh fingerprint.',
      solution: 'Restart the payment flow with a newly generated fingerprint.'
    },
    E11: {
      code: 'E11',
      category: 'Validation',
      description: 'Timestamp cannot be empty. Make sure to pass same timestamp as in generated fingerprint.',
      solution: 'Provide the timestamp parameter and ensure it matches the one used in fingerprint generation.'
    },
    E13: {
      code: 'E13',
      category: 'Configuration',
      description: 'MerchantCode provided does not match with the provided credentials.',
      solution: "Verify that the merchant code matches the credentials you're using."
    },
    E14: {
      code: 'E14',
      category: 'Security',
      description: 'Security violation. Close and open the plugin with fresh fingerprint.',
      solution: 'Restart the payment flow with a newly generated fingerprint.'
    },
    E15: {
      code: 'E15',
      category: 'Validation',
      description: 'MerchantCode cannot be empty(V4 onwards).',
      solution: 'Provide the merchantCode parameter for API version 4 and above.'
    },
    E16: {
      code: 'E16',
      category: 'Validation',
      description: 'Version can not be empty.',
      solution: 'Specify the API version you are using.'
    },
    E17: {
      code: 'E17',
      category: 'Validation',
      description: 'CustomerEmail can not be empty(V4 onwards).',
      solution: 'Provide the customerEmail parameter for API version 4 and above.'
    }
  };

  // Get unique categories from error codes
  function getUniqueCategories() {
    var categories = new Set();
    for (var errorKey in ERROR_CODES) {
      var error = ERROR_CODES[errorKey];
      if (error.category) {
        categories.add(error.category);
      }
    }
    return Array.from(categories).sort();
  }

  // Filter error codes based on search text and category
  function filterErrorCodes(searchText, category) {
    searchText = (searchText || '').toLowerCase();
    return Object.values(ERROR_CODES).filter(function (error) {
      // Match search text
      var matchesSearch = !searchText || error.code.toLowerCase().includes(searchText) || error.description.toLowerCase().includes(searchText) || error.solution && error.solution.toLowerCase().includes(searchText) || error.category && error.category.toLowerCase().includes(searchText);

      // Match category
      var matchesCategory = !category || error.category === category;
      return matchesSearch && matchesCategory;
    });
  }

  // Render error codes to the table
  function renderErrorCodes(filteredCodes) {
    var tableBody = document.getElementById('errorCodesTableBody');
    var noResultsElement = document.getElementById('noErrorCodesFound');

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
    filteredCodes.forEach(function (error) {
      var row = document.createElement('tr');

      // Create cells with error data
      var codeCell = document.createElement('td');
      codeCell.innerHTML = "<span class=\"badge bg-primary-subtle text-primary\">".concat(error.code, "</span>");
      var categoryCell = document.createElement('td');
      categoryCell.textContent = error.category || '';
      var descriptionCell = document.createElement('td');
      // If solution exists, add it with some formatting
      if (error.solution) {
        descriptionCell.innerHTML = "\n                    <div>".concat(error.description, "</div>\n                    <div class=\"text-secondary small mt-1\"><strong>Solution:</strong> ").concat(error.solution, "</div>\n                ");
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
    var _document$getElementB;
    // Get DOM elements
    var modal = document.getElementById('errorCodesModal');
    var searchInput = document.getElementById('errorSearchInput');
    var categoryFilter = document.getElementById('errorCategoryFilter');
    var errorCodesBtn = document.getElementById('errorCodesBtn');

    // Initialize Bootstrap modal
    var modalInstance = new bootstrap.Modal(modal);

    // Populate category filter options
    var categories = getUniqueCategories();
    categories.forEach(function (category) {
      var option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });

    // Add event listener to search input
    searchInput.addEventListener('input', function () {
      var searchText = searchInput.value;
      var category = categoryFilter.value;
      var filteredCodes = filterErrorCodes(searchText, category);
      renderErrorCodes(filteredCodes);
    });

    // Add event listener to category filter
    categoryFilter.addEventListener('change', function () {
      var searchText = searchInput.value;
      var category = categoryFilter.value;
      var filteredCodes = filterErrorCodes(searchText, category);
      renderErrorCodes(filteredCodes);
    });

    // Add event listener to error codes button
    if (errorCodesBtn) {
      errorCodesBtn.addEventListener('click', function () {
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
    modal.addEventListener('hidden.bs.modal', function () {
      searchInput.value = '';
      categoryFilter.value = '';
    });

    // Theme-aware styling for the modal
    function updateModalTheme() {
      var isDarkTheme = document.documentElement.getAttribute('data-bs-theme') === 'dark';
      if (isDarkTheme) {
        modal.querySelectorAll('.table').forEach(function (table) {
          table.classList.add('table-dark');
        });
      } else {
        modal.querySelectorAll('.table').forEach(function (table) {
          table.classList.remove('table-dark');
        });
      }
    }

    // Update modal theme when shown
    modal.addEventListener('shown.bs.modal', updateModalTheme);

    // Update modal theme when theme changes
    (_document$getElementB = document.getElementById('themeToggle')) === null || _document$getElementB === void 0 || _document$getElementB.addEventListener('click', function () {
      if (modal.classList.contains('show')) {
        setTimeout(updateModalTheme, 100);
      }
    });
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    initErrorCodesModal();
  });

  // Expose some functions for potential external use
  window.ZenPayErrorCodes = {
    getErrorByCode: function getErrorByCode(code) {
      return ERROR_CODES[code] || null;
    },
    getAllErrors: function getAllErrors() {
      return Object.values(ERROR_CODES);
    },
    showModal: function showModal() {
      var modal = document.getElementById('errorCodesModal');
      if (modal) {
        var modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
      }
    },
    showErrorDetails: function showErrorDetails(code) {
      var error = ERROR_CODES[code];
      if (!error) {
        console.warn("Error code ".concat(code, " not found."));
        return;
      }

      // Reset search and filter to show all errors
      document.getElementById('errorSearchInput').value = code;
      document.getElementById('errorCategoryFilter').value = '';

      // Filter to show only this error
      var filteredCodes = filterErrorCodes(code, '');
      renderErrorCodes(filteredCodes);

      // Show the modal
      var modal = document.getElementById('errorCodesModal');
      if (modal) {
        var modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
      }
    }
  };
})();

/***/ }),

/***/ "./src/js/extendedOptions.js":
/*!***********************************!*\
  !*** ./src/js/extendedOptions.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   extendedOptions: () => (/* binding */ extendedOptions),
/* harmony export */   generateAndSetUuids: () => (/* binding */ generateAndSetUuids),
/* harmony export */   initExtendedOptions: () => (/* binding */ initExtendedOptions),
/* harmony export */   restoreExtendedOptions: () => (/* binding */ restoreExtendedOptions),
/* harmony export */   saveExtendedOptions: () => (/* binding */ saveExtendedOptions)
/* harmony export */ });
/* harmony import */ var _globals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./globals.js */ "./src/js/globals.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers.js */ "./src/js/helpers.js");
/* harmony import */ var _urlBuilder_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./urlBuilder.js */ "./src/js/urlBuilder.js");
/* harmony import */ var _codePreview_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./codePreview.js */ "./src/js/codePreview.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// Import dependencies





// Extended options object with default values
var extendedOptions = {
  redirectUrl: 'https://payuat.travelpay.com.au/demo/',
  callbackUrl: '',
  minHeight: '',
  customerName: 'Test User',
  customerReference: '',
  customerEmail: 'test@zenpay.com.au',
  merchantUniquePaymentId: '',
  contactNumber: '0400123123'
};

/**
 * Generate and set UUIDs for customer reference and merchant unique payment ID
 */
function generateAndSetUuids() {
  var customerReference = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.generateUUID)();
  var merchantUniquePaymentId = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.generateUUID)();
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#customerReferenceInput').val(customerReference);
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#merchantUniquePaymentIdInput').val(merchantUniquePaymentId);
  extendedOptions.customerReference = customerReference;
  extendedOptions.merchantUniquePaymentId = merchantUniquePaymentId;

  // Update code preview if already defined
  if (typeof _codePreview_js__WEBPACK_IMPORTED_MODULE_3__.updateCodePreview === 'function') {
    (0,_codePreview_js__WEBPACK_IMPORTED_MODULE_3__.updateCodePreview)();
  }
}

/**
 * Initialize extended options functionality.
 * Sets up default values and event handlers for extended options form fields.
 */
function initExtendedOptions() {
  // Generate Blizzard character data
  var characterName = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.generateFirstLastName)();
  var email = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.generateEmail)();
  var mobileNumber = '0400000000';

  // Set default values
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#customerNameInput').val(characterName);
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#customerEmailInput').val(email);
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#contactNumberInput').val(mobileNumber);

  // Update extended options object
  extendedOptions.customerName = characterName;
  extendedOptions.customerEmail = email;
  extendedOptions.contactNumber = mobileNumber;

  // Handle input changes in extended options
  var inputMap = {
    redirectUrlInput: 'redirectUrl',
    callbackUrlInput: 'callbackUrl',
    customerNameInput: 'customerName',
    customerReferenceInput: 'customerReference',
    customerEmailInput: 'customerEmail',
    merchantUniquePaymentIdInput: 'merchantUniquePaymentId',
    contactNumberInput: 'contactNumber'
  };

  // Add event listeners for all mapped inputs
  Object.entries(inputMap).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      inputId = _ref2[0],
      optionKey = _ref2[1];
    (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)("#".concat(inputId)).on('input', function () {
      var value = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).val();
      extendedOptions[optionKey] = value;

      // Update code preview if defined
      if (typeof _codePreview_js__WEBPACK_IMPORTED_MODULE_3__.updateCodePreview === 'function') {
        (0,_codePreview_js__WEBPACK_IMPORTED_MODULE_3__.updateCodePreview)();
      }
    });
  });

  // Update redirect URL when domain changes
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#domainSelect').on('change', function () {
    (0,_urlBuilder_js__WEBPACK_IMPORTED_MODULE_2__.updateRedirectUrl)();
  });

  // Initial redirect URL setup
  (0,_urlBuilder_js__WEBPACK_IMPORTED_MODULE_2__.updateRedirectUrl)();
}

/**
 * Restore extended options values from session storage
 */
function restoreExtendedOptions() {
  // Restore extended option values
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#redirectUrlInput').val(sessionStorage.getItem('demo_redirectUrl') || extendedOptions.redirectUrl);
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#callbackUrlInput').val(sessionStorage.getItem('demo_callbackUrl') || '');
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#minHeightInput').val(sessionStorage.getItem('demo_minHeight') || '');
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#customerNameInput').val(sessionStorage.getItem('demo_customerName') || extendedOptions.customerName);
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#customerReferenceInput').val(sessionStorage.getItem('demo_customerReference') || '');
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#customerEmailInput').val(sessionStorage.getItem('demo_customerEmail') || extendedOptions.customerEmail);
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#merchantUniquePaymentIdInput').val(sessionStorage.getItem('demo_merchantUniquePaymentId') || '');
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#contactNumberInput').val(sessionStorage.getItem('demo_contactNumber') || extendedOptions.contactNumber);

  // Update extended options object with restored values
  extendedOptions.redirectUrl = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#redirectUrlInput').val();
  extendedOptions.callbackUrl = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#callbackUrlInput').val();
  extendedOptions.minHeight = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#minHeightInput').val();
  extendedOptions.customerName = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#customerNameInput').val();
  extendedOptions.customerReference = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#customerReferenceInput').val();
  extendedOptions.customerEmail = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#customerEmailInput').val();
  extendedOptions.merchantUniquePaymentId = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#merchantUniquePaymentIdInput').val();
  extendedOptions.contactNumber = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#contactNumberInput').val();

  // If customer name, email, or contact number are empty, generate new ones
  if (!(0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#customerNameInput').val()) {
    var characterName = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.generateFirstLastName)();
    (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#customerNameInput').val(characterName);
    extendedOptions.customerName = characterName;
  }
  if (!(0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#customerEmailInput').val()) {
    var email = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.generateEmail)();
    (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#customerEmailInput').val(email);
    extendedOptions.customerEmail = email;
  }
  if (!(0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#contactNumberInput').val()) {
    (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#contactNumberInput').val('0400000000');
    extendedOptions.contactNumber = '0400000000';
  }
}

/**
 * Save extended options values to session storage
 */
function saveExtendedOptions() {
  // Save extended options
  sessionStorage.setItem('demo_redirectUrl', extendedOptions.redirectUrl);
  sessionStorage.setItem('demo_callbackUrl', extendedOptions.callbackUrl);
  sessionStorage.setItem('demo_minHeight', extendedOptions.minHeight);
  sessionStorage.setItem('demo_customerName', extendedOptions.customerName);
  sessionStorage.setItem('demo_customerReference', extendedOptions.customerReference);
  sessionStorage.setItem('demo_customerEmail', extendedOptions.customerEmail);
  sessionStorage.setItem('demo_merchantUniquePaymentId', extendedOptions.merchantUniquePaymentId);
  sessionStorage.setItem('demo_contactNumber', extendedOptions.contactNumber);
}

/***/ }),

/***/ "./src/js/globals.js":
/*!***************************!*\
  !*** ./src/js/globals.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: () => (/* binding */ $),
/* harmony export */   FirstNames: () => (/* binding */ FirstNames),
/* harmony export */   LastNames: () => (/* binding */ LastNames),
/* harmony export */   additionalOptions: () => (/* binding */ additionalOptions),
/* harmony export */   bootstrap: () => (/* binding */ bootstrap),
/* harmony export */   hljs: () => (/* binding */ hljs),
/* harmony export */   jQuery: () => (/* binding */ jQuery),
/* harmony export */   paymentMethodOptions: () => (/* binding */ paymentMethodOptions),
/* harmony export */   sha3_512: () => (/* binding */ sha3_512)
/* harmony export */ });
/**
 * ZenPay Payment Plugin Demo - Global Variables
 */

// Core library references
var jQuery = window.jQuery;
var $ = jQuery;
var bootstrap = window.bootstrap;
var hljs = window.hljs;
var sha3_512 = typeof globalThis.sha3_512 === 'function' ? globalThis.sha3_512.bind(globalThis) : function (data) {
  console.warn('sha3_512 function is not defined. Ensure the library is loaded.');
  return '';
};
var FirstNames = ['Thrall', 'Jaina', 'Arthas', 'Sylvanas', 'Illidan', 'Tyrande', 'Malfurion', 'Anduin', 'Varian', 'Grom', 'Kael', 'Uther', 'Medivh', "Gul'dan", 'Garrosh', "Vol'jin", 'Valeera', 'Rexxar', 'Maiev', 'Cairne', 'Baine', "Lor'themar", 'Jim', 'Sarah', 'Tychus', 'Zeratul', 'Tassadar', 'Artanis', 'Nova', 'Fenix', 'Diablo', 'Tyrael', 'Deckard', 'Leoric', 'Li-Ming', 'Johanna', 'Kharazim', 'Sonya', 'Valla', 'Malthael'];
var LastNames = ['Hellscream', 'Proudmoore', 'Menethil', 'Windrunner', 'Stormrage', 'Whisperwind', 'Wrynn', 'Thassarian', 'Thas', 'Lightbringer', 'Doomhammer', 'Bloodhoof', 'Theron', 'Raynor', 'Kerrigan', 'Findlay', 'Cain', 'Adria', 'Nephalem', 'Blackthorn', 'Kul', 'Horadrim', 'Darkbane', 'Sunstrider', 'Shadowsong', 'Bronzebeard', 'Wildhammer', 'Mograine', 'Fordragon', 'Prestor', 'Sanguinar', 'Trollbane', 'Marris', 'Faol', 'Ravencrest', 'Shadowsun', 'Executor'];
var paymentMethodOptions = {
  allowBankAcOneOffPayment: false,
  allowPayToOneOffPayment: false,
  allowPayIdOneOffPayment: false,
  allowApplePayOneOffPayment: false,
  allowGooglePayOneOffPayment: false,
  allowLatitudePayOneOffPayment: false,
  allowSaveCardUserOption: false
};
var additionalOptions = {
  hideTermsAndConditions: false,
  hideMerchantLogo: false,
  sendConfirmationEmailToCustomer: false,
  sendConfirmationEmailToMerchant: false,
  showFeeOnTokenising: false,
  showFailedPaymentFeeOnTokenising: false
};

/***/ }),

/***/ "./src/js/helpers.js":
/*!***************************!*\
  !*** ./src/js/helpers.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSHA1Hash: () => (/* binding */ createSHA1Hash),
/* harmony export */   createSHA3_512Hash: () => (/* binding */ createSHA3_512Hash),
/* harmony export */   createSHA512Hash: () => (/* binding */ createSHA512Hash),
/* harmony export */   generateCurrentDatetime: () => (/* binding */ generateCurrentDatetime),
/* harmony export */   generateEmail: () => (/* binding */ generateEmail),
/* harmony export */   generateFirstLastName: () => (/* binding */ generateFirstLastName),
/* harmony export */   generateRandomPaymentAmount: () => (/* binding */ generateRandomPaymentAmount),
/* harmony export */   generateUUID: () => (/* binding */ generateUUID),
/* harmony export */   validateConfigSchema: () => (/* binding */ validateConfigSchema)
/* harmony export */ });
/* harmony import */ var _globals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./globals.js */ "./src/js/globals.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * ZenPay Payment Plugin Demo - Helper Functions
 */


function generateRandomPaymentAmount() {
  return (Math.random() * 990 + 10).toFixed(2);
}
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
function generateCurrentDatetime() {
  return new Date().toISOString().slice(0, 19);
}
function createSHA3_512Hash(apiKey, username, password, mode, hashAmount, merchantUniquePaymentId, timestamp) {
  // log each value joining them `|`
  var data = [apiKey, username, password, mode, hashAmount, merchantUniquePaymentId, timestamp].join('|');
  console.log("[createSHA1Hash] d", data);
  console.log("[createSHA1Hash] Data: ".concat(data));
  console.log("[createSHA3_512Hash] Fingerprint Payload \uD83D\uDC47");
  hash = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.sha3_512)(data);
  console.log("[createSHA3_512Hash] Fingerprint Payload Hash: ".concat(hash));
  return hash;
}
function createSHA1Hash(apiKey, username, password, mode, hashAmount, merchantUniquePaymentId, timestamp) {
  var data = [apiKey, username, password, mode, hashAmount, merchantUniquePaymentId, timestamp].join('|');
  console.log("[createSHA1Hash] Data: ".concat(data));
  console.log("[createSHA1Hash] Fingerprint Payload \uD83D\uDC47");
  var hash = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.sha1)(data);
  console.log("[createSHA1Hash] Fingerprint Payload Hash (SHA1): ".concat(hash));
  return hash;
}
function createSHA512Hash(apiKey, username, password, mode, hashAmount, merchantUniquePaymentId, timestamp) {
  var data = [apiKey, username, password, mode, hashAmount, merchantUniquePaymentId, timestamp].join('|');
  console.log("[createSHA512Hash] Data: ".concat(data));
  console.log("[createSHA512Hash] Fingerprint Payload \uD83D\uDC47");
  var hash = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.sha512)(data);
  console.log("[createSHA512Hash] Fingerprint Payload Hash (SHA512): ".concat(hash));
  return hash;
}
function generateFirstLastName() {
  var firstName = _globals_js__WEBPACK_IMPORTED_MODULE_0__.FirstNames[Math.floor(Math.random() * _globals_js__WEBPACK_IMPORTED_MODULE_0__.FirstNames.length)];
  var lastName = _globals_js__WEBPACK_IMPORTED_MODULE_0__.LastNames[Math.floor(Math.random() * _globals_js__WEBPACK_IMPORTED_MODULE_0__.LastNames.length)];
  return "".concat(firstName, " ").concat(lastName);
}
function generateEmail() {
  var firstName = _globals_js__WEBPACK_IMPORTED_MODULE_0__.FirstNames[Math.floor(Math.random() * _globals_js__WEBPACK_IMPORTED_MODULE_0__.FirstNames.length)];
  return "".concat(firstName.toLowerCase(), "@zenpay.com.au");
}
function validateConfigSchema(config) {
  return config && _typeof(config) === 'object' && typeof config.apiKey === 'string' && typeof config.username === 'string' && typeof config.password === 'string' && typeof config.merchantCode === 'string';
}

/***/ }),

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _globals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./globals.js */ "./src/js/globals.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers.js */ "./src/js/helpers.js");
/* harmony import */ var _tooltips_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tooltips.js */ "./src/js/tooltips.js");
/* harmony import */ var _theme_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./theme.js */ "./src/js/theme.js");
/* harmony import */ var _urlBuilder_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./urlBuilder.js */ "./src/js/urlBuilder.js");
/* harmony import */ var _extendedOptions_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./extendedOptions.js */ "./src/js/extendedOptions.js");
/* harmony import */ var _placeholders_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./placeholders.js */ "./src/js/placeholders.js");
/* harmony import */ var _session_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./session.js */ "./src/js/session.js");
/* harmony import */ var _codePreview_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./codePreview.js */ "./src/js/codePreview.js");
/* harmony import */ var _pluginInit_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./pluginInit.js */ "./src/js/pluginInit.js");
// Import all module dependencies










(0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(document).ready(function () {
  (0,_tooltips_js__WEBPACK_IMPORTED_MODULE_2__.initTooltips)();
  (0,_tooltips_js__WEBPACK_IMPORTED_MODULE_2__.initPaymentModeTooltips)();
  (0,_theme_js__WEBPACK_IMPORTED_MODULE_3__.initThemeToggle)();
  (0,_urlBuilder_js__WEBPACK_IMPORTED_MODULE_4__.initUrlBuilder)();
  (0,_extendedOptions_js__WEBPACK_IMPORTED_MODULE_5__.initExtendedOptions)();
  (0,_placeholders_js__WEBPACK_IMPORTED_MODULE_6__.initPlaceholderFix)();
  (0,_placeholders_js__WEBPACK_IMPORTED_MODULE_6__.setupPlaceholderStyling)();
  (0,_session_js__WEBPACK_IMPORTED_MODULE_7__.restoreSessionValues)();
  (0,_session_js__WEBPACK_IMPORTED_MODULE_7__.setupSessionListeners)();
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#paymentAmountInput').val((0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#paymentAmountInput').val() || (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.generateRandomPaymentAmount)());
  (0,_codePreview_js__WEBPACK_IMPORTED_MODULE_8__.updateMinHeightBasedOnMode)();
  if (!(0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#customerReferenceInput').val()) {
    (0,_extendedOptions_js__WEBPACK_IMPORTED_MODULE_5__.generateAndSetUuids)();
  }

  // Generate the initial code preview
  (0,_codePreview_js__WEBPACK_IMPORTED_MODULE_8__.updateCodePreview)();

  // Event Listeners

  // Update preview whenever form inputs or mode changes
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#apiKeyInput, #usernameInput, #passwordInput, #merchantCodeInput, #paymentAmountInput, #modeSelect').on('input change', _codePreview_js__WEBPACK_IMPORTED_MODULE_8__.updateCodePreview);

  // Handle payment method toggles
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('.payment-method-toggle').on('change', function () {
    var option = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).data('option');
    _globals_js__WEBPACK_IMPORTED_MODULE_0__.paymentMethodOptions[option] = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).prop('checked');
    // Save to session storage immediately
    sessionStorage.setItem("demo_".concat(option), _globals_js__WEBPACK_IMPORTED_MODULE_0__.paymentMethodOptions[option]);
    (0,_codePreview_js__WEBPACK_IMPORTED_MODULE_8__.updateCodePreview)();
  });

  // Handle additional option toggles
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('.option-toggle').on('change', function () {
    var option = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).data('option');
    _globals_js__WEBPACK_IMPORTED_MODULE_0__.additionalOptions[option] = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).prop('checked');
    (0,_codePreview_js__WEBPACK_IMPORTED_MODULE_8__.updateCodePreview)();
  });

  // Handle minHeight input in UI Options
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#uiMinHeightInput').on('input', _codePreview_js__WEBPACK_IMPORTED_MODULE_8__.updateCodePreview);

  // Show/hide tokenization options based on mode
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#modeSelect').on('change', function () {
    var mode = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).val();
    if (mode === '1') {
      (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#tokenizationOptions').removeClass('d-none');
    } else {
      (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#tokenizationOptions').addClass('d-none');
    }
    (0,_codePreview_js__WEBPACK_IMPORTED_MODULE_8__.updateMinHeightBasedOnMode)();
    (0,_codePreview_js__WEBPACK_IMPORTED_MODULE_8__.updateCodePreview)();
  });

  // Click to initialize plugin
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#initializePlugin').on('click', _pluginInit_js__WEBPACK_IMPORTED_MODULE_9__.initializeZenPayPlugin);

  // Copy to clipboard icon
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#copyCodeBtn').on('click', _codePreview_js__WEBPACK_IMPORTED_MODULE_8__.copyCodeToClipboard);

  // Browse configuration button
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#browseConfigBtn').on('click', function () {
    // Create a file input element
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';

    // Handle file selection
    fileInput.addEventListener('change', function (e) {
      if (e.target.files.length > 0) {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
          try {
            var config = JSON.parse(event.target.result);

            // Validate schema
            if (!(0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.validateConfigSchema)(config)) {
              alert('Invalid configuration file format. Please ensure it contains apiKey, username, password, and merchantCode.');
              return;
            }

            // Populate form with config values
            if (config.apiKey) (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#apiKeyInput').val(config.apiKey);
            if (config.username) (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#usernameInput').val(config.username);
            if (config.password) (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#passwordInput').val(config.password);
            if (config.merchantCode) (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#merchantCodeInput').val(config.merchantCode);

            // Save to session storage
            (0,_session_js__WEBPACK_IMPORTED_MODULE_7__.saveSessionValues)();

            // Update code preview
            (0,_codePreview_js__WEBPACK_IMPORTED_MODULE_8__.updateCodePreview)();

            // Show success message
            alert('Configuration loaded successfully!');
          } catch (error) {
            console.error('Error parsing configuration file:', error);
            alert('Failed to load configuration. Invalid file format.');
          }
        };
        reader.readAsText(file);
      }
    });

    // Trigger click on the file input
    fileInput.click();
  });

  // Add tooltips to payment mode options
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#modeSelect option').each(function () {
    var tooltipText = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).data('tooltip');
    if (tooltipText) {
      (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).attr('title', tooltipText);
    }
  });
});

/***/ }),

/***/ "./src/js/placeholders.js":
/*!********************************!*\
  !*** ./src/js/placeholders.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   enhancePlaceholderConsistency: () => (/* binding */ enhancePlaceholderConsistency),
/* harmony export */   initPlaceholderFix: () => (/* binding */ initPlaceholderFix),
/* harmony export */   initPlaceholders: () => (/* binding */ initPlaceholders),
/* harmony export */   setupPlaceholderStyling: () => (/* binding */ setupPlaceholderStyling)
/* harmony export */ });
/* harmony import */ var _globals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./globals.js */ "./src/js/globals.js");
/**
 * ZenPay Payment Plugin Demo - Placeholder Management
 */



/**
 * Setup placeholder consistency and enhancement
 */
function initPlaceholderFix() {
  // List of credential input fields
  var credentialFields = ['#apiKeyInput', '#usernameInput', '#passwordInput', '#merchantCodeInput', '#paymentAmountInput'];

  // Add placeholders to these fields
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(credentialFields.join(', ')).each(function () {
    var $this = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this);
    var placeholderText = $this.attr('placeholder') || '';

    // Store the original placeholder if not already done
    if (!$this.data('original-placeholder')) {
      $this.data('original-placeholder', placeholderText);
    }

    // Set the placeholder explicitly
    $this.attr('placeholder', $this.data('original-placeholder'));
  });
}

/**
 * Enhanced placeholder handling for consistent styling
 * This function modifies input fields to treat placeholders visually like actual values
 */
function enhancePlaceholderConsistency() {
  // Target all form-floating inputs that should have consistent placeholder behavior
  var inputSelectors = ['#apiKeyInput', '#usernameInput', '#passwordInput', '#merchantCodeInput', '#paymentAmountInput', '#redirectUrlInput', '#callbackUrlInput', '#customerNameInput', '#contactNumberInput', '#customerEmailInput', '#customerReferenceInput', '#merchantUniquePaymentIdInput', '#uiMinHeightInput'];
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(inputSelectors.join(', ')).each(function () {
    var $input = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this);
    var originalPlaceholder = $input.attr('placeholder');
    if (!originalPlaceholder) return; // Skip if no placeholder

    // Store original placeholder
    $input.data('original-placeholder', originalPlaceholder);

    // When the input field has no value, add the has-placeholder class and show placeholder
    function updatePlaceholderState() {
      if (!$input.val()) {
        $input.addClass('has-placeholder');
        $input.attr('placeholder', $input.data('original-placeholder'));
      } else {
        $input.removeClass('has-placeholder');
        // Keep placeholder empty when value exists to avoid confusion
        $input.attr('placeholder', '');
      }
    }

    // Initial state
    updatePlaceholderState();

    // Update on value change
    $input.on('input change blur', updatePlaceholderState);

    // Special handling for focus - keep the has-placeholder class but update text
    $input.on('focus', function () {
      if (!$input.val()) {
        $input.addClass('has-placeholder');
        $input.attr('placeholder', $input.data('original-placeholder'));
      }
    });
  });
}

/**
 * Setup placeholder styling for all inputs with placeholders
 */
function setupPlaceholderStyling() {
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('.form-floating input[placeholder], .form-floating textarea[placeholder]').each(function () {
    var $input = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this);
    var originalPlaceholder = $input.attr('placeholder');
    if (!originalPlaceholder) return;

    // Function to update the class based on value state
    function updatePlaceholderState() {
      if (!$input.val()) {
        $input.addClass('placeholder-as-value');
      } else {
        $input.removeClass('placeholder-as-value');
      }
    }

    // Set initial state
    updatePlaceholderState();

    // Update on input events
    $input.on('input change blur', updatePlaceholderState);
  });
}

/**
 * Initialize all placeholder functionality
 */
function initPlaceholders() {
  initPlaceholderFix();
  enhancePlaceholderConsistency();
  setupPlaceholderStyling();

  // Also call whenever there might be dynamically loaded content
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(document).on('valueLoaded formReset', setupPlaceholderStyling);
}

/***/ }),

/***/ "./src/js/pluginInit.js":
/*!******************************!*\
  !*** ./src/js/pluginInit.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initializeZenPayPlugin: () => (/* binding */ initializeZenPayPlugin)
/* harmony export */ });
/* harmony import */ var _globals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./globals.js */ "./src/js/globals.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers.js */ "./src/js/helpers.js");
/* harmony import */ var _extendedOptions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extendedOptions.js */ "./src/js/extendedOptions.js");
/* harmony import */ var _session_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./session.js */ "./src/js/session.js");
// Import dependencies






/**
 * Initialize the ZenPay plugin with current configuration
 */
function initializeZenPayPlugin() {
  try {
    // Save current session values
    (0,_session_js__WEBPACK_IMPORTED_MODULE_3__.saveSessionValues)();
    var timestamp = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.generateCurrentDatetime)();
    var merchantUniquePaymentId = _extendedOptions_js__WEBPACK_IMPORTED_MODULE_2__.extendedOptions.merchantUniquePaymentId || (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.generateUUID)();
    var customerReference = _extendedOptions_js__WEBPACK_IMPORTED_MODULE_2__.extendedOptions.customerReference || (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.generateUUID)();
    var apiKey = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#apiKeyInput').val().trim();
    var username = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#usernameInput').val().trim();
    var password = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#passwordInput').val().trim();
    var merchantCode = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#merchantCodeInput').val().trim();
    var url = document.getElementById('urlPreview').value;
    var inputPaymentAmount = Number.parseFloat((0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#paymentAmountInput').val()) || 0.0;
    var paymentAmount = +inputPaymentAmount.toFixed(2);
    var selectedMode = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#modeSelect').val();

    // For the fingerprint process, if Mode 2 is selected, use 0 as the payment amount for fingerprinting.
    var fingerprintPaymentAmount = selectedMode === '2' ? 0 : paymentAmount;
    var hashAmount = Math.round(fingerprintPaymentAmount * 100);
    var fingerprint = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.createSHA3Hash)(apiKey, username, password, selectedMode, hashAmount, merchantUniquePaymentId, timestamp);

    // Initialize plugin with base configuration
    var paymentConfig = {
      url: url,
      merchantCode: merchantCode,
      apiKey: apiKey,
      fingerprint: fingerprint,
      timeStamp: timestamp,
      paymentAmount: paymentAmount,
      mode: Number.parseInt(selectedMode, 10),
      redirectUrl: _extendedOptions_js__WEBPACK_IMPORTED_MODULE_2__.extendedOptions.redirectUrl,
      merchantUniquePaymentId: merchantUniquePaymentId,
      customerName: _extendedOptions_js__WEBPACK_IMPORTED_MODULE_2__.extendedOptions.customerName,
      contactNumber: _extendedOptions_js__WEBPACK_IMPORTED_MODULE_2__.extendedOptions.contactNumber,
      customerEmail: _extendedOptions_js__WEBPACK_IMPORTED_MODULE_2__.extendedOptions.customerEmail,
      customerReference: customerReference
    };

    // Add callback URL if provided
    if (_extendedOptions_js__WEBPACK_IMPORTED_MODULE_2__.extendedOptions.callbackUrl) {
      paymentConfig.callbackUrl = _extendedOptions_js__WEBPACK_IMPORTED_MODULE_2__.extendedOptions.callbackUrl;
    }

    // Add minHeight from UI Options tab
    var minHeight = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#uiMinHeightInput').val();
    if (minHeight) {
      paymentConfig.minHeight = Number.parseInt(minHeight, 10);
    }

    // Add payment method options if they're enabled
    for (var option in _globals_js__WEBPACK_IMPORTED_MODULE_0__.paymentMethodOptions) {
      if (_globals_js__WEBPACK_IMPORTED_MODULE_0__.paymentMethodOptions[option]) {
        paymentConfig[option] = true;
      }
    }

    // Add additional options if they're enabled
    for (var _option in _globals_js__WEBPACK_IMPORTED_MODULE_0__.additionalOptions) {
      // Only include tokenization options if mode is 1
      if (_option === 'showFeeOnTokenising' || _option === 'showFailedPaymentFeeOnTokenising') {
        if (selectedMode === '1' && _globals_js__WEBPACK_IMPORTED_MODULE_0__.additionalOptions[_option]) {
          paymentConfig[_option] = true;
        }
      } else if (_globals_js__WEBPACK_IMPORTED_MODULE_0__.additionalOptions[_option]) {
        paymentConfig[_option] = true;
      }
    }
    var payment = _globals_js__WEBPACK_IMPORTED_MODULE_0__.$.zpPayment(paymentConfig);
    console.log('Payment object initialized with payload:', payment.options);
    payment.open();
  } catch (err) {
    console.error('Error initializing plugin:', err);
    alert('Unable to initialize plugin. See console for details.');
  }
}

/***/ }),

/***/ "./src/js/session.js":
/*!***************************!*\
  !*** ./src/js/session.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SESSION_KEYS: () => (/* binding */ SESSION_KEYS),
/* harmony export */   getFromSession: () => (/* binding */ getFromSession),
/* harmony export */   restoreSessionValues: () => (/* binding */ restoreSessionValues),
/* harmony export */   saveSessionValues: () => (/* binding */ saveSessionValues),
/* harmony export */   saveToSession: () => (/* binding */ saveToSession),
/* harmony export */   setupSessionListeners: () => (/* binding */ setupSessionListeners)
/* harmony export */ });
/* harmony import */ var _globals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./globals.js */ "./src/js/globals.js");
/**
 * ZenPay Payment Plugin Demo - Session Management
 */




// Session storage keys
var SESSION_KEYS = {
  API_KEY: 'demoApiKey',
  USERNAME: 'demoUsername',
  PASSWORD: 'demoPassword',
  MERCHANT_CODE: 'demoMerchantCode',
  PAYMENT_AMOUNT: 'demoPaymentAmount',
  MODE: 'demoMode',
  SUBDOMAIN: 'demoSubdomain',
  DOMAIN: 'demoDomain',
  VERSION: 'demoVersion',
  UI_MIN_HEIGHT: 'demo_uiMinHeight',
  REDIRECT_URL: 'demo_redirectUrl',
  CALLBACK_URL: 'demo_callbackUrl',
  MIN_HEIGHT: 'demo_minHeight',
  CUSTOMER_NAME: 'demo_customerName',
  CUSTOMER_REFERENCE: 'demo_customerReference',
  CUSTOMER_EMAIL: 'demo_customerEmail',
  MERCHANT_UNIQUE_PAYMENT_ID: 'demo_merchantUniquePaymentId',
  CONTACT_NUMBER: 'demo_contactNumber'
};

/**
 * Save a value to session storage with error handling
 */
function saveToSession(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to session storage:', e);
  }
}

/**
 * Get a value from session storage with error handling
 */
function getFromSession(key) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  try {
    var value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    console.error('Error retrieving from session storage:', e);
    return defaultValue;
  }
}

/**
 * Restore all session values to form fields
 */
function restoreSessionValues() {
  // Restore credential fields
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#apiKeyInput').val(getFromSession(SESSION_KEYS.API_KEY, ''));
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#usernameInput').val(getFromSession(SESSION_KEYS.USERNAME, ''));
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#passwordInput').val(getFromSession(SESSION_KEYS.PASSWORD, ''));
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#merchantCodeInput').val(getFromSession(SESSION_KEYS.MERCHANT_CODE, ''));
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#paymentAmountInput').val(getFromSession(SESSION_KEYS.PAYMENT_AMOUNT, ''));
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#modeSelect').val(getFromSession(SESSION_KEYS.MODE, '0'));

  // Show tokenization options if mode is 1
  if ((0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#modeSelect').val() === '1') {
    (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#tokenizationOptions').removeClass('d-none');
  }

  // Restore payment method options
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('.payment-method-toggle').each(function () {
    var option = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).data('option');
    var savedValue = getFromSession("demo_".concat(option), false);
    if (savedValue === true) {
      (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).prop('checked', true);
      if (_globals_js__WEBPACK_IMPORTED_MODULE_0__.paymentMethodOptions && option in _globals_js__WEBPACK_IMPORTED_MODULE_0__.paymentMethodOptions) {
        _globals_js__WEBPACK_IMPORTED_MODULE_0__.paymentMethodOptions[option] = true;
      }
    }
  });

  // Restore additional options
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('.option-toggle').each(function () {
    var option = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).data('option');
    var savedValue = getFromSession("demo_".concat(option), false);
    if (savedValue === true) {
      (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).prop('checked', true);
      if (_globals_js__WEBPACK_IMPORTED_MODULE_0__.additionalOptions && option in _globals_js__WEBPACK_IMPORTED_MODULE_0__.additionalOptions) {
        _globals_js__WEBPACK_IMPORTED_MODULE_0__.additionalOptions[option] = true;
      }
    }
  });

  // Restore URL builder settings
  var savedSubdomain = getFromSession(SESSION_KEYS.SUBDOMAIN);
  if (savedSubdomain) {
    (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)("input[name=\"subdomain\"][value=\"".concat(savedSubdomain, "\"]")).prop('checked', true);
  }
  var savedDomain = getFromSession(SESSION_KEYS.DOMAIN);
  if (savedDomain) {
    (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#domainSelect').val(savedDomain);
  }
  var savedVersion = getFromSession(SESSION_KEYS.VERSION);
  if (savedVersion) {
    (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)("input[name=\"version\"][value=\"".concat(savedVersion, "\"]")).prop('checked', true);
  }

  // Restore UI minHeight
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#uiMinHeightInput').val(getFromSession(SESSION_KEYS.UI_MIN_HEIGHT, ''));
}

/**
 * Save all form field values to session storage
 */
function saveSessionValues() {
  // Save credential fields
  saveToSession(SESSION_KEYS.API_KEY, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#apiKeyInput').val().trim());
  saveToSession(SESSION_KEYS.USERNAME, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#usernameInput').val().trim());
  saveToSession(SESSION_KEYS.PASSWORD, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#passwordInput').val().trim());
  saveToSession(SESSION_KEYS.MERCHANT_CODE, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#merchantCodeInput').val().trim());
  saveToSession(SESSION_KEYS.PAYMENT_AMOUNT, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#paymentAmountInput').val().trim());
  saveToSession(SESSION_KEYS.MODE, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#modeSelect').val());

  // Save payment method options
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('.payment-method-toggle').each(function () {
    var option = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).data('option');
    saveToSession("demo_".concat(option), (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).prop('checked'));
  });

  // Save additional options
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('.option-toggle').each(function () {
    var option = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).data('option');
    saveToSession("demo_".concat(option), (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).prop('checked'));
  });

  // Save URL builder settings
  saveToSession(SESSION_KEYS.SUBDOMAIN, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('input[name="subdomain"]:checked').val());
  saveToSession(SESSION_KEYS.DOMAIN, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#domainSelect').val());
  saveToSession(SESSION_KEYS.VERSION, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('input[name="version"]:checked').val());

  // Save extended options
  saveToSession(SESSION_KEYS.REDIRECT_URL, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#redirectUrlInput').val());
  saveToSession(SESSION_KEYS.CALLBACK_URL, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#callbackUrlInput').val());
  saveToSession(SESSION_KEYS.MIN_HEIGHT, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#minHeightInput').val());
  saveToSession(SESSION_KEYS.CUSTOMER_NAME, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#customerNameInput').val());
  saveToSession(SESSION_KEYS.CUSTOMER_REFERENCE, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#customerReferenceInput').val());
  saveToSession(SESSION_KEYS.CUSTOMER_EMAIL, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#customerEmailInput').val());
  saveToSession(SESSION_KEYS.MERCHANT_UNIQUE_PAYMENT_ID, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#merchantUniquePaymentIdInput').val());
  saveToSession(SESSION_KEYS.CONTACT_NUMBER, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#contactNumberInput').val());

  // Save UI minHeight
  saveToSession(SESSION_KEYS.UI_MIN_HEIGHT, (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#uiMinHeightInput').val());
}

/**
 * Setup event listeners for automatic session storage
 */
function setupSessionListeners() {
  // Listen to all form field changes
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#apiKeyInput, #usernameInput, #passwordInput, #merchantCodeInput, #paymentAmountInput, #modeSelect').on('input change', saveSessionValues);

  // Listen to payment method toggles
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('.payment-method-toggle').on('change', saveSessionValues);

  // Listen to URL builder changes
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#domainSelect, input[name="subdomain"], input[name="version"]').on('change', saveSessionValues);

  // Listen to extended option changes
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#redirectUrlInput, #callbackUrlInput, #customerNameInput, #customerReferenceInput, #customerEmailInput, #merchantUniquePaymentIdInput, #contactNumberInput').on('input', saveSessionValues);

  // Listen to UI option changes
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#uiMinHeightInput').on('input', saveSessionValues);
}

/***/ }),

/***/ "./src/js/theme.js":
/*!*************************!*\
  !*** ./src/js/theme.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initThemeToggle: () => (/* binding */ initThemeToggle)
/* harmony export */ });
/* harmony import */ var _globals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./globals.js */ "./src/js/globals.js");
/* harmony import */ var _tooltips_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tooltips.js */ "./src/js/tooltips.js");
// Import dependencies


var THEME_STORAGE_KEY = 'zpTheme';

/**
 * Determine the initial theme based on storage, device preference, or default.
 * @returns {string} 'light' or 'dark'
 */
function determineInitialTheme() {
  var storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme) {
    console.log("Theme found in localStorage: ".concat(storedTheme)); // Added log
    return storedTheme; // Use stored theme if available
  }

  // If no stored theme, check device preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    console.log('Device prefers dark mode. Using dark theme.'); // Added log
    return 'dark'; // Use dark mode if preferred by device
  }
  console.log('No theme in localStorage or device preference found. Defaulting to light theme.'); // Added log
  return 'light'; // Default to light mode
}

/**
 * Apply the theme to the document and update UI elements.
 * @param {string} theme - 'light' or 'dark'
 */
function applyTheme(theme) {
  var lightIcon = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#lightIcon');
  var darkIcon = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#darkIcon');
  document.documentElement.setAttribute('data-bs-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme); // Save the determined/updated theme

  if (theme === 'dark') {
    lightIcon.addClass('d-none');
    darkIcon.removeClass('d-none');
  } else {
    darkIcon.addClass('d-none');
    lightIcon.removeClass('d-none');
  }

  // Re-highlight code if preview exists
  if (document.getElementById('codePreview')) {
    _globals_js__WEBPACK_IMPORTED_MODULE_0__.hljs.highlightElement(document.getElementById('codePreview'));
  }

  // Reinitialize tooltips for proper styling
  (0,_tooltips_js__WEBPACK_IMPORTED_MODULE_1__.reinitializeTooltips)();
}

/**
 * Initialize theme toggle functionality.
 * Handles theme switching between light and dark modes,
 * persists the theme choice in localStorage,
 * and updates UI elements accordingly.
 */
function initThemeToggle() {
  var themeToggle = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#themeToggle');
  var initialTheme = determineInitialTheme();

  // Set initial theme based on determination logic
  applyTheme(initialTheme);

  // Add listener for device preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (event) {
    // Only update if there's no user-set theme in localStorage
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      var newColorScheme = event.matches ? 'dark' : 'light';
      applyTheme(newColorScheme);
    }
  });
  themeToggle.on('click', function () {
    var currentTheme = document.documentElement.getAttribute('data-bs-theme');
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme); // Apply the new theme and save it
  });
}

/***/ }),

/***/ "./src/js/tooltips.js":
/*!****************************!*\
  !*** ./src/js/tooltips.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initPaymentModeTooltips: () => (/* binding */ initPaymentModeTooltips),
/* harmony export */   initTooltips: () => (/* binding */ initTooltips),
/* harmony export */   reinitializeTooltips: () => (/* binding */ reinitializeTooltips)
/* harmony export */ });
/* harmony import */ var _globals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./globals.js */ "./src/js/globals.js");
// Import dependencies


/**
 * Initialize all tooltips in the application.
 * @returns {void}
 */
function initTooltips() {
  // Initialize all tooltips
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new _globals_js__WEBPACK_IMPORTED_MODULE_0__.bootstrap.Tooltip(tooltipTriggerEl, {
      trigger: 'hover focus'
    });
  });

  // Destroy and recreate tooltips when collapsible elements are shown
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('.collapse').on('shown.bs.collapse', function () {
    // Destroy existing tooltips within the collapse
    (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).find('[data-bs-toggle="tooltip"]').tooltip('dispose');

    // Reinitialize tooltips
    (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).find('[data-bs-toggle="tooltip"]').tooltip();
  });
}

/**
 * Initialize tooltips specifically for payment mode info.
 * @returns {void}
 */
function initPaymentModeTooltips() {
  // Initialize payment mode tooltips
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('.payment-mode-info').on('mouseenter', function () {
    var currentMode = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#modeSelect').val();
    var tooltipText = '';
    switch (currentMode) {
      case '0':
        tooltipText = 'Payment mode using a static payment amount supplied via the payload, which cannot be changed after plugin initialization.';
        break;
      case '1':
        tooltipText = 'Tokenization mode, suitable for building wallets.';
        break;
      case '2':
        tooltipText = 'Dynamic payment mode, allowing the payment amount to be changed after plugin initialization.';
        break;
      case '3':
        tooltipText = 'Preauth mode for authorizing payments without immediate capture.';
        break;
      default:
        tooltipText = 'Select the payment processing mode';
    }
    (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).attr('data-bs-original-title', tooltipText).tooltip('show');
  });
  // Update tooltip when mode changes
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#modeSelect').on('change', function () {
    (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('.payment-mode-info').tooltip('hide');
  });
}

/**
 * Re-initialize tooltips for theme changes.
 * This should be called after theme changes to ensure proper styling.
 */
function reinitializeTooltips() {
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('[data-bs-toggle="tooltip"]').tooltip('dispose');
  initTooltips();
}

/***/ }),

/***/ "./src/js/urlBuilder.js":
/*!******************************!*\
  !*** ./src/js/urlBuilder.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initUrlBuilder: () => (/* binding */ initUrlBuilder),
/* harmony export */   updateRedirectUrl: () => (/* binding */ updateRedirectUrl)
/* harmony export */ });
/* harmony import */ var _globals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./globals.js */ "./src/js/globals.js");
/* harmony import */ var _extendedOptions_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extendedOptions.js */ "./src/js/extendedOptions.js");
/* harmony import */ var _codePreview_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./codePreview.js */ "./src/js/codePreview.js");
// Import dependencies




/**
 * Update the redirect URL based on selected domain and subdomain
 */
function updateRedirectUrl() {
  var domain = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#domainSelect').val();
  var subdomain = (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('input[name="subdomain"]:checked').val();
  var redirectUrl = "https://".concat(subdomain, ".").concat(domain, ".com.au/demo/");
  var callbackUrl = "https://".concat(subdomain, ".").concat(domain, ".com.au/callback/");
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#redirectUrlInput').val(redirectUrl);
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#callbackUrlInput').attr('placeholder', callbackUrl);

  // Update extended options
  _extendedOptions_js__WEBPACK_IMPORTED_MODULE_1__.extendedOptions.redirectUrl = redirectUrl;

  // Trigger code preview update if available
  if (typeof _codePreview_js__WEBPACK_IMPORTED_MODULE_2__.updateCodePreview === 'function') {
    (0,_codePreview_js__WEBPACK_IMPORTED_MODULE_2__.updateCodePreview)();
  }
}

/**
 * Initialize URL builder functionality.
 * Handles URL preview updates, modal tooltips, copy functionality,
 * and URL changes application.
 */
function initUrlBuilder() {
  // Get all the URL builder elements
  var subdomainInputs = document.querySelectorAll('input[name="subdomain"]');
  var domainSelect = document.getElementById('domainSelect');
  var versionInputs = document.querySelectorAll('input[name="version"]');
  var urlPreview = document.getElementById('urlPreview');
  var modalUrlPreview = document.getElementById('modalUrlPreview');
  var modalCopyUrlBtn = document.getElementById('modalCopyUrlBtn');
  var applyUrlChangesBtn = document.getElementById('applyUrlChanges');

  /**
   * Update the URL preview based on current form values
   */
  function updateUrlPreview() {
    var subdomain = document.querySelector('input[name="subdomain"]:checked').value;
    var domain = domainSelect.value;
    var version = document.querySelector('input[name="version"]:checked').value;
    var url = "https://".concat(subdomain, ".").concat(domain, ".com.au/online/").concat(version);
    urlPreview.value = url;

    // Also update the modal URL preview if it exists
    if (modalUrlPreview) {
      modalUrlPreview.value = url;
    }

    // Update redirect URL when domain changes
    updateRedirectUrl();

    // Update the code preview if available
    if (typeof _codePreview_js__WEBPACK_IMPORTED_MODULE_2__.updateCodePreview === 'function') {
      (0,_codePreview_js__WEBPACK_IMPORTED_MODULE_2__.updateCodePreview)();
    }
  }

  // Add event listeners to all URL builder elements
  subdomainInputs.forEach(function (input) {
    input.addEventListener('change', updateUrlPreview);
  });
  domainSelect.addEventListener('change', updateUrlPreview);
  versionInputs.forEach(function (input) {
    input.addEventListener('change', updateUrlPreview);
  });

  // Initialize tooltips for the modal when it's shown
  (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)('#urlBuilderModal').on('shown.bs.modal', function () {
    (0,_globals_js__WEBPACK_IMPORTED_MODULE_0__.$)(this).find('[data-bs-toggle="tooltip"]').tooltip();
  });

  // Copy URL from modal to clipboard
  if (modalCopyUrlBtn) {
    modalCopyUrlBtn.addEventListener('click', function () {
      modalUrlPreview.select();
      document.execCommand('copy');

      // Show success feedback
      var originalIcon = modalCopyUrlBtn.innerHTML;
      modalCopyUrlBtn.innerHTML = '<i class="bi bi-check-lg"></i>';
      setTimeout(function () {
        modalCopyUrlBtn.innerHTML = originalIcon;
      }, 2000);
    });
  }

  // Apply URL changes from modal
  if (applyUrlChangesBtn) {
    applyUrlChangesBtn.addEventListener('click', function () {
      updateUrlPreview();
    });
  }

  // Initialize URL preview
  updateUrlPreview();
}

/***/ }),

/***/ "./src/js/zpLogo.js":
/*!**************************!*\
  !*** ./src/js/zpLogo.js ***!
  \**************************/
/***/ (() => {

var base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABjCAYAAADeg0+zAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAM/JJREFUeJztXQdczd/7/9zR3lOiISV7JhlZWV8rOxWFBpVC+DaRUshqSEIqsqKByvgiEbJ95RsZJZumtO/6P8/l+uW6t25D/Lnv16tXde/ncz7nc855P+Oc5zyHmpWVRQghxK8OJTrDSypw2+p3azx61tJoOa31XCohhBC/OOQrq5aJz7Hxq1ntcRjI8bg1ny0kiBC/LMhksoRqVvZBsrPrFEJKivjUv+9ugkZjtWYdhAQR4peEmKhoT6WjiZGszUEGLBqNYK1cllFFp19u7XoICSLELwcZCnW6rO/6EOaJVHWStBRBSEoSFeNGR7JYLHpr10VIECF+GZBIJIpcZZWLlJ3TVmb+C4IkJ0uwKioJ8vQpL8qplCSCwWj1OgkJIsQvAfA3pFQeP42kLHY1Y9XUECRpaYJgfXY3qqzMYxgMRunPqJeQIEL8dIhSqXoqiScTmJu2dSfExAhCXPzzF7W1BLlPr8oKVZVYcM5/St2EBBHip0JWVHS2dMCmzczEE+1IMjJoZ339DjUJfZFNYk0rT+3WhZAgQvw0KNXS3CTmOwQwnjwlk2Rlv/2STifI6m2Jsp7do1F7iIiI6MOn7Wg02oXWrKOQIEK0OsAZp6q8eBVOXeRiywAnnCQr89Xf4IBVWUWwli/JqKDRzuH/JSUl5kwms0RWVlZIECF+X4hQqe1VzpyLY/muHwhqgSBJiH9HDvwfp3crx446gP+CAy+9f98+RwsLC8/Wrq+QIEK0GqRFRcfLBu8IYsUe0mPPUpHJPK9D7UGaNS23jEKOJZhM1DjDk0+cULG2tq5u5SoLCSJE60CewVwotcAhhPngP9Hv/A0eqLUwSwSTqhz+JGdcvryiuKgIiUK0NoQEEeKHAswjSaV379eJ2jotY34sI9jkYNUTTlVTQ5AN+paVqaqEEXS2c95j7549w8QlJIifASFBfnOg/V5dVWV/KT19VmFBAVlWTo4+2Nj4tKKiYiiDwSj5kc+mUihqqhcuJbLW+BmxKFSCJCVRPzkInNqtJZi21udq6bQ8/D//+XOnZ8+eIVGInwEhQX5jUCgU+cvp6alrfXwG1oJkplCpYNIzic2bNg20W7hwrpW19Rga7fNAbGlIioqOVAzeEc2IPaTx1d9oKA4Xp3bbqzNLevUIwaldqL/aroiIOfCb+FkQEuQ3RkFBwTIvT8+BUlJShDhndZpAIc4idmzfrtupU6ftBv37T4b/WzTISYHJWirptMyPceO2tCD+xtd6gXNOLHW6W0mjpeP/VZWVFpnXrklg3WuA4D8DQoL8pgCHVuTQgQNs6cstgdHZRdLsjogYP3DQoC61tbUPWuiZFIWi4tUSNo6rmcXFn9c3BAXOVklLERXjx0bgv7gX5Mjhw0totbWEqKgo8bMgJMhvCtQSb9++JfOz3algbhXDIKbT6S1i3AMJ5VSv3ThGuK8axQICkqQkGzap6ta3qgqjdl+Xkcn72OsgJJJJUlKShoSkJPEzISTIbwwxMTER9Dl4AQmEkhkkNZnfNYJCXERkgGJkTDQrYm9nNjFQYzV63x+JqLGyPAz1QluKBL6TR3FREVhosuy6/iwICfL7gjFm3Ljsf86ebVfX/0CgiVVZWUmM++uvIhh8L5vzEDkSeb70Sq9NzPTLSo3xN74Be2q3T/lHFaVt6KiDdusaExNjIMFV758BIUF+XzCNjY19BwwYMOrGjRskGRkZ1BZsaYzkUFZWJha7uKxgMBgfmlI4kExMsbTMXdzWwYf5/gPRZHIQn6N2WTbz0mh0+mv8/3lentvTx49FpWUa4cP8IAgJ8hsDnO+MoNDQMTFRUSEJ8fFdkBhoVo0YObLUzcPDCwZ5dFPKBX9DSeXOv1Hk5e6TWMzPcVNEU60g0BgkjfaMkt49AnBqF0isFLV370Sckv4V8GvUQogfBhqNdm6OldWAudbWg4AwZHTOwXF/CH8/b0p5YiIiPZSjY5OY4bt1cK84IUJpOjmIz1O7ZJfZ2dV0+k38H0g878qVKwriv4B5hRAS5A8AOOGf4NcZnO5FEwvI0aRy5CgUGxkPn42McxeU2FO4zY2NwqldGWni08S/AjlrMe/evm2Di5piP3Fqty6EBBFCEJCVP5WvE7Nb7MF484adTKElwKqqJqjTJheWU8gniC8zaWBi0X9GUCI/CAkiRL3AYEOVhzl7KM7LzVk0+jfJFJoFLAN4UDV/bgRouDLiFwWbIFBB24IPH7q0UVNbQTTLovx5wFVc6ExF+K0Av3vhZ6C2X8G7PcU/GQxG4Y98PpgvKvDsDnQ6/UYj72kP9dXFemJ9oZ4FRCsAnPW+8IsE5tZtvtdQqR2V4xISWNtCexLiEgQhLtYy5ECAmUfp1YNepKy050ckZEBiQ9tKwY82/K0NbVsEbYyJqGmNyZDCJsjjnJz+9jY29mv9/HobDRp0REpKigmdVwSdfacZFcTO743KEpuUs9hTd9EHKooOYwY851FTnoGrt/DSQ548fjz1RmZmv8zMTP1Xr15JgGPKnuvHH0VFxVrtDh2qjQYOvN69e/enGpqaGXDriS97DZoFeL4i/Br6MDt76r7o6PF9+vb9b/rMmcPruwfet9Ob168XX7p0qf/1zMyu8Lc0vD9ZRFSUqdG+fflgY+Ps0aNHHxKXkNgDdawkWhDw7J6lJSUTL1++PPnA/v2GARs27ID24EkQWarILGm/DVtYJ1Pbt4i/wQWM2qU72ifV0mjPW6pMjFyG8TXlQVaWacbly31hXCu/e/dOlg7jjAz1V23Tpqxjx45V4ydMON+1W7cIEA6XGiqTijE7r1+96oEO3Do/v5HQiCMlJCTYc+bQQfSamhoqrrQyP+/salSFxcTE2NOKSApeBCktLSUOx8VFguaybWRDyFZXVztE793rdCo1VaOgoIBgQf1gcJX+7eZ2WkNL6xm+z8fSUtkb168PT0lO7pSanDxaQlJytIKiosPIkSNzZ5ubp6q3axcMZHramGdje1GpVMNXL1+axh87NiftwoW2RUVF7GC6Xn368N3xBu2q++TJk2VBW7daZd2/L/3lM3acFLYrtAsZtLhs5rVrRiFBQUa29vbzLOfMWQadmE40A7ifAuo3Kf3iRdMTSUn98/PzSUBInN3Cr6t43aNQVf23pL3deubz5+SW8je+weeoXaK4R7dtLaE9UFuAY28Tu3//0uNJSTo4rqjQrlRoXxzHnHH78eNH2ewHD2QTExIsdHV1LTZt3boOBOj6+gQRahAmEEQBp/8kpaTYRICC2LE62traVANDw6daWlqlSoqKpSqqqhlkPtskeVSaAZW1h8po8Jqyq6qsJPobGla3a99+C3aYoIAOH3340KGtkbt3d8fZDiYQrkOHDkTg5s172mtoeINWes+5Vk1NjdDv3JmwsbMzvpyevgYEgAk+98Tx4zrHExMXjzQxsXD39PQkUygRDT0X2kOvpKRk+qmUFKuTJ092AcnPbnh8N84iHJmPAAHyOqzy9va/eP68gigIDWlpaX7PYAsVJHtYSEifO7dundmybZspSNkzgrYPBvnBT4+iwsIRQN4pJ0+cMHz54gUZpSjWFX+w3uXl5d8JPHi+quLT3HXURS52TEzeJiPTciZVHbC31C5dfI8ztdscQJ2HJCUkbA3fsaM/CE0Chbssn0VLFEac2LQXL14QZjNmeO/Zu7cDaNE5fMuHxlR+8/atJC7MoMmDU4AguZ5YzJmzCzr+FHz29Et8TKMAFemYl5vrjp3OTSokIQ4UP3//zUCOh4KWWVNd7b7Izm5tzqNHojLQCFjXIYMHF/pv2OAO9Yxk8ElNCdddBtNxXOzBg39bWVr6M+D52FgXLlxQvHHjxs5QaFwQAkugXhXc90L9nP85e3YGaCFDUNnijC8Djd8grwtU+aBpghc7Oi4oKysjZARcbSZBe8nJyxPXrl0TCwkOjnBcvLgf1K1IgOcNAw119EpGhgpqNdTWSDjcjSeI9le+fC2SsHeayAJBSYhQCVbZJ07Bn4MP+QADDQm6gBHzTAaaFsSnCeM2Q/2apT6qq6q8li5ZsvrRw4eikpKS7H7BsYXvjcKKXM8+ErwWtaiTg4Nl0smTmdB223ldhwTpnZeXp4kNiJ0fHhER0Ulf3wv+LmqMZK8LTOuSfPLkgVu3bknxYjNKLzcPj3tQSX9BA9EKCwq2Lpg3bxmaMjh4sIxhw4a9Xrtu3Xio5/2G7sfEx3BfwOagoO4O9vbmGO6NP0iyBdbWNmHh4R1A24zlTpD84f37oYcPHhyam5vLvl5CwK2fSI77//57Yomz8wj65/gioqKigmNOfe5EGHjYUfy0spycHHHk8GGt8RMnBmpqato09Ewo+43JqFHn3r55M7G4uFjmy6IgIShqdLQzRXeH1bLq3oPEKi2VoWwOHs2eiq1LNOw7/HF2uM3soJ0vkLaBMcZSUaqooJBTm5NrFzTkqrmWlr5o7aCwYv/IyDCgzUoryssl4f0l0NRCQchv0RHbBsdRaHCw17Llyw9gWiHua6gw4KQ+lZUxgY3kgI0bL3XU1V3EaGaSYFB1bsHbtg3gJWVxgHft2rV60uTJdsBggbJUFBcVbbECexz/xgGKqhQGDBPIsUgQctRF586dlw0eMmQ82Ppy2HDYSDhoYSCPPJaYuApIsKbu9eCnzDx45Ig+OOIbN65fb/o8L49tijYAMlx/3M7GZkTbtm2JiZMmvTA2Nk5XU1d/JCoi8qCisnL0u7dv5S+cPz/s7JkzGvg+/DoRNcAGf/8Fu/fuDYX2ulffQ6HfnnTr3h1t63ZQvouvj49rTk4OVdBV6ZI2Kv5EG5XvPgcpqqG6NTQfHkD6zlmHsVIxddLWMjL5INEYNGWMkUhsBoKpu2rK5Mm+aEI7OTvfMR469KS8vPwdIEM+tEE+WkXwu+vr169H79q5cwE47JKoYXhpURR6Z06fVlvs4jIX7g/h/p4KTJsCP+Q+ffvShg0f7tzUVVYOwCnv7uHmtor2ORveN9+h1ETyrfXz2wff3xKkPLjHBQaaKyc8G+/H1wzZvn09kCO5sfVDH2WuldW5jEuXpnNywKKkrQIzwRXUddS+faegDTLr3gN1zdHV05sSvX//4Jjo6P0xUVEdeA66Lx0IUs0H6jzS1s4uF5xtX+iY+LqzZmLi4ifAOSS69+ghs3DRonluK1duy8rKomBncWtUJAiYdqjJpigoKtZLEA6gXV4rq6i4RezZ84/H338fyszMVMZymgoyi1WvRCDR6OKE2I9f+YZ+KoXBb2NhZubr5OR039LKajH0J85KsjgTSQj4jdO4T9XV1U/4r18ffPnSpZDV3t5/cfyvb+oO/2Pf37xxY6rRwIHfEwRMFyZKMJelSxNgYDRKGvPC7Vu3AkA6i/Ezraznzctvo6bmLoiWwilR16VLA9B+l/yycQbNFJclSx6APb+2qfsEdDp2PCwhKTmd9XljDvsz1EwgbYmrGRleBoaGk3jdB0S5AuRyBZMrse69HIDGLINONAU/aRWYqkd69e7tDIO1gF89MQRERFQ0dHt4+NNF9vYnwLfiKe3x7vPnz5vOmDnTF28T9D1BW5+bMm3aP5fS082bQ5BfAWgqlX/6NCzAz88xYMOG+L79+lnCGGrQN8ZZykGDB093Xb48bVNgIE+rBgUkEEQTrpOAPvlmZo96984do3bt2jFBQm5sqs/BAbB7/to1ayZJ8tgFhhpFrW1bpo2d3WJ4jkDZNNLT03dcz8yUQlscgaRSUVEhZpqZrafRmj4/CA2Sg9IayVZ3OyrWOzQ0dPzBQ4cMaHQ6Tw0HouoRajIUKnXvxb/znz/vtCsiIjw0LCxARVV1NbynQHYECKZTgZs2BU6bMsWTF/HweRfT0npYWFp2g2sbdeoqCBnSrxS60RRwZgvX+fktnTx58k0gx+zGHKaDg9506tTV4M+dfv/+PYnbssH/H2Rl6UAfdoRrv9l+TAX7TN/M3PwWDL5mHXcL5JAPCQ7eAPYhzxkeHFB+/v6HBTWLoLxZWwIDTeqWheHa9g4O96GMo0TzIMbAMGuugYMNhVOir16/ntamTRveJiCJxNOWwHvTLlzoBSbaEujM0MZqN/Br1k2YMGFBUlKSGreAQfKBT0GBOssTjcTP3I3XkkDf9WNpKWvUmDH2IBsbLcnh/n+sFyy44btmzQBuguAkCY5b4MB3MxpUNF9GjxkT1dzjrd68fr0xKT5elRc5UFKPGzeuBBzk1YIIfpwFSzh2zL+kuPjr1Ch2NEqR8ePHBzV3evD9u3fWH+G9ec1IIWlgoJuaW1j4wHMEdsjQd+vWrVsFDO6YpmxhRSkHgmpfYmLi39zfYQeieVpVXT0CtEmrn9P3KwAJAn1yFcbPf00sgjXQyCgBTM0B3Foa2xeFLxBkOHx+t+5N1AOHD5vADTeaI2mg08Z4urvbifAIUUazCEmz0t3dDV7umSDlgQk0PO7IEZ26G/ZxAPY3NCyFFzzZ1Fk2KFcN7h3ot3atLdqdvEwPUZAu9+7eVQNzRhbapFHxW1+mbiWbGnwHJuhpZWXl5UAGCncmEiQdOJNior9IGHhrA9tWvV27Ju1+5ADG4VVlFRV6cVERlcq1IQvLp9NootxjGMNImpVOHrdeHk9MXPc8L4/EayEMtUfgli2pcN1uQct89PCh7bt378gydbZcIsuLi4vlLpw7l16XIJzZCxqGT+APEIkJ3zO+fM7+DVqrGiTQ0ydPOj569Ejs06dPbLuelzZDP+xhdrYiPM8A7j9NtCLgeff19PTKb968KVeXIJy1E3jv5mVX+H8OaINmZZBjsliP1dXVaws+fPiOIOyxwmCwuG2sZoe7g1RzB9+jvxQP0wqnz/r161c7ePBgT0Gnj5Fwp1JTB3FLUCSIvLx8UV5eHs+4GdLnm3n+jVEC0qAZDAwM7gwcPJhOIZP5qkvOAh5GfxKtj9oOOjrF165dk+M16/S7+BM/CxjxraigwOJngfBq32YRBFio7bNqlQc6vNyqn/klnMMvICAAyPGvoGXC4Ox6PTNTnbu8StBEtvb25zt06DCbaAUwfsKJqjjt27Fjx7vQUR0IIVocmKACBNAdaF9jQe9pFkHAFNhx/fp1vmseK/7++xY4rQGNkXxAhOEFBQUU7i2XaGZIiIv/nPyTrQgRERHBokGFaDRwWy+Mx0adMdJkgpBJJJt1a9f+xWvNA2ccgKmE6ZQpuObRqBmnwsLCNugbcJsYGMAHRDxH/OYgkYX8+JGA9iU1RmA3iSCYmiUsNNQbg8G4p3XZswFgcm3YuHEX/L7e2LLfv3+vy2ualD3jRCK16AYiIYRoCE0iyKtXrwKPHT2qzcsxR9PKcu7c3Lbq6u5NsePfvX3bndf0K85MVVdV9QGNFU8IIUQrodEEEaFSB3m5uy9AJ5p7GKNppKKqStjZ2zs19XCW+hYBi4uLuygqKRFCCNFaaBRBQLKLJiYkbH/+/DnPXVs4rbs1KCi5OesHFCqV71w3OO9kXT09zjZ3IYT44WgUQSorKrzCtm/vwy+cZMzYsUXde/Rwak7QY7t27TJBi3Th/hx3h925fdtw8JAh4twRl0II8aMgMEGoVGoHP19fF/QruNco8DOczXLz8PABcrxoToWUlJQKeO2wwwCzrKwsefiuPRDkCSGEEK0AgQiCwYM3rl/fee3qVXlZPuEkfuvWXQcSRTb3rAkFRcUSKo/ExfhZfl6eJDzLVExMbDMhhBCtAEE1yPR1vr5jeK15YBh77z59akaYmCwCJ73Zpg+Yb1dk5eTYWU+445FqamuJKxkZ00aamAgJIkSroEGC4P7ekODgzZzN8XXBWXBZ5++/rqH90o3AU319/dJbN2/Kc8dj4eLh0SNH+oKv0w1MuaaGPQshhMBokCAvX7zYnBgf356XY17+6RPhsHhxroysbEhzTSsOwJ95O3z48EdXr1wx4l5NR9/ncU6OGPx46HTsyDeXkRBCtBTqJQgMyEmeHh7WvPYgYHSuppYWy8LS0gG0R7OSD2MEL5TnIC4ufgwI8mqIsXECOOVGPOsEpAncsGFWZHT0Bnhui5zOyg3QXJq5z56t1+7QYV5zN2cJ8f8bfAmCG3+OxcX5vszP/y7hGZpWuCi4ITBwJ/w+29xKYLJpx0WLtu2NjkYz7RU873j3Hj18/3vwQJynFnn8WORUSsquUWPGDCJ+AF69fOmaduGCyXwbmz96/4VAwERtTOZvK0T4EuTTp0/eO8LCevM6Jw5nraZNm1ao3q6de0uYVi/y8y0qystZILmrcMoYSPd44aJFhxfa2c3jtS8CEy5sCgwc2LNXr72qbdpgQrUWWzjEBM9rfXycAzdt2sA51EUIPsCNXLU0QuxjWR9CQnw/8RuCJ0Ew3c5qL68VvBJW4yIg5nRyXrp0eUuc6wDaQyYmOnq+prb2WyDG18QRXbt12wjO+uz8/HxxbhMP10nQgXewt58fHRuLuXEXEC0AzE27PyZmnwiVWqWopBTe3CwvfwZYBCXncXdCTZX4HcGTIFczMnbcuXNHhNeaB25u37RlSyKQY19LVACk9MyLaWmykyZPxnMxvu73wCMR3L284uZbWVnx8oFw4bCyqoqwnjNn/vbwcFb79u2XNOdIAyivQ8KxY8e2bN7c60RyMuYMfkUI0TCgbygpZwaIjhqhV0uj/XYLuLwI4hjg72/CK70mkmPEiBGlYNq4tIR0xaMEjiclueEUsqycHM7pfqOudHV1V0+YOHFCakqKEq8D5Tn5qYBECxwcHQ1mzJrlAfVKbUJV7H19fDYmJSbKjx03rlxDUzNIqD0EAwmPt7hxU1bhzTu39ypKAh9jgXF9ikzWyiISEUD8wrF13xAEzBbVoC1bPD6VlRHcoezsrObgD3itWrWxpaQrOHdOUZGRnTCdj4qqKkb/ftNQ8Jx8d09Ph3t378bhGSC8sg6iJsFV9pDg4J5H4+JSFjk6pg0xNj4C5DkDJls+wafx4R6N2tra0ZfS02eFBgePxWzoqqqqhM/atfh+rwkh/gdMPUehkFi88gqgCY7HCix3n69wIOp+CYMeQjQALE3l3v29IgWFusSoEf7EL4xvCJKXl7c1MTGxvQwfx3yNj08mVURkc0skD4AB3MPDzW0d7h9Bf0JbS+saL6cYk8Tt2rMn1NzMjJ03mJe5hX4S1hk3cK1ZtWoE/D2iW7du5f0MDF6BL3NVXkGhDPwK9j55fI/HOTmDrl65on/v3j05zHCCEwFYh9CwsL3wfusIIb4FhcIkKcgTLOgrgteRAtB+zBcvyVIW84NFQjbrFCkrruW13QEtBjEypbdCyukgwj9wUEXaqUXEL46vBMFcVN4eHpa8Zo2+hJOUjx47dmFTstpxAwZ5z4idO09nXLokhbNkSBJJSUm++THB3HOJ2b9ffMG8eXZ4Lb8jCFCTIFGQCOBDSV+/fr0zkK7z11OGgNjML0cPoObBfe+cbPHrN27M7Kiru0KATV7/r6Z+WyLtKI1Oz2VYWVwivHyGknjl5UKBKSlJMF+/IajTLZaojTExo08Yl0bXaJ9TKy6WLVleMY5VXEIRuXFzEJF6RoeR9YBC9lvzoExU5BDB/LWbk00QPJXoyOHDoa9evSK4tQfryxkQa319I4AczU5uDR1mG+Dn53/q1ClVzhQydqKUlFS9B1mAFrCPO3Ysy2Xx4m3Z2dkUzqlOvICfI9EbStiM8V648Lhz1664zl26LBJwkxeFn/78Up9m9TiQnK8AgvIbvd4AbUvnd24HaE2BcjHhYmnJ2FErlE6dPce8dkMWzzbncRHBzvCOQuj0WTVy8ilzUTKJEP0imNif42XVNQTVfFZ5kdl0PMXqu1lQPAaan4UC3zWbTfDOfCUgnorG/RmbIBXl5Z67d+7sLs0ntxVmJwEnekVTKwWd3h7INTY9LW1eWFjYkFKu/L04sGDAP26wHBGR0N17995NTEgI3bljR280jzCAkkJpXD4xPLoNE8kNMDKqWOvntxaItEnQ7cEFHz4sgfb6ztTDOhQUFpKhc5uVKQaElCYvqY/HspUUF+sqKCgIXBa8V/e0CxeGUvgcovPi5ctubdXVBSqrmka7WbJl/SQ5J9cTrNt35fge7ImHp/LS8DW1BKummiC7ON4vtrV2qaqpySR44EFW1ghe74+fFRcVNXgwS32AcaiS8/BhL16CFfsfxrqMGJefC2NOZKCnr68znmEngiyvo/I4R3jJycm9fPXypRd2/jfcrscXYTCZeDjoyLdv3ojcuH69K0h9SRzQaNJ8PefjS8ZAdL7hOXyPI64LIFrGpMmTjf4aP9786JEjrvHHjuEhlWyS1T0Uk9PInNOcOMfLIfT19WuXuroe6d6jx2ZBjnxAhx7K6PkwO9vMZ82auXVPiapzDZH933+Sp1JTD437668A+P8DTlU3tLmLcxQ0vFfXe3fvzoqJijLENudegEVN57N6tRkQulZXV3cviUx+jZMY3OVhcCmUpwFCyHRLRITzmdOnFXmVhxMugevXm65bvz4O/LVt8D0m665XQ1UymZeI8KDJ8tsjolgH43Sw/0l4NDQKqO9OniLYx63habYEg06QO+tX073dDhbp6rgxamrqpnQlQ791rampQb/QPGz79iE4Rr6rL4yR4ODg0YpKSgnduncPg/fEE9AeNnQ8IK7pQVkymE7qTFra1LNnz6rxag8cP6tXrVrmtWqVqrq6egyUm415yqjAWBfoWGkVFRW+6jZg3bqpUJmpODA47OP3Nze+DFxmmzZtavG0pc/tx8IpYzzdiowpgrCywFQJQaU4NgoMrGhzS8tDFnPmDH6emzslLS1t3J3bt7Xevn0rij4FpyzOMWeYcnLg4MGPR40enQJ/H8boY0GyPV7PzLxwMDZ2xLt37wgkong9ppskdOzmwMChkbt3D8VjGlRVVYu916xZDnWI5nU91DVqg7+/RXlFhWhhQQF7AgE1Iq9j05D4xcXFova2tjbKyso27TU08JDVN7b29iFQn41ASJPQ4OB9+c+fK0Jdxd9DfTHtKq8tCpzy8P0dFy6cqd2hw8x9sbHtoc0anL2rpNMv1TjZD1Aym7GGeuTYeNL5izqs4uLPRGDhoCOhtCBIYG6RlBQJ0sABL2mmE88W63UMqsHYuTp9DP6kZ3BQkPPL/Hw1aIuv78/LIsDPYJCLODs5TQUtOlVJSYnQ09MrdPP0xFjAYzyuV9sXHX0lIyNDB2dloe3Y4VH8TprC8p8+eSJrZWnpAGPVQVdP7xO07ydql65dXY4nJ7sTAqKlzpqActABMaLV1op8+PBhHFTwfWOzoCBR4OeCprb2hfk2NhILbG1VodzO0PEa7HUMICLl88mxxXDdbSDia8xi35ijRQYOGhRpYGBwlEyh0ElfTpASoF6Ye4kEzwPBL3aH3/M0NTXjt2zbdpPy2e9gCVw+k4nlU1BLg7S99WXN5pn9woUboGEZaMdDWQLb63Atg9f5fPwA/VT4QUHOmexo5y7hvGgwtbxCE0a3lPjHMsNqObl0lgiVSZKUIGrExO7TWKwcuP4jr+Oe5eXlL7q5uX2Cvq/B07ka277wg3Yuz4BVXDS2nDt382wLCyY71Wwj2gOP5GYyGCL4G5NXFxCNQAvnh32Ae83V2rYNb+7Rb19MGTQ58Iy6b3yE5iz6QbkHKNTGuRUcEw/rUR8Z4btkaiMO2fxaPs7KEZ/36XPeDX4/h3qGEk1AU/sUTwWuYDLPsp1z+PmoyOUfNdDuUOer8P5XG/vcuiY0v/aFd8KoivDG+qec8jl93uzk1UII8TtDSBAhhKgHQoIIIUQ9EBJECCHqgZAgQghRD4QEEUKIeiAkSAtBTExsKIvF0qytrY3lc0mzcwpjmLhwG3DzgVlCmQxGezqDYQR/3yWTyfl0Op3nZq8/liAw2PpH7927G+e78WiFmpoa9oQ5/q+irMzo1bv39Y4dOx6k0enpgpR3MS1tTcrJkyPXBwam8Ap6rKqs9N+/b98kKoXCGD5ixAMdXV2B0hZRKBTF1OTkFAlJSRrcZwoEKYG6S589ffrk6zdvFMgkEmE9f747fN6ohOG5z55FQZ37YBTD9BkzMhUUFb8JPWcxmW7R0dHmeOovkJ5cWVkpya+smupqwtDI6MPQYcNMcD0KN0Nl//ff8cuXL7e1s7ePhv+DBKnTsydPDpeUlpIN+vef9eXd2+2PiTlXUFAgwp1tU0pKqhIjNFDiVJSXi8MA/+YCjCGEdolRUVHx43yGWywuX7q0ecf27aMKCws/R5ZC36u3a0csdXVN6NuvH57E/LRuOX8sQaBBZSP37OmFC0kYtqCjo8NeLispLiY9zsnBMI1eWlpa9j5+fvv09fUX1Ce5Md4ndt++EU+fPsXFs2nwUST3NbJycsfv3Lmz8t7du9STJ0/2Op6cjNuWGzzrpODDh9VrVq82Sj1zZgtntRtTwcYfO9Y/OztbChdY27Ztu27MuHHnBU1RBPU1hDLnvcjPZw8kGJAfgSDfXPPx40ftPbt29cKBCe/PmjR58hV+C4q4WAf3F7L+dwEpMzOzLwxE1UfZ2YHbw8MzoZ48gxPr4u6dOz3z8vMpUB/ORwx1dfW3kpKSInVDmXAhLykx0ejZs2dU/HzGjBmPNTU139atH7aLmKjo12hheI8+qzw9L6ekpEg5u7i8mDZ9+k5xcfGyoqIijd27di2Yb2U1zcHJqc9CB4fhdfNL/7EEATAxOwo2pOnUqXkLbGyMoYExHIFaWlo6Z4mzc8DzvDzCfsECq5CwMFHQKPP4BcYVFRbOf/LkCQkHCkgo6yHGxnsJLnMKvrseuGnT1hnTpv39sbSUiNqzZ/N8W9vU+oIZUeItd3VdAlL4MZDYq84AYMnJyVXBwJHCqGjQTP3GT5zYE54hUMAnvJfl65cvMdSDvdoPWuK79yJTKDRsH3ynKdOmPRw/YUKDB1/WHaCSEhLVSkC6u3fvioCmPjTX2ro3O+SkHojDPdJSUl+XvuH6d8NHjhzJ61oYxDdDQ0IMMC5uoaPjEhB09WlQ8j9nz24HUklt2rLlJgiTSXD/e/xCWUWF8F69Oqhnz56Jq729jQwNDUN79u49jSMQ/2SCfAWFTIZxQPsaqAeDbv2uPXs+zZg6NRQDH73c3WefSE29zstUwPxhR+PiZiPRMAr1yKFDBmAK6UAHPOO+Vl5BYZ25hcUUGNCdDh06pD3DzMwHBqEbn2qRbt286fP61SvCbuHCACDSt4P4S0QxSnjcx/Pwv/9W6HbqZN7Qu2Jk8q6IiHmChrigtIZ3QfHdaB8KY+twzw9oau3+hobRep06TSVaCFinrxHbTKYYUU9ICbxzz6jIyAEY4Dl67FgPDjnq1PPd1OnT7YBEV9b6+ExOOnmyLxKQfS8hBPY6O7SJqLPZCSTS9hmzZrlAw+pVgxly7erVMYMGDw4huDZEQSeNP33qlLYGND7uc3n06JEE2Mx2CgoK3wWAYvj0AlvbDSeOH99bVlZGbPD3dwjYuDEYOugN97VgBpl6uLlNW+vr+w/c913OKbCdSWPGjq2CeonDACDBoDfdEhTUFlO31veuYK+b/nvvnqzJqFHEpXSB3KsmAX0bPG0Mf6Odv2L58inxCQkrgZibiFYGrbZW6f379xRlZWXsVzqvoFgQcA+cnJ0ToZ7WICwNoF+FBGkIRgMHXoncvVsPHXcYVH3AdJLkSi1Evnblih2YKlXr1q8/ZTtv3jQcEAnHjs0Aqe+PhOBRbOzyFSusVnl7D79y5YpMzqNHW3X19L45+x33bh88cGC1opJS7bDhw71qabTvIlE/ffokDjZzGphCfU+lpKiBKSMBBLWXkZVdy+99QNtJ7YuJcYUy80eNHv3u7JkzA4gfBHDqKWPHjSvt2rXrSy9Pzx6432j5smU+4bt2XYfBeIloRYA/yUBtC445atsZqqqqPCVDl65dt6WeOnUS6prEMReFBKkHYOff5+xnB6mCNsk3sf4guXV2hIWNsZ437yI4kwvBdh114/p12dSUlI5AkBFwyQnuMtGRHmFi4qUXE3MxNzdXxNfHx+xQXBymcL3Iuaa2pmbZ9pCQPkeOHg0BctzkVTcYZGJQv4dWVlZZycePu2GEb+z+/faOixdvhGfwPAsc3mMoOPcdDsfFYbZ+NbjuhxGEYJ8UTqoAH8IMtNWV9LQ0haysLElw/HfNB38PpHijosibA/DlqOhPYdqqFa6uTvtiY9H8/c5cBrPqX/j1b93PhASpB2/fvDFi73yEvzvp62fDgPrGoS4qKrJD+x8GwU7cI2E5Z84Z0CgzcXPO7Zs3F/fp1+8Er3KBDFfX+PpGWFlaLn4JznJifPzOSaamvXASABPY+axevQL8mBKwmbfUF6oP5VA0NDW3a+vouKGvcio1VR20ymT4Ko7H5SQwqVaCs08H0yfsw4cPAps6oEHZ28mJRqKmpkYCiPxwtY/PnFlZWSmY/yw6Kkq/Z69eR3v36TOcaCWAkHs0ZMiQktTUVIUP796R5pibbwsLD5cDDY3mbWl99woJQrDVAnuDaN3PQDu0TYiPH4e7+3A/uLGxMU5zfh2tmDL1wP79ZiYmJm/h2rNIpB49e+5UUlaeiemHYmNjhwwwMtIHDZDD65laWlqbgQTz0i5ckAb/QX/CxInmoAWin+fm+sBnKucvXnRs6Dg7IIgE/Dy3tbNL83J3H4ETBWBueY6fOBFNhG822MB7dAOtNMJ5yZJ/8B68V5C2QQ1a8OGDArzjPDAZ/zeN9nmCoBjKOdnA/WiWpgaFhkbNtbCYjxMZ3p6ew44mJPjD315EKwDzuC1bseLvjIyM3TitjQLMbMYMHxt7e0sLS8tl8A4p/O4VEoRgN6AYLm5xBhV0vNaVjIwYkLiyuCV42fLlWbJycsF1nTuwH0aeSErSio6NDeEsDML91/8aP/41EKdd1v37EiUlJXOlpKW9+Twz383Dwxuc7CBMZbQzPNwPnlPh4e4+e5GDQy6YBdENJQb/MrlAgG+0TVFRcUR5RQVxIDa21+QpUwZCp39jZ4OmWgT1IYyHDg1tzM5NNE3Ap2oLP1F1p3Er4VkzZ89+B3Vt20AR7Dq2a9dumevy5X0DN27shVOzzo6O7jGxsRlQz1NEKwCIGhm9f38P2/nzXbAdcHt0eFiY3snjx5PXb9y4Q1NLy5vXAu8fTxCUaCnJyVoVFRV5hgMGXAYpLJ2YkDDm8qVLIriv3HPVqktjxowxx6nAuveBg+0iJy/P0tDQ2M3Z1YY77GbOmhV1+OBBb3RKodzJZubma/gtMoqLi++2mjfPNSI8XPPs2bPt8/Ly4pCQc62tHYBAAh9nB+VfnDJ9el5UZGSH169fEw/u33fW79LlK0Fwe/POsDCzWbNnP4H3SG5M+6DdPn3GjEIbW9sdzDoEQa0qISn5liXgbkRcAzGdOtX26tWr5zKvXZPLy80lb9u6NXLpsmWGrZQHGdeOloDmuh24YcNGMEfVcH86Ou5Wc+Y4WllbjwS/cTn0/zepa/94guDg7mdg8B5MnAOPc3JGgRRmjjQxubFw0aInunp6iTAATnBLXNAwursjIoYsdXU9x32ID9i1Ef0HDHC5kZkpGx8f38NizhwTGAA8z1ABQlXOmTt3SWpycjyGPoA2ISJ27z7K73p+wNmyWWZmm0FzhaHWAW00dfuOHbo0Op0dNkGrrV1w+fJl5RQvrw1EI30J9IG0tLXfi4iKruH+rrFbdWHw3VoXEOAxfcqUHUi8+KNH2w4YMCCmv6HhKIJotfy8+zy9vdNNp0zZBL7eTPDF2FoSfKPOt27dOhkeEWEB73yEc7GQIEAQ8AdKQMX+DT/ffMdvAIANu+DJkyeiMKjlHmZn78MEApzvKBQKU4RKZbDzZL1/T2RnZ8/t1KkT3wEPnZEEDvp/O3fs6IGr4vqdO0c15T1AGx0YOmyY34Xz5xUfPHhALigsnC8vL482PgmIuqBnz561UP7hxu7P/zKDx0ks3uxBDG0Vvi0kZNB8K6s5ODBXe3uPjIuPXycjI9Mq/ggCzVto51nw3IkxUVGb4Kcztv1/WVlk8OWi/TdsuAnX5OK1fzxB2CvFDAYOgG8WCvkBbFnpuMOHzcHmZ15OT9c7e/p0d67yWGB61EpgKk4g2L7o6Glg4/5d3wJe3VAP0ABiTUk0APd9nG9jc/DcP/8sxneK2rvXAWx+X9B2xvtjYnruiIjY/ask5QaBtGixs3Pf4KCgrpiSycXJacXBw4dvwCCtgK9liVYCmpvW8+dfNjA03LPMxWUGJmxPT08Xz83NXampqekIl7D+eII0FiBGRx47elR7d2TkbtA4y3hdAwNcITQ4+Dpcp3771i3JqsrKuaJiYoH8ymTW0UDNQfv27YP19fUXYRDfhXPnFFasXDkBpOJUdEh1dXUjmps5pqXA9tXMzCzAj7v67717ki9fvhTdumXLXgUFhWoREZE3RCsCfaMuXbqYg+kn47Zy5VgqCKeUkyenOzk7r8RFYSFBGglwMl1QHXfQ0cEzRCp4XYOfz7awiIo/dswLne7Tp05ZgIMaxD312tJAs8DGzi5tpavraHSiwXQIAoLKOS5efAnIcZf4hQBm27+Bmzcvm2ZqyiZuakqKImo+C0vLfKKFgdsD4Ncs0KY4a/Zdilucvh84aJBb586dh+G5mOXl5WhNsMOHhQRpBEC6ddm1c6cxOPDpIHly6rtWVVX1IDT48pycHPGjcXG9ZsyaNRQGwrkfXEWm4YAB61VUVUdXfJ7y1cD8YCajRm1jMH+9NOowcHdtCQoaardggSX6I1jnH4EP7997z5wxwy0xKSlAQVGRp68DffNvv379cm7fvt1LrW1bXDxkO2tCgjQCRUVFeGai6KgxY/Y2tLMPJFU2aJErq7y8THDqNffp0+ntNTV/NEHQfLk2y8zsSdj27Xookc1mz84Fz/oC8YsCTD87Wzs7A1wspVJ/zHBUVlF5iKZTaEiI3Vo/v1DuKXsECL92uc+fa+DfI4YPT8EZRvxbSBABgYF+UZGRDsOGD/8APka8IAJ58JAh8TIyMiY4pXnw4MGpHl5eq390DBLGYU2ZNi0wcs8e9vqMmbn5juYctvplxbxJoSaCAPfDgKPscO3q1bN37tz5IeMR+u6gm4eHI/gYhv0NDZMnm5rOwGgCzve4lTn/+XPv9AsXFEGL1Grr6IRxZvv+ZILgNlL2hqnqqirRhi6GgTI5MSFB5fCRIyHoZAryACDSAWNjY9/ExERl8EPauC5fPpUqIrKL+7qa6mpRrAt2CvgOvLOAcwHMESqDTue5qUNMTOy4gaFhcHFRER7EmsgrPSedRhPBZyIB6DzKgXek4vcYapOUkNAJfKk0ftn8sQ27de9e1KNnT0vOpjK4Vwzuqf+Alv/dnwamluf4sWMDmQKu8lfXaTMmi1Vvm2GA6ISJEx3A3E1e4+3d79bNm3cXOjjsVVFReQp1FL908eLc9QEBfbS0tVnB27fbQplf/ZQ/liAgFcscHB3/xRVvAwODFw1dX1paauDo5PSvhpbWbpqAya9Rci9yctqjpq7+Fw6uouLiIW3atPmOIP0HDMC9CEw0A0TFxBpMIo3m3Vxr6ztgK+fx+h46uGD5ihWhMPAoUNdcXtdodejwGJ7ZBusFA+M7f0peTi7fAd4X96RDGeTCwkINgs9sG563Ao4thuuQv6wdsUaMGHGXzmQi8QTyfcBX2gZO+/BbN25oCHK90cCBD0hkMgPbTExUtKQh9QZtcWfpsmVGo0xM/ENCQswWWFu7ciK18YBYD0/PKxMmTdoM75pU977/A+ZleTCOlJjXAAAAAElFTkSuQmCC';
window.addEventListener('DOMContentLoaded', function () {
  var logoImg = document.getElementById('logo-img');
  if (logoImg) {
    logoImg.src = base64Logo;
  }
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _main_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main.js */ "./src/js/main.js");
/* harmony import */ var _errorCodes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./errorCodes.js */ "./src/js/errorCodes.js");
/* harmony import */ var _errorCodes_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_errorCodes_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _zpLogo_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./zpLogo.js */ "./src/js/zpLogo.js");
/* harmony import */ var _zpLogo_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_zpLogo_js__WEBPACK_IMPORTED_MODULE_2__);



})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map