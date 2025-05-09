const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const isProduction = 'prodution';

module.exports = {
	mode: 'production',
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
		filename: 'js/[name].min.js',
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
							sourceMap: false,
							importLoaders: 1
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: false,
							postcssOptions: {
								plugins: [
									'autoprefixer',
									'postcss-preset-env'
										? // !isProduction
										  ['cssnano', { preset: 'default' }]
										: [
												'cssnano',
												{
													preset: [
														'default',
														{
															discardDuplicates: true, // NEES TO BE UPDATED FOR PRODUCTION
															discardOverridden: true, // NEES TO BE UPDATED FOR PRODUCTION
															discardUnused: false, // NEES TO BE UPDATED FOR PRODUCTION
															cssDeclarationSorter: false, // NEES TO BE UPDATED FOR PRODUCTION
															reduceIdents: false, // NEES TO BE UPDATED FOR PRODUCTION
															zindex: false, // NEES TO BE UPDATED FOR PRODUCTION
															normalizeWhitespace: false, // NEES TO BE UPDATED FOR PRODUCTION
															minifyFontValues: false, // NEES TO BE UPDATED FOR PRODUCTION
															colormin: false, // NEES TO BE UPDATED FOR PRODUCTION
															calc: false, // NEES TO BE UPDATED FOR PRODUCTION
															convertValues: false, // NEES TO BE UPDATED FOR PRODUCTION
															discardComments: false, // NEES TO BE UPDATED FOR PRODUCTION
															normalizeCharset: false, // NEES TO BE UPDATED FOR PRODUCTION
															minifySelectors: false, // NEES TO BE UPDATED FOR PRODUCTION
															mergeLonghand: false, // NEES TO BE UPDATED FOR PRODUCTION
															mergeRules: false // NEES TO BE UPDATED FOR PRODUCTION
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
			filename: 'css/bundle.min.css'
		})
	],
	externalsType: 'module',
	devtool: false,
	cache: {
		type: 'filesystem'
	},
	optimization: {
		removeAvailableModules: true,
		removeEmptyChunks: true,
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
						drop_debugger: true,
						pure_funcs: ['console.debug', 'logger.debug'],
						dead_code: true,
						unused: true,
						sequences: true,
						conditionals: true,
						evaluate: true
					},
					mangle: true,
					format: {
						comments: false,
						beautify: false,
						ecma: 2020,
						preserve_annotations: false,
						keep_quoted_props: false,
						// wrap_iife: false,
						// max_line_len: 1000,
						indent_level: 2
					},
					keep_classnames: false,
					keep_fnames: false
				},
				extractComments: false
			})
		],
		moduleIds: 'named',
		chunkIds: 'named', // try `deterministic` for better caching
		usedExports: true,
		concatenateModules: true,
		sideEffects: true
	},
	stats: {
		colors: true,
		modules: false,
		children: false
	},
	performance: { hints: false, maxEntrypointSize: 250000, maxAssetSize: 250000 }
};
