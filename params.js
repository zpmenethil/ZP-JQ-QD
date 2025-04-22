/**
 * ZenPay Parameters Reference
 * 
 * This script manages the display and filtering of input and return parameters
 * for the ZenPay Payment Plugin.
 */

// Create a self-executing function to avoid global namespace pollution
(function() {
    // Input Parameters data structure with modes, requirements and conditions
    const INPUT_PARAMETERS = {
        "url": {
            name: "url",
            dataType: "string",
            requirement: "required",
            modes: [0, 1, 2, 3],
            description: "Plugin access url. We strongly recommend v4 integration.",
            category: "Core"
        },
        "merchantCode": {
            name: "merchantCode",
            dataType: "string",
            requirement: "required",
            modes: [0, 1, 2, 3],
            description: "As provided by Zenith.",
            category: "Core"
        },
        "apiKey": {
            name: "apiKey",
            dataType: "string",
            requirement: "required",
            modes: [0, 1, 2, 3],
            description: "As provided by Zenith.",
            category: "Core"
        },
        "fingerprint": {
            name: "fingerprint",
            dataType: "string",
            requirement: "required",
            modes: [0, 1, 2, 3],
            description: "The Fingerprint is a SHA3-512 (v5), SHA512 (v4) or SHA1 hash (v3) of specific fields in order with pipe separator.",
            category: "Core",
            details: "Generated from: apiKey|userName|password|mode|paymentAmount|merchantUniquePaymentId|timestamp"
        },
        "redirectUrl": {
            name: "redirectUrl",
            dataType: "string",
            requirement: "required",
            modes: [0, 1, 2, 3],
            description: "The page will redirect to this URL with the result in the query string.",
            category: "Core"
        },
        "mode": {
            name: "mode",
            dataType: "int",
            requirement: "optional",
            modes: [0, 1, 2, 3],
            description: "Must be one of the values: 0 (Make Payment), 1 (Tokenise), 2 (Custom Payment), 3 (Preauthorization). Defaults to 0 if not provided.",
            category: "Core",
            defaultValue: "0"
        },
        "customerName": {
            name: "customerName",
            dataType: "string",
            requirement: "conditional",
            modes: [0, 2],
            description: "Required if mode is set to 0 or 2.",
            category: "Customer Info"
        },
        "customerNameLabel": {
            name: "customerNameLabel",
            dataType: "string",
            requirement: "optional",
            modes: [0, 1, 2, 3],
            description: "Custom label to override default customer name display text.",
            category: "UI Customization"
        },
        "customerReference": {
            name: "customerReference",
            dataType: "string",
            requirement: "conditional",
            modes: [0, 2],
            description: "Required if mode is set to 0 or 2.",
            category: "Customer Info"
        },
        "customerReferenceLabel": {
            name: "customerReferenceLabel",
            dataType: "string",
            requirement: "optional",
            modes: [0, 1, 2, 3],
            description: "Custom label to override default customer reference display text.",
            category: "UI Customization"
        },
        "paymentAmount": {
            name: "paymentAmount",
            dataType: "number",
            requirement: "conditional",
            modes: [0, 1, 2],
            description: "Required if mode is set to 0 or 2. Returns applicable fee if provided with mode 1.",
            category: "Payment Details"
        },
        "paymentAmountLabel": {
            name: "paymentAmountLabel",
            dataType: "string",
            requirement: "optional",
            modes: [0, 1, 2, 3],
            description: "Custom label to override default payment amount display text.",
            category: "UI Customization"
        },
        "allowBankAcOneOffPayment": {
            name: "allowBankAcOneOffPayment",
            dataType: "boolean",
            requirement: "conditional",
            modes: [0, 2],
            description: "Required if mode is set to 0 or 2. Show bank account option only if enabled for the merchant. Default is false.",
            category: "Payment Methods",
            defaultValue: "false"
        },
        "allowPayToOneOffPayment": {
            name: "allowPayToOneOffPayment",
            dataType: "boolean",
            requirement: "conditional",
            modes: [0, 2],
            description: "Required if mode is set to 0 or 2. Show PayTo bank account option only if enabled for the merchant. Default is false.",
            category: "Payment Methods",
            defaultValue: "false"
        },
        "allowPayIdOneOffPayment": {
            name: "allowPayIdOneOffPayment",
            dataType: "boolean",
            requirement: "conditional",
            modes: [0, 2],
            description: "Required if mode is set to 0 or 2. Show PayID option only if enabled for the merchant. Default is false.",
            category: "Payment Methods",
            defaultValue: "false"
        },
        "allowApplePayOneOffPayment": {
            name: "allowApplePayOneOffPayment",
            dataType: "boolean",
            requirement: "conditional",
            modes: [0],
            description: "Conditional if mode is set to 0. Show Apple Pay option only if enabled for the merchant. Default is false.",
            category: "Payment Methods",
            defaultValue: "false"
        },
        "allowGooglePayOneOffPayment": {
            name: "allowGooglePayOneOffPayment",
            dataType: "boolean",
            requirement: "conditional",
            modes: [0],
            description: "Conditional if mode is set to 0. Show Google Pay option only if enabled for the merchant. Default is false.",
            category: "Payment Methods",
            defaultValue: "false"
        },
        "allowLatitudePayOneOffPayment": {
            name: "allowLatitudePayOneOffPayment",
            dataType: "boolean",
            requirement: "conditional",
            modes: [0],
            description: "Conditional if mode is set to 0. Show Latitude Pay option only if enabled for the merchant. Default is false.",
            category: "Payment Methods",
            defaultValue: "false"
        },
        "showFeeOnTokenising": {
            name: "showFeeOnTokenising",
            dataType: "boolean",
            requirement: "conditional",
            modes: [1],
            description: "Required if mode is set to 1. Show the applicable fees for the token at the end of the process. Default is false.",
            category: "Tokenization",
            defaultValue: "false"
        },
        "showFailedPaymentFeeOnTokenising": {
            name: "showFailedPaymentFeeOnTokenising",
            dataType: "boolean",
            requirement: "conditional",
            modes: [1],
            description: "Optional if mode is set to 1. Show the applicable failed payment fees for the token at the end of the process. Default is false.",
            category: "Tokenization",
            defaultValue: "false"
        },
        "merchantUniquePaymentId": {
            name: "merchantUniquePaymentId",
            dataType: "string",
            requirement: "required",
            modes: [0, 1, 2, 3],
            description: "Payment ID provided by the merchant. Must be unique and cannot be reused if a transaction is processed using this ID.",
            category: "Payment Details"
        },
        "timestamp": {
            name: "timestamp",
            dataType: "string",
            requirement: "conditional",
            modes: [0, 1, 2, 3],
            description: "Required for v4 and optional for v3. Provide current datetime in UTC ISO 8601 format (yyyy-MM-ddTHH:mm:ss).",
            category: "Core"
        },
        "cardProxy": {
            name: "cardProxy",
            dataType: "string",
            requirement: "optional",
            modes: [0, 2, 3],
            description: "Use this parameter to make a payment using a card proxy which is generated using mode '1'.",
            category: "Payment Details"
        },
        "callbackUrl": {
            name: "callbackUrl",
            dataType: "string",
            requirement: "optional",
            modes: [0, 1, 2, 3],
            description: "The URL will be called with HTTP POST method to submit the result.",
            category: "Core"
        },
        "hideTermsAndConditions": {
            name: "hideTermsAndConditions",
            dataType: "boolean",
            requirement: "optional",
            modes: [0, 1, 2, 3],
            description: "This will hide the Terms and Conditions. Defaults to 'false' if not provided.",
            category: "UI Customization",
            defaultValue: "false"
        },
        "sendConfirmationEmailToMerchant": {
            name: "sendConfirmationEmailToMerchant",
            dataType: "boolean",
            requirement: "optional",
            modes: [0, 2, 3],
            description: "This will send confirmation email to merchant. Defaults to 'false' if not provided.",
            category: "Notifications",
            defaultValue: "false"
        },
        "additionalReference": {
            name: "additionalReference",
            dataType: "string",
            requirement: "optional",
            modes: [0, 1, 2, 3],
            description: "Additional reference to identify customer. This will be passed to the merchant reconciliation file (PDF & CSV).",
            category: "Customer Info"
        },
        "contactNumber": {
            name: "contactNumber",
            dataType: "string",
            requirement: "optional",
            modes: [0, 1, 2, 3],
            description: "Contact number",
            category: "Customer Info"
        },
        "customerEmail": {
            name: "customerEmail",
            dataType: "string",
            requirement: "conditional",
            modes: [0, 1, 2, 3],
            description: "Email address to which invoice will be emailed if the merchant is configured. It is mandatory in V4.",
            category: "Customer Info"
        },
        "abn": {
            name: "abn",
            dataType: "string",
            requirement: "optional",
            modes: [0, 2, 3],
            description: "Australian Business Number. Used for reward programs if the Program is enabled to provide reward points.",
            category: "Customer Info"
        },
        "companyName": {
            name: "companyName",
            dataType: "string",
            requirement: "optional",
            modes: [0, 1, 2, 3],
            description: "Customer company name.",
            category: "Customer Info"
        },
        "title": {
            name: "title",
            dataType: "string",
            requirement: "optional",
            modes: [0, 1, 2, 3],
            description: "Plugin Title. Defaults to 'Process Payment' if not provided.",
            category: "UI Customization",
            defaultValue: "'Process Payment'"
        },
        "hideHeader": {
            name: "hideHeader",
            dataType: "boolean",
            requirement: "optional",
            modes: [0, 1, 2, 3],
            description: "This will hide the program header including program logo. Defaults to 'true' if not provided.",
            category: "UI Customization",
            defaultValue: "true"
        },
        "hideMerchantLogo": {
            name: "hideMerchantLogo",
            dataType: "boolean",
            requirement: "optional",
            modes: [0, 1, 2, 3],
            description: "This will hide the merchant logo if any. Defaults to 'false' if not provided.",
            category: "UI Customization",
            defaultValue: "false"
        },
        "overrideFeePayer": {
            name: "overrideFeePayer",
            dataType: "int",
            requirement: "optional",
            modes: [0, 2, 3],
            description: "Must be one of the values: 0 (Default - based on pricing profile), 1 (Merchant will pay the fee), 2 (Customer will pay the fee). Defaults to 0 if not provided.",
            category: "Payment Details",
            defaultValue: "0"
        },
        "userMode": {
            name: "userMode",
            dataType: "int",
            requirement: "optional",
            modes: [0, 2, 3],
            description: "Must be one of the values: 0 (Customer Facing - default, cardholder must enter CCV or 3DS), 1 (Merchant Facing, for merchant use only - no CCV or 3DS) - if supported by merchant options.",
            category: "Core",
            defaultValue: "0"
        },
        "minHeight": {
            name: "minHeight",
            dataType: "int",
            requirement: "optional",
            modes: [0, 1, 2, 3],
            description: "For Mode 0 and 2 height defaults to 725px, for mode 1 height defaults to 450px if not provided.",
            category: "UI Customization"
        },
        "onPluginClose": {
            name: "onPluginClose",
            dataType: "function",
            requirement: "optional",
            modes: [0, 1, 2, 3],
            description: "Javascript callback function to execute when plug-in is closed.",
            category: "Events"
        },
        "sendConfirmationEmailToCustomer": {
            name: "sendConfirmationEmailToCustomer",
            dataType: "boolean",
            requirement: "optional",
            modes: [0, 2, 3],
            description: "This will send confirmation email to customer. Defaults to 'false' if not provided.",
            category: "Notifications",
            defaultValue: "false"
        },
        "allowSaveCardUserOption": {
            name: "allowSaveCardUserOption",
            dataType: "boolean",
            requirement: "optional",
            modes: [0],
            description: "This will allow to save the card information. Defaults to 'false' if not provided. This option will only work if 'Enable Plugin Pay & Save Card' option is enabled at program or merchant level.",
            category: "Payment Methods",
            defaultValue: "false"
        }
    };

    // Return parameters for Mode 0 and 2 (Payment and Custom Payment)
    const PAYMENT_RETURN_PARAMETERS = {
        "CustomerName": {
            name: "CustomerName",
            dataType: "string",
            description: "Same as input parameter.",
            category: "Customer Info",
            applicableModes: [0, 2]
        },
        "CustomerReference": {
            name: "CustomerReference",
            dataType: "string",
            description: "Same as input parameter.",
            category: "Customer Info",
            applicableModes: [0, 2]
        },
        "MerchantUniquePaymentId": {
            name: "MerchantUniquePaymentId",
            dataType: "string",
            description: "Same as input parameter.",
            category: "Transaction Details",
            applicableModes: [0, 2]
        },
        "AccountOrCardNo": {
            name: "AccountOrCardNo",
            dataType: "string",
            description: "Account or card number used to process payment.",
            category: "Payment Method",
            applicableModes: [0, 2]
        },
        "PaymentReference": {
            name: "PaymentReference",
            dataType: "string",
            description: "Payment reference. (applicable for Payment)",
            category: "Transaction Details",
            applicableModes: [0, 2],
            conditional: "Payment mode only"
        },
        "PreauthReference": {
            name: "PreauthReference",
            dataType: "string",
            description: "Preauthorization reference. (applicable for Preauthorization)",
            category: "Transaction Details",
            applicableModes: [3],
            conditional: "Preauthorization mode only"
        },
        "ProcessorReference": {
            name: "ProcessorReference",
            dataType: "string",
            description: "Processor reference.",
            category: "Transaction Details",
            applicableModes: [0, 2, 3]
        },
        "PaymentStatus": {
            name: "PaymentStatus",
            dataType: "int",
            description: "Payment status code:<br>0 => (Pending)<br>1 => (Error)<br>3 => (Successful)<br>4 => (Failed)<br>5 => (Cancelled)<br>6 => (Suppressed)<br>7 => (InProgress)",
            category: "Status",
            applicableModes: [0, 2]
        },
        "PaymentStatusString": {
            name: "PaymentStatusString",
            dataType: "string",
            description: "Payment status in string format:<br>Pending<br>Error<br>Successful<br>Failed<br>Cancelled<br>Suppressed<br>InProgress",
            category: "Status",
            applicableModes: [0, 2]
        },
        "PreauthStatus": {
            name: "PreauthStatus",
            dataType: "int",
            description: "Preauthorization status code:<br>0 => (Pending)<br>1 => (Error)<br>3 => (Successful)<br>4 => (Failed)<br>5 => (Cancelled)<br>6 => (Suppressed)<br>7 => (InProgress)",
            category: "Status",
            applicableModes: [3],
            conditional: "Preauthorization mode only"
        },
        "PreauthStatusString": {
            name: "PreauthStatusString",
            dataType: "string",
            description: "Preauthorization status in string format:<br>Pending<br>Error<br>Successful<br>Failed<br>Cancelled<br>Suppressed<br>InProgress",
            category: "Status",
            applicableModes: [3],
            conditional: "Preauthorization mode only"
        },
        "TransactionSource": {
            name: "TransactionSource",
            dataType: "int",
            description: "Transaction source code:<br>36 => (Public_OnlineOneOffPayment)",
            category: "Transaction Details",
            applicableModes: [0, 2, 3]
        },
        "TransactionSourceString": {
            name: "TransactionSourceString",
            dataType: "string",
            description: "Transaction source in string format:<br>Public_OnlineOneOffPayment",
            category: "Transaction Details",
            applicableModes: [0, 2, 3]
        },
        "ProcessingDate": {
            name: "ProcessingDate",
            dataType: "datetime",
            description: "The date and time when the payment is processed.<br>Format: yyyy-MM-ddTHH:mm:ss",
            category: "Transaction Details",
            applicableModes: [0, 2, 3]
        },
        "SettlementDate": {
            name: "SettlementDate",
            dataType: "date",
            description: "The date when the payment is settled to the merchant.<br>Format: yyyy-MM-dd",
            category: "Settlement Details",
            applicableModes: [0, 2]
        },
        "IsPaymentSettledToMerchant": {
            name: "IsPaymentSettledToMerchant",
            dataType: "boolean",
            description: "Flag to indicate whether the funds are settled to the merchant or not.",
            category: "Settlement Details",
            applicableModes: [0, 2]
        },
        "BaseAmount": {
            name: "BaseAmount",
            dataType: "decimal",
            description: "Same as payment amount.",
            category: "Amount Details",
            applicableModes: [0, 2, 3]
        },
        "CustomerFee": {
            name: "CustomerFee",
            dataType: "decimal",
            description: "Fee charged to the customer to process the payment.",
            category: "Amount Details",
            applicableModes: [0, 2, 3]
        },
        "ProcessedAmount": {
            name: "ProcessedAmount",
            dataType: "decimal",
            description: "Base amount + Customer fee. (applicable for Payment)",
            category: "Amount Details",
            applicableModes: [0, 2],
            conditional: "Payment mode only"
        },
        "PreauthAmount": {
            name: "PreauthAmount",
            dataType: "decimal",
            description: "Base amount + Customer fee. (applicable for Preauthorization)",
            category: "Amount Details",
            applicableModes: [3],
            conditional: "Preauthorization mode only"
        },
        "FundsToMerchant": {
            name: "FundsToMerchant",
            dataType: "decimal",
            description: "Base amount - Merchant fee, if applicable.",
            category: "Amount Details",
            applicableModes: [0, 2, 3]
        },
        "MerchantCode": {
            name: "MerchantCode",
            dataType: "string",
            description: "Merchant code.",
            category: "Merchant Details",
            applicableModes: [0, 2, 3]
        },
        "FailureCode": {
            name: "FailureCode",
            dataType: "string",
            description: "Populated only when payment is not successful.",
            category: "Failure Details",
            applicableModes: [0, 2, 3],
            conditional: "Only for failed transactions"
        },
        "FailureReason": {
            name: "FailureReason",
            dataType: "string",
            description: "Populated only when payment is not successful.",
            category: "Failure Details",
            applicableModes: [0, 2, 3],
            conditional: "Only for failed transactions"
        },
        "Token": {
            name: "Token",
            dataType: "string",
            description: "Returned only if payment is processed using cardProxy input parameter. The value will be same as cardProxy.",
            category: "Token Details",
            applicableModes: [0, 2],
            conditional: "Only when using cardProxy"
        },
        "PayId": {
            name: "PayId",
            dataType: "string",
            description: "Returned only if payment is processed using PayID.",
            category: "Payment Method",
            applicableModes: [0, 2],
            conditional: "Only for PayID payments"
        },
        "PayIdName": {
            name: "PayIdName",
            dataType: "string",
            description: "Returned only if payment is processed using PayID. Display name for the PayID.",
            category: "Payment Method",
            applicableModes: [0, 2],
            conditional: "Only for PayID payments"
        }
    };

    // Return parameters for Mode 1 (Tokenization)
    const TOKENIZATION_RETURN_PARAMETERS = {
        "Token": {
            name: "Token",
            dataType: "string",
            description: "The proxy that can be saved and then used to process payment using API or payment plugin.",
            category: "Token Details",
            applicableModes: [1]
        },
        "CardType": {
            name: "CardType",
            dataType: "string",
            description: "Type of card i.e. Visa, MasterCards, American Express Or Bank Account.",
            category: "Payment Method",
            applicableModes: [1]
        },
        "CardHolderName": {
            name: "CardHolderName",
            dataType: "string",
            description: "Card holder name provided by the user. Returned only if user selects credit / debit card.",
            category: "Payment Method",
            applicableModes: [1],
            conditional: "Only for card payments"
        },
        "CardNumber": {
            name: "CardNumber",
            dataType: "string",
            description: "Obfuscated card number provided by the user. Returned only if user selects credit / debit card.",
            category: "Payment Method",
            applicableModes: [1],
            conditional: "Only for card payments"
        },
        "CardExpiry": {
            name: "CardExpiry",
            dataType: "string",
            description: "Card expiry date. Returned only if user selects credit / debit card.<br>Format: MM/CCYY",
            category: "Payment Method",
            applicableModes: [1],
            conditional: "Only for card payments"
        },
        "AccountName": {
            name: "AccountName",
            dataType: "string",
            description: "Account name provided by the user. Returned only if user selects bank account.",
            category: "Payment Method",
            applicableModes: [1],
            conditional: "Only for bank account payments"
        },
        "AccountNumber": {
            name: "AccountNumber",
            dataType: "string",
            description: "Obfuscated account number provided by the user. Returned only if user selects bank account.",
            category: "Payment Method",
            applicableModes: [1],
            conditional: "Only for bank account payments"
        },
        "PayId": {
            name: "PayId",
            dataType: "string",
            description: "Returned only if payment is processed using PayID.",
            category: "Payment Method",
            applicableModes: [1],
            conditional: "Only for PayID payments"
        },
        "PayIdName": {
            name: "PayIdName",
            dataType: "string",
            description: "Returned only if payment is processed using PayID. Display name for the PayID.",
            category: "Payment Method",
            applicableModes: [1],
            conditional: "Only for PayID payments"
        },
        "IsRestrictedCard": {
            name: "IsRestrictedCard",
            dataType: "boolean",
            description: "Flag to indicate whether the card is restricted or not.",
            category: "Payment Method",
            applicableModes: [1]
        },
        "PaymentAmount": {
            name: "PaymentAmount",
            dataType: "decimal",
            description: "Same as input parameter.",
            category: "Amount Details",
            applicableModes: [1]
        },
        "CustomerFee": {
            name: "CustomerFee",
            dataType: "decimal",
            description: "Customer fee applicable to process a payment of amount specified in PaymentAmount input parameter.",
            category: "Amount Details",
            applicableModes: [1]
        },
        "MerchantFee": {
            name: "MerchantFee",
            dataType: "decimal",
            description: "Merchant fee applicable to process a payment of amount specified in PaymentAmount input parameter.",
            category: "Amount Details",
            applicableModes: [1]
        },
        "ProcessingAmount": {
            name: "ProcessingAmount",
            dataType: "decimal",
            description: "The total amount that will be processed i.e. PaymentAmount + CustomerFee.",
            category: "Amount Details",
            applicableModes: [1]
        }
    };

    // Validation code information
    const VALIDATION_CODE_INFO = {
        description: "The payload submitted to the callbackURL has an additional parameter called ValidationCode. You can use this validation code to authenticate the callback.",
        details: "The ValidationCode is a SHA3-512 (v5), SHA512 (v4) or SHA1 (v3) hash of the fields in the following order with a pipe (|) as a separator:<br><br>apiKey|userName|password|mode|paymentAmount|merchantUniquePaymentId|reference<br><br>In case of mode 0 and 2, the reference is PaymentReference output parameter and in case of mode 1, the reference is Token output parameter."
    };

    // Get unique parameter categories
    function getUniqueParameterCategories() {
        const categories = new Set();
        
        for (const paramKey in INPUT_PARAMETERS) {
            const param = INPUT_PARAMETERS[paramKey];
            if (param.category) {
                categories.add(param.category);
            }
        }
        
        return Array.from(categories).sort();
    }

    // Get unique return parameter categories
    function getUniqueReturnParamCategories() {
        const categories = new Set();
        
        // Add categories from payment return parameters
        for (const paramKey in PAYMENT_RETURN_PARAMETERS) {
            const param = PAYMENT_RETURN_PARAMETERS[paramKey];
            if (param.category) {
                categories.add(param.category);
            }
        }
        
        // Add categories from tokenization return parameters
        for (const paramKey in TOKENIZATION_RETURN_PARAMETERS) {
            const param = TOKENIZATION_RETURN_PARAMETERS[paramKey];
            if (param.category) {
                categories.add(param.category);
            }
        }
        
        return Array.from(categories).sort();
    }

    // Filter parameters based on search text, category, mode, and requirement
    function filterParameters(searchText, category, mode, requirement) {
        searchText = (searchText || '').toLowerCase();
        mode = parseInt(mode) || null;
        
        return Object.values(INPUT_PARAMETERS).filter(param => {
            // Match search text
            const matchesSearch = 
                !searchText || 
                param.name.toLowerCase().includes(searchText) ||
                param.description.toLowerCase().includes(searchText) ||
                (param.dataType && param.dataType.toLowerCase().includes(searchText)) ||
                (param.defaultValue && param.defaultValue.toLowerCase().includes(searchText));
            
            // Match category
            const matchesCategory = !category || param.category === category;
            
            // Match mode
            const matchesMode = mode === null || param.modes.includes(mode);
            
            // Match requirement
            const matchesRequirement = !requirement || param.requirement === requirement;
            
            return matchesSearch && matchesCategory && matchesMode && matchesRequirement;
        });
    }

    // Filter return parameters based on search text, category, and mode
    function filterReturnParameters(searchText, category, mode) {
        searchText = (searchText || '').toLowerCase();
        mode = parseInt(mode) || null;
        
        // Determine which parameter set to use based on mode
        let parameters = {};
        
        if (mode === null) {
            // Combine both parameter sets if no mode filter
            parameters = {...PAYMENT_RETURN_PARAMETERS, ...TOKENIZATION_RETURN_PARAMETERS};
        } else if (mode === 1) {
            // Use tokenization parameters for mode 1
            parameters = {...TOKENIZATION_RETURN_PARAMETERS};
        } else {
            // Use payment parameters for modes 0, 2, 3
            parameters = {...PAYMENT_RETURN_PARAMETERS};
        }
        
        return Object.values(parameters).filter(param => {
            // Check if the parameter applies to the selected mode
            const matchesMode = mode === null || 
                (param.applicableModes && param.applicableModes.includes(mode));
            
            // Skip if mode doesn't match
            if (!matchesMode) return false;
            
            // Match search text
            const matchesSearch = 
                !searchText || 
                param.name.toLowerCase().includes(searchText) ||
                param.description.toLowerCase().includes(searchText) ||
                (param.dataType && param.dataType.toLowerCase().includes(searchText)) ||
                (param.category && param.category.toLowerCase().includes(searchText));
            
            // Match category
            const matchesCategory = !category || param.category === category;
            
            return matchesSearch && matchesCategory;
        });
    }

    // Render parameters to the smart table
    function renderParameters(filteredParams) {
        const tableBody = document.getElementById('paramsTableBody');
        const noResultsElement = document.getElementById('noParamsFound');
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        if (filteredParams.length === 0) {
            // Show no results message
            noResultsElement.classList.remove('d-none');
            return;
        }
        
        // Hide no results message
        noResultsElement.classList.add('d-none');
        
        // Add rows for each parameter
        filteredParams.forEach(param => {
            const row = document.createElement('tr');
            row.setAttribute('data-param', param.name);
            
            // Click to expand/collapse row
            row.addEventListener('click', function() {
                const detailRow = document.getElementById(`${param.name}-details`);
                if (detailRow) {
                    detailRow.classList.toggle('d-none');
                    this.classList.toggle('expanded-row');
                }
            });
            
            // Generate mode badges HTML
            const modeBadgesHtml = param.modes.map(mode => {
                let badgeClass = 'bg-secondary-subtle text-secondary';
                
                // Color-code by mode
                switch(mode) {
                    case 0:
                        badgeClass = 'bg-success-subtle text-success';
                        break;
                    case 1:
                        badgeClass = 'bg-primary-subtle text-primary';
                        break;
                    case 2:
                        badgeClass = 'bg-info-subtle text-info';
                        break;
                    case 3:
                        badgeClass = 'bg-warning-subtle text-warning';
                        break;
                }
                
                return `<span class="badge ${badgeClass} mode-badge">Mode ${mode}</span>`;
            }).join(' ');
            
            // Create requirement badge HTML
            let requirementBadgeClass = 'bg-secondary';
            if (param.requirement === 'required') {
                requirementBadgeClass = 'bg-danger';
            } else if (param.requirement === 'conditional') {
                requirementBadgeClass = 'bg-warning';
            }
            
            const requirementHtml = `<span class="badge ${requirementBadgeClass}">${param.requirement}</span>`;
            
            // Create cells with parameter data
            const nameCell = document.createElement('td');
            nameCell.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-chevron-right expand-icon me-2"></i>
                    <code>${param.name}</code>
                </div>
            `;
            
            const typeCell = document.createElement('td');
            typeCell.innerHTML = `<span class="badge bg-secondary type-badge">${param.dataType}</span>`;
            
            const requirementCell = document.createElement('td');
            requirementCell.innerHTML = requirementHtml;
            
            const modesCell = document.createElement('td');
            modesCell.innerHTML = modeBadgesHtml;
            
            // Add cells to row
            row.appendChild(nameCell);
            row.appendChild(typeCell);
            row.appendChild(requirementCell);
            row.appendChild(modesCell);
            
            // Add row to table
            tableBody.appendChild(row);
            
            // Create and add detail row
            const detailRow = document.createElement('tr');
            detailRow.id = `${param.name}-details`;
            detailRow.classList.add('d-none', 'param-details');
            
            // Create detail cell that spans all columns
            const detailCell = document.createElement('td');
            detailCell.colSpan = 4;
            
            // Build detail content
            let detailContent = `
                <div class="param-detail-content">
                    <div class="row">
                        <div class="col-md-3">
                            <h6 class="mb-2">Parameter Details</h6>
                            <div class="mb-3">
                                <strong>Category:</strong> ${param.category}
                            </div>
                            ${param.defaultValue ? `<div class="mb-3"><strong>Default Value:</strong> ${param.defaultValue}</div>` : ''}
                        </div>
                        <div class="col-md-9">
                            <h6 class="mb-2">Description</h6>
                            <p>${param.description}</p>
                            ${param.details ? `<div class="mt-2">${param.details}</div>` : ''}
                        </div>
                    </div>
                    
                    ${getRelatedParameters(param.name)}
                </div>
            `;
            
            detailCell.innerHTML = detailContent;
            detailRow.appendChild(detailCell);
            
            // Add detail row after main row
            tableBody.appendChild(detailRow);
        });
    }

    // Render return parameters to the table
    function renderReturnParameters(filteredParams) {
        const tableBody = document.getElementById('returnParamsTableBody');
        const noResultsElement = document.getElementById('noReturnParamsFound');
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        if (filteredParams.length === 0) {
            // Show no results message
            noResultsElement.classList.remove('d-none');
            return;
        }
        
        // Hide no results message
        noResultsElement.classList.add('d-none');
        
        // Group parameters by category for better organization
        const groupedParams = {};
        filteredParams.forEach(param => {
            const category = param.category || 'Other';
            if (!groupedParams[category]) {
                groupedParams[category] = [];
            }
            groupedParams[category].push(param);
        });
        
        // Add rows for each parameter, grouped by category
        Object.keys(groupedParams).sort().forEach(category => {
            // Add category header row
            const headerRow = document.createElement('tr');
            headerRow.classList.add('category-header');
            
            const headerCell = document.createElement('td');
            headerCell.colSpan = 4;
            headerCell.innerHTML = `<strong>${category}</strong>`;
            headerRow.appendChild(headerCell);
            
            tableBody.appendChild(headerRow);
            
            // Add parameter rows
            groupedParams[category].forEach(param => {
                const row = document.createElement('tr');
                row.setAttribute('data-param', param.name);
                
                // Click to expand/collapse row
                row.addEventListener('click', function() {
                    const detailRow = document.getElementById(`return-${param.name}-details`);
                    if (detailRow) {
                        detailRow.classList.toggle('d-none');
                        this.classList.toggle('expanded-row');
                    }
                });
                
                // Generate mode badges HTML
                const modeBadgesHtml = param.applicableModes ? param.applicableModes.map(mode => {
                    let badgeClass = 'bg-secondary-subtle text-secondary';
                    
                    // Color-code by mode
                    switch(mode) {
                        case 0:
                            badgeClass = 'bg-success-subtle text-success';
                            break;
                        case 1:
                            badgeClass = 'bg-primary-subtle text-primary';
                            break;
                        case 2:
                            badgeClass = 'bg-info-subtle text-info';
                            break;
                        case 3:
                            badgeClass = 'bg-warning-subtle text-warning';
                            break;
                    }
                    
                    return `<span class="badge ${badgeClass} mode-badge">Mode ${mode}</span>`;
                }).join(' ') : '';
                
                // Create cells with parameter data
                const nameCell = document.createElement('td');
                nameCell.innerHTML = `
                    <div class="d-flex align-items-center">
                        <i class="bi bi-chevron-right expand-icon me-2"></i>
                        <code>${param.name}</code>
                    </div>
                `;
                
                const typeCell = document.createElement('td');
                typeCell.innerHTML = `<span class="badge bg-secondary type-badge">${param.dataType}</span>`;
                
                const modesCell = document.createElement('td');
                modesCell.innerHTML = modeBadgesHtml;
                
                const conditionalCell = document.createElement('td');
                conditionalCell.innerHTML = param.conditional ? 
                    `<span class="badge bg-warning text-dark">${param.conditional}</span>` : 
                    '';
                
                // Add cells to row
                row.appendChild(nameCell);
                row.appendChild(typeCell);
                row.appendChild(modesCell);
                row.appendChild(conditionalCell);
                
                // Add row to table
                tableBody.appendChild(row);
                
                // Create and add detail row
                const detailRow = document.createElement('tr');
                detailRow.id = `return-${param.name}-details`;
                detailRow.classList.add('d-none', 'param-details');
                
                // Create detail cell that spans all columns
                const detailCell = document.createElement('td');
                detailCell.colSpan = 4;
                
                // Build detail content
                detailCell.innerHTML = `
                    <div class="param-detail-content">
                        <div class="description">
                            ${param.description}
                        </div>
                    </div>
                `;
                
                detailRow.appendChild(detailCell);
                
                // Add detail row after main row
                tableBody.appendChild(detailRow);
            });
        });
        
        // Add validation code information at the end if not filtered
        if (!searchText && !category) {
            const validationInfoRow = document.createElement('tr');
            validationInfoRow.classList.add('validation-info-row');
            
            const validationCell = document.createElement('td');
            validationCell.colSpan = 4;
            
            validationCell.innerHTML = `
                <div class="alert alert-info mb-0">
                    <h6>Validation Code</h6>
                    <p>${VALIDATION_CODE_INFO.description}</p>
                    <p>${VALIDATION_CODE_INFO.details}</p>
                </div>
            `;
            
            validationInfoRow.appendChild(validationCell);
            tableBody.appendChild(validationInfoRow);
        }
    }

    // Get related parameters HTML
    function getRelatedParameters(paramName) {
        const param = INPUT_PARAMETERS[paramName];
        
        if (!param) return '';
        
        // Find related parameters based on category and modes
        const relatedParams = Object.values(INPUT_PARAMETERS).filter(p => 
            p.name !== paramName && (
                p.category === param.category || 
                JSON.stringify(p.modes) === JSON.stringify(param.modes) ||
                (paramName.includes('Label') && p.name === paramName.replace('Label', '')) ||
                (p.name.includes('Label') && paramName === p.name.replace('Label', ''))
            )
        ).slice(0, 5); // Limit to 5 related params
        
        if (relatedParams.length === 0) return '';
        
        let html = `
            <div class="mt-3">
                <h6 class="mb-2">Related Parameters</h6>
                <div class="related-params">
        `;
        
        relatedParams.forEach(relatedParam => {
            html += `
                <span class="related-param badge bg-light text-dark" 
                      data-param="${relatedParam.name}" 
                      role="button">
                    ${relatedParam.name}
                </span>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }

    // Initialize parameters reference modal
    function initParametersModal() {
        // Get DOM elements
        const modal = document.getElementById('parametersModal');
        const searchInput = document.getElementById('paramSearchInput');
        const categoryFilter = document.getElementById('paramCategoryFilter');
        const modeFilter = document.getElementById('paramModeFilter');
        const requirementFilter = document.getElementById('paramRequirementFilter');
        const parametersBtn = document.getElementById('parametersBtn');
        
        // Initialize Bootstrap modal if exists
        let modalInstance = null;
        if (modal) {
            modalInstance = new bootstrap.Modal(modal);
        } else {
            return; // Exit if modal doesn't exist
        }
        
        // Populate category filter options
        const categories = getUniqueParameterCategories();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        
        // Filter function that collects all filter values and updates display
        function updateParametersDisplay() {
            const searchText = searchInput.value;
            const category = categoryFilter.value;
            const mode = modeFilter.value;
            const requirement = requirementFilter.value;
            
            const filteredParams = filterParameters(searchText, category, mode, requirement);
            renderParameters(filteredParams);
            
            // Add event listeners to related parameter badges
            setTimeout(() => {
                document.querySelectorAll('.related-param').forEach(badge => {
                    badge.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const paramName = this.getAttribute('data-param');
                        highlightParameter(paramName);
                    });
                });
            }, 100);
        }
        
        // Function to highlight and scroll to a parameter
        function highlightParameter(paramName) {
            // Find the parameter row
            const paramRow = document.querySelector(`tr[data-param="${paramName}"]`);
            if (!paramRow) return;
            
            // First clear all highlights
            document.querySelectorAll('tr.highlight-row').forEach(row => {
                row.classList.remove('highlight-row');
            });
            
            // Expand the parameter's details if collapsed
            const detailRow = document.getElementById(`${paramName}-details`);
            if (detailRow && detailRow.classList.contains('d-none')) {
                detailRow.classList.remove('d-none');
                paramRow.classList.add('expanded-row');
            }
            
            // Add highlight class
            paramRow.classList.add('highlight-row');
            
            // Scroll to the parameter row
            paramRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Add event listeners to all filters
        searchInput.addEventListener('input', updateParametersDisplay);
        categoryFilter.addEventListener('change', updateParametersDisplay);
        modeFilter.addEventListener('change', updateParametersDisplay);
        requirementFilter.addEventListener('change', updateParametersDisplay);
        
        // Add event listener to parameters button
        if (parametersBtn) {
            parametersBtn.addEventListener('click', () => {
                // Reset filters
                searchInput.value = '';
                categoryFilter.value = '';
                modeFilter.value = '';
                requirementFilter.value = '';
                
                // Render all parameters
                renderParameters(Object.values(INPUT_PARAMETERS));
                
                // Show modal
                modalInstance.show();
                
                // Add event listeners to related parameter badges
                setTimeout(() => {
                    document.querySelectorAll('.related-param').forEach(badge => {
                        badge.addEventListener('click', function(e) {
                            e.stopPropagation();
                            const paramName = this.getAttribute('data-param');
                            highlightParameter(paramName);
                        });
                    });
                }, 100);
            });
        }
        
        // Reset filters when modal is hidden
        modal.addEventListener('hidden.bs.modal', () => {
            searchInput.value = '';
            categoryFilter.value = '';
            modeFilter.value = '';
            requirementFilter.value = '';
        });
        
        // Theme-aware styling for the modal
        function updateModalTheme() {
            const isDarkTheme = document.documentElement.getAttribute('data-bs-theme') === 'dark';
            if (isDarkTheme) {
                modal.querySelectorAll('.table').forEach(table => {
                    table.classList.add('table-dark');
                });
            } else {
                modal.querySelectorAll('.table').forEach(table => {
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

    // Initialize return parameters modal
    function initReturnParametersModal() {
        // Get DOM elements
        const modal = document.getElementById('returnParametersModal');
        const searchInput = document.getElementById('returnParamSearchInput');
        const categoryFilter = document.getElementById('returnParamCategoryFilter');
        const modeFilter = document.getElementById('returnParamModeFilter');
        const returnParamsBtn = document.getElementById('returnParamsBtn');
        
        // Initialize Bootstrap modal if exists
        let modalInstance = null;
        if (modal) {
            modalInstance = new bootstrap.Modal(modal);
        } else {
            return; // Exit if modal doesn't exist
        }
        
        // Populate category filter options
        const categories = getUniqueReturnParamCategories();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        
        // Filter function that collects all filter values and updates display
        function updateReturnParametersDisplay() {
            const searchText = searchInput.value;
            const category = categoryFilter.value;
            const mode = modeFilter.value;
            
            const filteredParams = filterReturnParameters(searchText, category, mode);
            renderReturnParameters(filteredParams);
        }
        
        // Add event listeners to all filters
        searchInput.addEventListener('input', updateReturnParametersDisplay);
        categoryFilter.addEventListener('change', updateReturnParametersDisplay);
        modeFilter.addEventListener('change', updateReturnParametersDisplay);
        
        // Add event listener to return parameters button
        if (returnParamsBtn) {
            returnParamsBtn.addEventListener('click', () => {
                // Reset filters
                searchInput.value = '';
                categoryFilter.value = '';
                modeFilter.value = '';
                
                // Render all return parameters
                renderReturnParameters(Object.values({...PAYMENT_RETURN_PARAMETERS, ...TOKENIZATION_RETURN_PARAMETERS}));
                
                // Show modal
                modalInstance.show();
            });
        }
        
        // Reset filters when modal is hidden
        modal.addEventListener('hidden.bs.modal', () => {
            searchInput.value = '';
            categoryFilter.value = '';
            modeFilter.value = '';
        });
        
        // Theme-aware styling for the modal
        function updateModalTheme() {
            const isDarkTheme = document.documentElement.getAttribute('data-bs-theme') === 'dark';
            if (isDarkTheme) {
                modal.querySelectorAll('.table').forEach(table => {
                    table.classList.add('table-dark');
                });
            } else {
                modal.querySelectorAll('.table').forEach(table => {
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
        initParametersModal();
        initReturnParametersModal();
    });

    // Expose parameters interface
    window.ZenPayParams = {
        // Input Parameters
        getInputParam: function(name) {
            return INPUT_PARAMETERS[name] || null;
        },
        getAllInputParams: function() {
            return Object.values(INPUT_PARAMETERS);
        },
        getInputParamsByMode: function(mode) {
            return Object.values(INPUT_PARAMETERS).filter(param => 
                param.modes && param.modes.includes(parseInt(mode))
            );
        },
        getInputParamsByRequirement: function(requirement) {
            return Object.values(INPUT_PARAMETERS).filter(param => 
                param.requirement === requirement
            );
        },
        showParametersModal: function() {
            const modal = document.getElementById('parametersModal');
            if (modal) {
                const modalInstance = new bootstrap.Modal(modal);
                modalInstance.show();
            }
        },
        showInputParamDetails: function(name) {
            const param = INPUT_PARAMETERS[name];
            if (!param) {
                console.warn(`Parameter ${name} not found.`);
                return;
            }
            
            // Reset search and filter
            document.getElementById('paramSearchInput').value = name;
            document.getElementById('paramCategoryFilter').value = '';
            document.getElementById('paramModeFilter').value = '';
            document.getElementById('paramRequirementFilter').value = '';
            
            // Filter to show params matching the search
            const filteredParams = filterParameters(name, '', null, '');
            renderParameters(filteredParams);
            
            // Show the modal
            const modal = document.getElementById('parametersModal');
            if (modal) {
                const modalInstance = new bootstrap.Modal(modal);
                modalInstance.show();
                
                // Highlight the specific parameter
                setTimeout(() => {
                    const paramRow = document.querySelector(`tr[data-param="${name}"]`);
                    if (paramRow) {
                        paramRow.click(); // Expand the details
                        paramRow.classList.add('highlight-row');
                        paramRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 300);
            }
        },
        
        // Return Parameters
        getAllPaymentReturnParams: function() {
            return Object.values(PAYMENT_RETURN_PARAMETERS);
        },
        getAllTokenizationReturnParams: function() {
            return Object.values(TOKENIZATION_RETURN_PARAMETERS);
        },
        getReturnParamsByMode: function(mode) {
            if (mode === 1) {
                return Object.values(TOKENIZATION_RETURN_PARAMETERS);
            } else {
                return Object.values(PAYMENT_RETURN_PARAMETERS).filter(param => 
                    param.applicableModes && param.applicableModes.includes(parseInt(mode))
                );
            }
        },
        showReturnParametersModal: function() {
            const modal = document.getElementById('returnParametersModal');
            if (modal) {
                const modalInstance = new bootstrap.Modal(modal);
                modalInstance.show();
            }
        },
        showReturnParamDetails: function(name) {
            // Find the parameter in either object
            const param = PAYMENT_RETURN_PARAMETERS[name] || TOKENIZATION_RETURN_PARAMETERS[name];
            if (!param) {
                console.warn(`Return parameter ${name} not found.`);
                return;
            }
            
            // Reset search and filters
            document.getElementById('returnParamSearchInput').value = name;
            document.getElementById('returnParamCategoryFilter').value = '';
            document.getElementById('returnParamModeFilter').value = '';
            
            // Filter to show only matching parameters
            const filteredParams = filterReturnParameters(name, '', null);
            renderReturnParameters(filteredParams);
            
            // Show the modal
            const modal = document.getElementById('returnParametersModal');
            if (modal) {
                const modalInstance = new bootstrap.Modal(modal);
                modalInstance.show();
                
                // Highlight the specific parameter
                setTimeout(() => {
                    const paramRow = document.querySelector(`tr[data-param="${name}"]`);
                    if (paramRow) {
                        paramRow.click(); // Expand the details
                        paramRow.classList.add('highlight-row');
                        paramRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 300);
            }
        }
    };
})();