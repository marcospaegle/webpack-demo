const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

module.exports = {
    mode: (process.env.NODE_ENV === 'production') ? process.env.NODE_ENV : 'development',
    entry: {
        app: [
            './src/js/app.js',
            './src/scss/app.scss'
        ]
    },
    output: {
        path: path.resolve(__dirname, './public/assets/js'),
        filename: '[name].[hash].js'
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
                test: /\.(png|jpe?g|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '../images/[name].[hash].[ext]'
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '../css/[name].[hash].css'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: (process.env.NODE_ENV === 'production') ? true : false
        }),
        new PurgecssPlugin({
            paths: glob.sync(`${path.join(__dirname, 'public')}/**/*`, {nodir: true})
        })
    ]
};
