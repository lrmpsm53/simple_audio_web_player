import path from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';

module.exports = {
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
        port: '80'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
      },
      plugins: [
        new HTMLWebpackPlugin({
            title: 'Test',
            inject: 'head',
            scriptLoading: 'defer',
            showErrors: true,
            meta: {
                charset: 'UTF-8',
                viewport: 'width=device-width, initial-scale=1.0'
            }
          }),
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
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: './index.html',
                            esModule: true
                        }
                    },
                    'extract-loader',
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true,
                            interpolate: true
                        }
                    }
                ]
            }
        ]
    }
}