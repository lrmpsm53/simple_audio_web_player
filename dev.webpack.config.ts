import * as path from 'path';
import * as webpack from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';

const config: webpack.Configuration = {
    mode: 'development',
    entry: './test.ts',
    output: {
        filename: './player.js',
        path: path.resolve(__dirname, './lib')
    },
    target: 'web',
    devtool: 'eval',
    devServer: {
        contentBase: path.resolve(__dirname, './'),
        hot: true,
        watchContentBase: true,
        watchOptions: {
            poll: true
        },
        port: 80
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
      },
      plugins: [
        new HTMLWebpackPlugin({ title: 'Test' })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    'cache-loader',
                    'ts-loader'
                ]
            },
            {
                test: /\.(sass|css)$/,
                use: [
                    'to-string-loader',
                    'css-loader',
                    {   
                        loader: 'sass-loader',
                        options: {implementation: require('node-sass')}
                    },
                    'cache-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|ttf|otf)$/i,
                loader: 'svg-url-loader',
                options: {
                    limit: false,
                }
            }
        ]
    }
}

export default config;