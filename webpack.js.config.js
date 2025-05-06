const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = [
	// Clean bundle.js configuration
	{
		name: 'clean',
		mode: 'development',
		entry: './src/js/index.js',
		output: {
			path: path.resolve(__dirname, 'build/js'),
			filename: 'bundle.js',
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
						},
					},
				},
			],
		},
		resolve: {
			extensions: ['.js'],
		},
		optimization: {
			minimize: false,
		},
		devtool: 'source-map',
	},

	// Minified bundle.min.js configuration
	{
		name: 'minified',
		mode: 'production',
		entry: './src/js/index.js',
		output: {
			path: path.resolve(__dirname, 'build/js'),
			filename: 'bundle.min.js',
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
						},
					},
				},
			],
		},
		resolve: {
			extensions: ['.js'],
		},
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					extractComments: false,
				}),
			],
		},
	},
];
