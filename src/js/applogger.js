export const APP_START_TIME = new Date().toISOString().slice(0, 19);
window.APP_START_TIME = APP_START_TIME;
import { generateCurrentDatetime } from './helpers.js';

// Function to get application start time
export function getAppStartTime() {
	return APP_START_TIME;
}

// Style definitions for various log types and JSON formatting
const STYLES = {
	// Log level styles
	TRACE: 'color: #666; font-style: italic',
	DEBUG: 'color: #6600cc; font-weight: normal',
	INFO: 'color: #0066cc; font-weight: bold',
	WARN: 'color: #ff9900; font-weight: bold',
	ERROR: 'color: #cc0000; font-weight: bold',

	// For custom prefixes
	SYSTEM: 'color: #9400D3; font-weight: bold',
	SUCCESS: 'color: #008000; font-weight: bold',

	// JSON token styles
	string: 'color:rgb(4, 255, 0); font-weight: normal',
	number: 'color: #0000ff; font-weight: normal',
	boolean: 'color:rgb(255, 0, 217); font-weight: bold',
	null: 'color: #808080; font-weight: bold',
	key: 'color:rgb(0, 255, 255); font-weight: bold',
	bracket: 'color: #000000; font-weight: bold',

	// Source location style
	source: 'color: #888; font-style: italic; font-size: 0.9em',
};

/**
 * Adds proper CSS styling to JSON values
 * @param {any} obj - Object to format
 * @param {number} indent - Indentation level
 * @returns {Array} Array containing format string and style arguments
 */
export function stylizeJson(obj, indent = 2) {
	if (obj === undefined) return ['%cundefined', STYLES.null];

	try {
		// Handle circular references and complex objects
		const cache = new Set();
		const jsonString = JSON.stringify(
			obj,
			(key, value) => {
				if (typeof value === 'object' && value !== null) {
					if (cache.has(value)) return '[Circular]';
					cache.add(value);
				}
				return value;
			},
			indent
		);

		if (!jsonString) return ['%c[Empty]', STYLES.null];

		// Tokenize the JSON string to apply styles
		let result = '';
		let styleArgs = [];
		let inString = false;
		let inKey = false;
		let buffer = '';

		for (let i = 0; i < jsonString.length; i++) {
			const char = jsonString[i];

			// Handle string boundaries
			if (char === '"' && (i === 0 || jsonString[i - 1] !== '\\')) {
				if (inString) {
					// End of string
					if (inKey) {
						result += `%c${buffer}%c`;
						styleArgs.push(STYLES.key, STYLES.bracket);
						inKey = false;
					} else {
						result += `%c${buffer}%c`;
						styleArgs.push(STYLES.string, STYLES.bracket);
					}
					buffer = '';
					inString = false;
				} else {
					// Start of string
					inString = true;
					// Check if this is a key (followed by colon)
					let j = i + 1;
					while (j < jsonString.length && jsonString[j] !== '"') j++;
					if (j < jsonString.length - 1 && jsonString[j + 1] === ':') {
						inKey = true;
					} else {
						inKey = false;
					}
				}
				continue;
			}

			if (inString) {
				buffer += char;
			} else {
				// Handle non-string tokens
				if (/[0-9.-]/.test(char)) {
					// Collect the full number
					let numBuffer = char;
					while (i + 1 < jsonString.length && /[0-9.\-e]/.test(jsonString[i + 1])) {
						numBuffer += jsonString[++i];
					}
					if (!isNaN(Number(numBuffer))) {
						result += `%c${numBuffer}%c`;
						styleArgs.push(STYLES.number, STYLES.bracket);
					} else {
						result += numBuffer;
					}
				} else if (char === 't' && jsonString.substring(i, i + 4) === 'true') {
					result += `%ctrue%c`;
					styleArgs.push(STYLES.boolean, STYLES.bracket);
					i += 3;
				} else if (char === 'f' && jsonString.substring(i, i + 5) === 'false') {
					result += `%cfalse%c`;
					styleArgs.push(STYLES.boolean, STYLES.bracket);
					i += 4;
				} else if (char === 'n' && jsonString.substring(i, i + 4) === 'null') {
					result += `%cnull%c`;
					styleArgs.push(STYLES.null, STYLES.bracket);
					i += 3;
				} else if (/[{}[\],:]/.test(char)) {
					result += `%c${char}%c`;
					styleArgs.push(STYLES.bracket, STYLES.bracket);
				} else {
					result += char;
				}
			}
		}

		return [result, ...styleArgs];
	} catch (err) {
		return [`%c[Error formatting: ${err.message}]`, STYLES.ERROR];
	}
}

/**
 * Format a single value with appropriate styling
 * @param {any} value - Value to format
 * @returns {Array} Format string and style arguments
 */
export function formatValue(value) {
	if (value === undefined) return ['%cundefined', STYLES.null];
	if (value === null) return ['%cnull', STYLES.null];

	const type = typeof value;

	switch (type) {
		case 'string':
			// Apply string styling but keep quotes visible
			return [`%c"${value}"`, STYLES.string];
		case 'number':
			return [`%c${value}`, STYLES.number];
		case 'boolean':
			return [`%c${value}`, STYLES.boolean];
		case 'object':
			if (Array.isArray(value)) {
				if (value.length === 0) return ['%c[]', STYLES.bracket];
				// Use special handling for short arrays
				if (value.length <= 3 && value.every((item) => typeof item !== 'object')) {
					const items = value.map((item) => {
						const [itemStr, itemStyle] = formatValue(item);
						return { str: itemStr, style: itemStyle };
					});

					let result = '%c[%c ';
					const styles = [STYLES.bracket, ''];

					items.forEach((item, index) => {
						result += item.str;
						styles.push(item.style);

						if (index < items.length - 1) {
							result += ' %c,%c ';
							styles.push(STYLES.bracket, '');
						}
					});

					result += ' %c]';
					styles.push(STYLES.bracket);

					return [result, ...styles];
				}
				// For larger arrays, use the full JSON formatter
				return stylizeJson(value);
			}
			if (value instanceof Date) {
				return [`%c${value.toISOString()}`, STYLES.string];
			}
			if (value instanceof Error) {
				return [`%c${value.toString()}`, STYLES.ERROR];
			}
			// For small objects, format them inline
			if (Object.keys(value).length <= 3) {
				try {
					let result = '%c{%c ';
					const styles = [STYLES.bracket, ''];

					Object.entries(value).forEach(([key, val], index) => {
						result += `%c"${key}"%c%c:%c `;
						styles.push(STYLES.key, '', STYLES.bracket, '');

						const [valStr, valStyle] = formatValue(val);
						result += valStr;
						styles.push(valStyle);

						if (index < Object.keys(value).length - 1) {
							result += ' %c,%c ';
							styles.push(STYLES.bracket, '');
						}
					});

					result += ' %c}';
					styles.push(STYLES.bracket);

					return [result, ...styles];
				} catch (e) {
					console.error('[formatValue] Error formatting object - Returning stylizeJson - E:', e);
					return stylizeJson(value);
				}
			}
			return stylizeJson(value);
		case 'function':
			return [`%c[Function: ${value.name || 'anonymous'}]`, STYLES.null];
		default:
			return [`%c[${type}]`, STYLES.null];
	}
}

/**
 * Get source information from the call stack
 * @returns {string} Source file and line number
 */
function getCallSource() {
	try {
		// Create an error to get the stack trace
		const err = new Error();
		const stack = err.stack.split('\n');

		// Find the relevant caller (skip this function and the console wrapper)
		const relevantEntries = stack.slice(3); // Skip Error, getCallSource, and the console method

		for (const line of relevantEntries) {
			if (!line.includes('applogger') && !line.includes('node_modules')) {
				const match =
					line.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) || line.match(/at\s+(.*):(\d+):(\d+)/);
				if (match) {
					const file =
						match[2]?.split('/').pop()?.split('\\').pop() ||
						match[1]?.split('/').pop()?.split('\\').pop() ||
						'';
					const lineNum = match[3] || '';
					return ` [${file}:${lineNum}]`;
				}
			}
		}

		return '';
	} catch (_) {
		console.error('[getCallSource] Error getting caller info - Returning blank E:', _);
		return '';
	}
}

/**
 * Configure loglevel to show level names and apply styling
 */
function setupLoggerFormatting() {
	// Only proceed if loglevel is available
	if (!window.log || !window.log.methodFactory) return;

	// Save original factory
	const originalFactory = window.log.methodFactory;

	// Replace with enhanced factory that adds level prefix and styling
	window.log.methodFactory = function (methodName, logLevel, loggerName) {
		const rawMethod = originalFactory(methodName, logLevel, loggerName);

		return function (...args) {
			// Skip formatting for browsers that don't support console styling
			if (typeof window !== 'undefined' && window.chrome) {
				const levelUpperCase = methodName.toUpperCase();
				const color = STYLES[levelUpperCase] || '';

				// Add timestamp and caller information if available
				const timestamp = generateCurrentDatetime();
				const prefix = `[${timestamp}] %c[${levelUpperCase}]%c`;
				const callerInfo = getCallSource();

				// Format based on first argument type
				if (args.length === 0) {
					rawMethod(`${prefix}${callerInfo}`, color, '');
					return;
				}

				const firstArg = args[0];
				if (typeof firstArg === 'string') {
					// Simple string message
					rawMethod(`${prefix} ${firstArg}${callerInfo}`, color, '', ...args.slice(1));
				} else if (typeof firstArg === 'object' && firstArg !== null) {
					// JSON formatting for objects
					const [formattedStr, ...styles] = formatValue(firstArg);
					rawMethod(`${prefix}${callerInfo}`, color, '');
					console.log(formattedStr, ...styles);

					// Log any additional arguments
					if (args.length > 1) {
						args.slice(1).forEach((arg) => {
							if (typeof arg === 'object' && arg !== null) {
								const [fmtStr, ...fmtStyles] = formatValue(arg);
								console.log(fmtStr, ...fmtStyles);
							} else {
								console.log(arg);
							}
						});
					}
				} else {
					// Other primitive types
					rawMethod(`${prefix}${callerInfo}`, color, '', ...args);
				}
			} else {
				// Fallback for non-supporting browsers
				const levelUpperCase = methodName.toUpperCase();
				const prefix = `[${levelUpperCase}]`;

				if (typeof args[0] === 'string') {
					rawMethod(`${prefix} ${args[0]}`, ...args.slice(1));
				} else {
					rawMethod(prefix, ...args);
				}
			}
		};
	};

	// Apply the changes by setting the level (doesn't change the actual level)
	const currentLevel = window.log.getLevel();
	window.log.setLevel(currentLevel);
}

// Configure logging level based on environment
if (window.log && window.log.setLevel) {
	// Use 'warn' in production mode (check URL or other indicators)
	const isProduction =
		window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');

	window.log.setLevel(isProduction ? 'warn' : 'debug');

	// Set up custom formatting
	setupLoggerFormatting();

	/**
	 * Add custom logging methods
	 */

	// Success messages (same level as info but with different styling)
	window.log.success = function (...args) {
		if (typeof window !== 'undefined' && window.chrome) {
			const timestamp = generateCurrentDatetime();
			const callerInfo = getCallSource();
			const prefix = `[${timestamp}] %c[SUCCESS]%c`;

			if (typeof args[0] === 'string') {
				console.log(`${prefix} ${args[0]}${callerInfo}`, STYLES.SUCCESS, '', ...args.slice(1));
			} else if (typeof args[0] === 'object' && args[0] !== null) {
				console.log(`${prefix}${callerInfo}`, STYLES.SUCCESS, '');
				const [formattedStr, ...styles] = formatValue(args[0]);
				console.log(formattedStr, ...styles);

				// Log any additional arguments
				if (args.length > 1) {
					args.slice(1).forEach((arg) => {
						if (typeof arg === 'object' && arg !== null) {
							const [fmtStr, ...fmtStyles] = formatValue(arg);
							console.log(fmtStr, ...fmtStyles);
						} else {
							console.log(arg);
						}
					});
				}
			} else {
				console.log(`${prefix}${callerInfo}`, STYLES.SUCCESS, '', ...args);
			}
		} else {
			console.log(`[SUCCESS] ${args[0]}`, ...args.slice(1));
		}
	};

	// System messages for internal app events
	window.log.system = function (...args) {
		if (typeof window !== 'undefined' && window.chrome) {
			const timestamp = generateCurrentDatetime();
			const callerInfo = getCallSource();
			const prefix = `[${timestamp}] %c[SYSTEM]%c`;

			if (typeof args[0] === 'string') {
				console.log(`${prefix} ${args[0]}${callerInfo}`, STYLES.SYSTEM, '', ...args.slice(1));
			} else if (typeof args[0] === 'object' && args[0] !== null) {
				console.log(`${prefix}${callerInfo}`, STYLES.SYSTEM, '');
				const [formattedStr, ...styles] = formatValue(args[0]);
				console.log(formattedStr, ...styles);

				// Log any additional arguments
				if (args.length > 1) {
					args.slice(1).forEach((arg) => {
						if (typeof arg === 'object' && arg !== null) {
							const [fmtStr, ...fmtStyles] = formatValue(arg);
							console.log(fmtStr, ...fmtStyles);
						} else {
							console.log(arg);
						}
					});
				}
			} else {
				console.log(`${prefix}${callerInfo}`, STYLES.SYSTEM, '', ...args);
			}
		} else {
			console.log(`[SYSTEM] ${args[0]}`, ...args.slice(1));
		}
	};
}

/**
 * Export configuration functions
 */

// Set debug mode
export function setDebugMode(enabled) {
	if (window.log && window.log.setLevel) {
		window.log.setLevel(enabled ? 'debug' : 'info');
	}
}

// Set trace mode (most verbose)
export function setTraceEnabled(enabled) {
	if (window.log && window.log.setLevel) {
		window.log.setLevel(enabled ? 'trace' : window.log.getLevel());
	}
}

// Constants
export const DEBUG_MODE = true;
export const TRACE_ENABLED = true;

// Export the configured logger
export default window.log || console;
