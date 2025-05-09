const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const isProduction = 'development';

module.exports = {
	mode: 'development',
	experiments: {
		outputModule: true
	},

	target: ['web', 'es2020'],

	entry: {
		styles: ['./src/css/params.css', './src/css/styles.css'],
		bundle: './src/js/index.js'
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'js/[name].js',
		clean: true,
		module: true,
		library: { type: 'module' },
		chunkFormat: 'module',
		environment: {
			module: true,
			dynamicImport: true,
			destructuring: true,
			arrowFunction: true,
			const: true
		}
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: { publicPath: '../' }
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: !isProduction,
							importLoaders: 1
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: !isProduction,
							postcssOptions: {
								plugins: [
									'autoprefixer',
									'postcss-preset-env',
									isProduction
										? ['cssnano', { preset: 'default' }]
										: [
												'cssnano',
												{
													preset: [
														'default',
														{
															discardDuplicates: true,
															discardOverridden: true,
															discardUnused: false,
															cssDeclarationSorter: false,
															reduceIdents: false,
															zindex: false,
															normalizeWhitespace: false,
															minifyFontValues: false,
															colormin: false,
															calc: false,
															convertValues: false,
															discardComments: false,
															normalizeCharset: false,
															minifySelectors: false,
															mergeLonghand: false,
															mergeRules: false
														}
													]
												}
										  ].filter(Boolean)
								]
							}
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: ['.js']
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/bundle.css'
		})
	],
	externalsType: 'module',
	devtool: false,
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'build')
		},
		compress: true,
		port: 8080,
		open: true,
		hot: true,
		client: {
			overlay: {
				errors: true,
				warnings: false
			}
		},
		historyApiFallback: true
	},
	cache: {
		type: 'memory'
	},
	optimization: {
		removeAvailableModules: false,
		removeEmptyChunks: false,
		splitChunks: false,
		runtimeChunk: false,
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					module: true,
					compress: {
						defaults: false,
						drop_console: false,
						drop_debugger: false,
						// pure_funcs: ['console.log', 'console.info', 'console.debug'],
						dead_code: true,
						unused: true,
						sequences: false,
						conditionals: false,
						evaluate: false
					},
					mangle: false,
					format: {
						comments: true,
						beautify: true,
						ecma: 2020,
						preserve_annotations: true,
						keep_quoted_props: true,
						wrap_iife: false,
						max_line_len: 1000,
						indent_level: 2
					},
					keep_classnames: true,
					keep_fnames: true
				},
				extractComments: false
			})
		],
		moduleIds: 'named',
		chunkIds: 'named',
		usedExports: true,
		concatenateModules: true,
		sideEffects: true
	},
	stats: {
		colors: true,
		modules: false,
		children: false
	},
	performance: { hints: false }
};
