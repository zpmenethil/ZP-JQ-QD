// const path = require('path');
// const TerserPlugin = require('terser-webpack-plugin');

// module.exports = [
// 	{
// 		name: 'clean',
// 		mode: 'development',
// 		entry: './src/js/index.js',
// 		output: {
// 			path: path.resolve(__dirname, 'build/js'),
// 			filename: 'bundle.js',
// 		},
// 		module: {
// 			rules: [
// 				{
// 					test: /\.js$/,
// 					exclude: /node_modules/,
// 					use: {
// 						loader: 'babel-loader',
// 						options: {
// 							presets: ['@babel/preset-env'],
// 						},
// 					},
// 				},
// 			],
// 		},
// 		resolve: {
// 			extensions: ['.js'],
// 		},
// 		optimization: {
// 			minimize: false,
// 		},
// 		devtool: 'source-map',
// 	},

// 	// Minified bundle.min.js configuration
// 	{
// 		name: 'minified',
// 		mode: 'production',
// 		entry: './src/js/index.js',
// 		output: {
// 			path: path.resolve(__dirname, 'build/js'),
// 			filename: 'bundle.min.js',
// 		},
// 		module: {
// 			rules: [
// 				{
// 					test: /\.js$/,
// 					exclude: /node_modules/,
// 					use: {
// 						loader: 'babel-loader',
// 						options: {
// 							presets: ['@babel/preset-env'],
// 						},
// 					},
// 				},
// 			],
// 		},
// 		resolve: {
// 			extensions: ['.js'],
// 		},
// 		optimization: {
// 			minimize: true,
// 			minimizer: [
// 				new TerserPlugin({
// 					extractComments: false,
// 				}),
// 			],
// 		},
// 	},
// ];
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = [
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
        watch: true, // Enable watch mode
        watchOptions: {
            ignored: /node_modules/,
            aggregateTimeout: 300, // Delay before rebuilding
            poll: 1000, // Check for changes every second
        }
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
        watch: true,
        watchOptions: {
            ignored: /node_modules/,
            aggregateTimeout: 300,
            poll: 1000,
        }
    },
];