import * as path from 'path';
import * as webpack from 'webpack';

const config: webpack.Configuration = {
    mode: 'production',
    target: 'web',
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    devtool: 'source-map',
    entry: './src/ts/index.ts',
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
            test: /\.(sass|css)$/,
            use: [
                'to-string-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: (loader: any) => [
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
        }
    ]}
}

export default config;