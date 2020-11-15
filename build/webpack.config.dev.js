'use strict'

const webpack = require('webpack');
const jquery = require('jquery');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    './src/app.js'
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    hot: true,
    watchOptions: {
      poll: true
    }
  },  
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.scss$/,
        use: [ 'vue-style-loader', 'css-loader', 
          {
            loader: 'sass-loader'
          }
        ]
      },
      {    
        test: /\.css$/,    
        use: ['style-loader','css-loader']  
      },
      {    
        test: /\.png$/,    
        use: {
          loader: "file-loader",
          options: {
            name: '[path][name].[hash].[ext]'
          }
        } 
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
      // { 
      //   test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
      //   loader: 'url-loader?limit=100000' 
      // }
    ]
  },  
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets/images', to: 'images'}
      ]
    })
  ]
}