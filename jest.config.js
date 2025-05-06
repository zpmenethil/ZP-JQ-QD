module.exports = {
	testEnvironment: 'jest-environment-jsdom',
	clearMocks: true,
	coverageDirectory: 'coverage',
	transform: { '^.+.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['@babel/preset-env'] }] },
	transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],
	moduleNameMapper: {},
};
