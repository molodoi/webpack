const path = require('path');

const webpack = require('webpack');

// minifie le code js
//https://github.com/babel/babel-loader
//npm i -D uglifyjs-webpack-plugin
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

//Extract text from a bundle, or bundles, into a separate file.
//npm install --save-dev extract-text-webpack-plugin
const ExtractTextPlugin = require('extract-text-webpack-plugin');

//Webpack plugin for generating an asset manifest.
//npm install --save-dev webpack-manifest-plugin
const ManifestPlugin = require('webpack-manifest-plugin');

//A webpack plugin to remove/clean your build folder(s) before building
//npm i clean-webpack-plugin --save-dev
const CleanWebpackPlugin = require('clean-webpack-plugin');

const dev = process.env.NODE_ENV === "dev";

//Permet de charger et faire de import de librairies un peu partout dans nos fichier js
//npm install --save-dev babel-plugin-syntax-dynamic-import 

//The css-loader interprets @import and url() like import/require() and will resolve them.
//npm install --save-dev css-loader

//Adds CSS to the DOM by injecting a <style> tag
//npm install --save-dev style-loader

//Sass loader for webpack. Compiles Sass to CSS.
//npm install -D sass-loader node-sass

//Loads files as base64 encoded URL
//npm install --save-dev url-loader
//npm install --save-dev file-loader
//npm install img-loader --save-dev

//JavaScript style guide, with linter & automatic code fixer
//npm install eslint-loader --save-dev
//npm install --save-dev eslint-config-standard eslint-plugin-standard eslint-plugin-promise eslint-plugin-import eslint-plugin-node

//Serves a webpack app. Updates the browser on changes.
//npm install webpack-dev-server --save-dev


//https://www.npmjs.com/package/cross-env
//npm install --save-dev cross-env

// gérer les loaders css dynamiquement
let cssLoaders = [
                    { loader: "css-loader",
                        options: {
                            importLoaders: 1, // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                            minimize: !dev
                        } 
                    } // translates CSS into CommonJS
                ];

if(!dev){
    cssLoaders.push(
        {
            loader: 'postcss-loader',
            options: {
                plugins: (loader) => [
                    require('autoprefixer')({
                        browsers: ["last 2 versions", "ie > 8"]
                    })
                ]
            }
        }
    );
}

let config = {
    //entry: Désigne le point d’entré de votre application, quel fichier Webpack va regarder.
    entry: {
        app: ['./assets/css/app.scss','./assets/js/app.js']
    },

    //output: le fichier que Webpack va générer à la fin. 
    output: {
        //path: la destination du fichier sortant.
        path: path.resolve(__dirname, '/public/assets/'),
        //filename: le nom du fichier sortant.
        filename: dev ? '[name].js' : '[name].[chunkhash:8].js',
        publicPath: "/assets/"
    },

    //détecte les changements
    watch: dev,

    //https://webpack.js.org/configuration/devtool/
    //This option controls if and how source maps are generated.
    //Use the SourceMapDevToolPlugin for a more fine grained configuration. See the source-map-loader to deal with existing source maps.
    devtool: dev ? "cheap-module-eval-source-map" : false,

    devServer: {
        contentBase: path.resolve(__dirname, '/public')
    },

    //module: l’endroit dans lequel on va préciser à Webpack quoi faire.
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: cssLoaders
            },
            {
                test: /\.scss$/,
                // Extraire dans un fichier css
                use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [ 
                    ...cssLoaders,
                    "sass-loader" // compiles Sass to CSS
                ]
                }) 
            },
            {
                test: /\.(woff2?|eat|ttf|otf|wav)(\?;*)?$/,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            },
            {
                //test: /\.(png|jpe?g|gif|svg|woff2?|eat|ttf|otf|wav)(\?;*)?$/,
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[hash:7].[ext]'
                        }
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            enabled: !dev
                        }
                    }
                ]
            }
        ]
    },
    // contient la liste des plugins que nous allons utiliser
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery'
        }),
        new ExtractTextPlugin({
            filename: dev ? '[name].css' : '[name].[contenthash:8].css',
            disable: dev
        })
    ]
}

// Si on est dans un environnement de prod différent de SET NODE_ENV=dev dans package.json on Uglify
if(!dev){
    config.plugins.push(new UglifyJSPlugin({
        sourceMap: false
    }));
    config.plugins.push(
        new ManifestPlugin()
    );

    // the path(s) that should be cleaned
    let pathsToClean = [
        'dist'
    ]

    // the clean options to use
    let cleanOptions = {
        root:     path.resolve('./'),
        verbose:  true,
        dry:      false
    }

    config.plugins.push(
        new CleanWebpackPlugin(pathsToClean, cleanOptions)
    );
}

module.exports = config; 