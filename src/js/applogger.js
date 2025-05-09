// Enhanced console logger with proper object handling
export const DEBUG_MODE = true;
export const TRACE_MODE = false;

const originalConsole = {
	log: window.console.log,
	info: window.console.info,
	debug: window.console.debug,
	warn: window.console.warn,
	error: window.console.error,
	trace: window.console.trace,
};

/**
 * Properly format and color arguments for console output
 * @param {Array} args - Arguments to format
 * @param {string} defaultColor - Default color to use
 * @returns {Array} - Formatted arguments ready for console
 */
function formatArgs(args, defaultColor) {
	if (!args || args.length === 0) return [''];

	if (typeof args[0] === 'string' && args.length > 1) {
		const firstArg = args[0];
		const remainingArgs = Array.from(args).slice(1);
		const hasObjects = remainingArgs.some(
			(arg) => typeof arg === 'object' && arg !== null && !(arg instanceof Error)
		);

		if (hasObjects) {
			const formattedRemainingArgs = remainingArgs.map((arg) => {
				if (typeof arg === 'object' && arg !== null && !(arg instanceof Error)) {
					return JSON.stringify(arg, null, 2);
				}
				return arg;
			});

			return [`%c${firstArg}`, defaultColor, ...formattedRemainingArgs];
		}
	}

	if (
		args.length === 1 &&
		typeof args[0] === 'object' &&
		args[0] !== null &&
		!(args[0] instanceof Error)
	) {
		return [`%c${JSON.stringify(args[0], null, 2)}`, defaultColor];
	}

	try {
		const allArgsAsStrings = Array.from(args).map((arg) => {
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
		return [`%cLogger Error: ${e.message}`, 'color: red'];
	}
}

console.json = function (obj) {
	if (typeof obj === 'object' && obj !== null) {
		originalConsole.log('%c' + JSON.stringify(obj, null, 2), 'color: #22A222;');
	} else {
		originalConsole.log(obj);
	}
};

console.log = function (...args) {
	originalConsole.log(...formatArgs(args, 'color:rgb(0, 255, 94);'));
};

console.error = function (...args) {
	originalConsole.error(...formatArgs(args, 'color: #FF0000; font-weight: bold;'));
};

console.debug = DEBUG_MODE
	? function (...args) {
			originalConsole.debug(...formatArgs(args, 'color: #1C94A8;'));
		}
	: function () {};

console.trace = TRACE_MODE
	? function (...args) {
			originalConsole.trace(...formatArgs(args, 'color: #C922C9;'));
		}
	: function () {};

console.warn = function (...args) {
	originalConsole.warn(...formatArgs(args, 'color: #FFA500; font-weight: bold;'));
};

console.info = function (...args) {
	originalConsole.info(...formatArgs(args, 'color: #0099FF;'));
};
