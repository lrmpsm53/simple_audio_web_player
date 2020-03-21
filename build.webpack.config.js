const path = require('path');

module.exports = {
    mode: 'production',
    target: 'web',
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    context: path.resolve(__dirname, './src'),
    entry: './ts/index.ts',
    output: {
        library: 'Player',
        filename: './player.js',
        path: path.resolve(__dirname, './lib')
    },
    module: { rules: [
        {
            test: /\.tsx?$/, loader: "ts-loader"
        },
        {
            test: /\.(scss|css)$/,
            use: [
                'to-string-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: (loader) => [
                        require('postcss-import')({ root: loader.resourcePath }),
                        require('postcss-preset-env'),
                        require('cssnano'),
                        require('autoprefixer')
                        ]
                    }
                },
                {   
                    loader: 'sass-loader',
                    options: {implementation: require('node-sass')}
                }
            ]
        },
        {
            test: /\.(png|jpe?g|gif|svg|ttf|otf)$/i,
            loader: 'base64-inline-loader',
            options: {limit: false}
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
        },
    ]}
}