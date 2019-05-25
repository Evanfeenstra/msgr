/* global __dirname, require, module*/
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

const NAMESPACE = 'dist'

module.exports = {
    entry: {
        'index': './src/Camera',
    },
    // externals: {
    //   'unistore':'unistore',
    //   'unissist':'unissist'
    // },
    externals: {
      'react': 'react'
    },
    output: {
      path: path.resolve(__dirname, NAMESPACE),
      filename: '[name].js',
      library: 'h2h',
      libraryTarget: 'commonjs2'
    },
    target:'web',
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.json']
    },
    // optimization: {
    //   minimizer: [new TerserPlugin()],
    // },
    plugins: [new UglifyJsPlugin({ 
      uglifyOptions: {
        mangle: true,
        output: {
          comments: false
        }
      },
      sourceMap: false,
      exclude: [/\.min\.js$/gi]
    })],
    node: {fs: "empty"}
}


