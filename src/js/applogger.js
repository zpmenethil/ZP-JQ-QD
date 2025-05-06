// Enhanced console logger with proper object handling
export const DEBUG_MODE = true;
export const TRACE_MODE = false;

// Store original console methods
const originalConsole = {
	log: window.console.log,
	info: window.console.info,
	debug: window.console.debug,
	warn: window.console.warn,
	error: window.console.error,
	trace: window.console.trace
};

/**
 * Properly format and color arguments for console output
 * @param {Array} args - Arguments to format
 * @param {string} defaultColor - Default color to use
 * @returns {Array} - Formatted arguments ready for console
 */
function formatArgs(args, defaultColor) {
	if (!args || args.length === 0) return [''];

	// If first arg is a string and remaining args are objects, handle specially
	if (typeof args[0] === 'string' && args.length > 1) {
		const firstArg = args[0];
		const remainingArgs = Array.from(args).slice(1);

		// Check if any of the remaining args are objects
		const hasObjects = remainingArgs.some(arg => typeof arg === 'object' && arg !== null && !(arg instanceof Error));

		if (hasObjects) {
			// For each object, format it properly
			const formattedRemainingArgs = remainingArgs.map(arg => {
				if (typeof arg === 'object' && arg !== null && !(arg instanceof Error)) {
					return JSON.stringify(arg, null, 2);
				}
				return arg;
			});

			return [`%c${firstArg}`, defaultColor, ...formattedRemainingArgs];
		}
	}

	// If single argument is an object, format it properly
	if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && !(args[0] instanceof Error)) {
		return [`%c${JSON.stringify(args[0], null, 2)}`, defaultColor];
	}

	// For normal strings or mixed content, just color the output
	try {
		const allArgsAsStrings = Array.from(args).map(arg => {
			if (typeof arg === 'object' && arg !== null) {
				try {
					return JSON.stringify(arg, null, 2);
				} catch (e) {
					console.error('[formatArgs] Error stringifying object:', e);
					return String(arg);
				}
			}
			return String(arg);
		});
		return [`%c${allArgsAsStrings.join(' ')}`, defaultColor];
	} catch (e) {
		// Fallback if something goes wrong
		return [`%cLogger Error: ${e.message}`, 'color: red'];
	}
}

// JSON formatter for objects (keeps this functionality clean)
console.json = function (obj) {
	if (typeof obj === 'object' && obj !== null) {
		originalConsole.log('%c' + JSON.stringify(obj, null, 2), 'color: #22A222;');
	} else {
		originalConsole.log(obj);
	}
};

// Enhanced console.log with proper object handling
console.log = function (...args) {
	originalConsole.log(...formatArgs(args, 'color: #22A222;'));
};

// Enhanced console.error with proper object handling
console.error = function (...args) {
	originalConsole.error(...formatArgs(args, 'color: #FF0000; font-weight: bold;'));
};

// Enhanced console.debug with proper object handling (conditionally enabled)
console.debug = DEBUG_MODE
	? function (...args) {
			originalConsole.debug(...formatArgs(args, 'color: #1C94A8;'));
	  }
	: function () {};

// Enhanced console.trace with proper object handling (conditionally enabled)
console.trace = TRACE_MODE
	? function (...args) {
			originalConsole.trace(...formatArgs(args, 'color: #C922C9;'));
	  }
	: function () {};

// Enhanced console.warn with proper object handling
console.warn = function (...args) {
	originalConsole.warn(...formatArgs(args, 'color: #FFA500; font-weight: bold;'));
};

// Enhanced console.info with proper object handling
console.info = function (...args) {
	originalConsole.info(...formatArgs(args, 'color: #0099FF;'));
};
