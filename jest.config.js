module.exports = {
	// Indicates that the test environment is jsdom (browser-like)
	testEnvironment: 'jest-environment-jsdom',
	// Automatically clear mock calls and instances between every test
	clearMocks: true,
	// The directory where Jest should output its coverage files
	coverageDirectory: 'coverage',
	// Use babel-jest to transpile tests with the next/babel preset
	// https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
	transform: {
		'^.+.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['@babel/preset-env'] }]
	},
	// Transform ES modules from node_modules if necessary
	// Add any packages that use ESM and need transformation
	transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],
	// Add module name mappings if needed (e.g., for CSS modules or assets)
	moduleNameMapper: {
		// Example: Mock CSS Modules
		// '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
	}
	// Setup files to run before each test file
	// setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Uncomment if you create a setup file
};
