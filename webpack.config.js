const webpack = require('webpack');
const path = require('path');
const glob = require('glob');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const inProduction = (process.env.NODE_ENV === 'production') ? true : false;

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        app: [
            './src/js/app.js',
            './src/scss/app.scss'
        ],
        vendor: [
            './src/js/vendor.js',
            './src/scss/vendor.scss'
        ]
    },
    output: {
        path: path.resolve(__dirname, './public/assets/js'),
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: 'raw-loader'
              }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '../css/[name].[chunkhash].css'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: inProduction
        }),
        new PurgecssPlugin({
            paths: glob.sync(`${path.join(__dirname, 'public')}/**/*`, {nodir: true}),
            minimize: inProduction
        }),
        new CleanWebpackPlugin({
            verbose: true,
            dry: false
        }),
        function() {
            this.plugin('done', stats => {
                require('fs').writeFileSync(
                    path.join(__dirname, 'public/manifest.json'),
                    JSON.stringify(stats.toJson().assetsByChunkName)
                );
            });
        } 
    ]
};
