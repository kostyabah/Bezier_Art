var webpack = require('webpack');
var path = require("path");
var preact = require("preact");
module.exports = {
    entry: "./main.js",
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: "build/",
        filename: "bundle.js"
    },
    devServer: {
        contentBase: path.join(__dirname, '/'),
        port: 8080
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        //presets: ["@babel/preset-env"],
                        plugins: [
                            ["@babel/plugin-transform-react-jsx", { pragma: "h" }],
                            ["@babel/plugin-proposal-class-properties"],
                            ["@babel/plugin-proposal-object-rest-spread"]
                        ]
                    }
                },

                exclude: [/node_modules/, /public/],
            },
            {
                test: /.\sass$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'auto-prefixer' },
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'auto-prefixer' }
                ],
                //loader: "style-loader!css-loader!autoprefixer-loader",
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'auto-prefixer' },
                    { loader: 'less-loader' }
                ],
                //loader: "style-loader!css-loader!autoprefixer-loader!less-loader",
                exclude: [/node_modules/, /public/]
            },

            {
                test: /\.(jpe?g|gif|png|svg)$/,
                use: [
                    { loader: 'file-loader' },
                    { loader: "url-loader" }
                ]
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.txt$/,
                loader: 'raw-loader'
            }
        ]
    }
};