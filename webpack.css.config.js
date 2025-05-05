const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (_, argv) => {
	const config = {
		entry: './src/css/styles.css',
		output: {
			path: path.resolve(__dirname, 'build'),
			filename: 'css/temp.js'
		},
		module: {
			rules: [
				{
					test: /\.css$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader'
						// Removed postcss-loader to avoid the error
					]
				}
			]
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: argv.mode === 'production' ? 'css/bundle.min.css' : 'css/bundle.css'
			})
		]
	};

	if (argv.mode === 'development') {
		config.mode = 'development';
		config.devtool = 'source-map';
	} else {
		config.mode = 'production';
		config.optimization = {
			minimizer: [new CssMinimizerPlugin()],
			minimize: true
		};
	}

	return config;
};
