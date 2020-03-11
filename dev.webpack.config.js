const path = require('path');

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, './src'),
    entry: './index.js',
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
        }
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
      },
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
                test: /\.(scss|css)$/,
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