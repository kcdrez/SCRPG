'use strict'
//https://github.com/microsoft/TypeScript-Vue-Starter
const path = require('path');
const webpack = require('webpack');
const jquery = require('jquery');
const { VueLoaderPlugin } = require('vue-loader'); //ts slightly different?
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    './src/app.ts'
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },  
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
        // options: {
        //   loaders: {
        //     // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
        //     // the "scss" and "sass" values for the lang attribute to the right configs here.
        //     // other preprocessors should work out of the box, no loader config like this necessary.
        //     'scss': 'vue-style-loader!css-loader!sass-loader',
        //     'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
        //   }
        //   // other vue-loader options go here
        // }
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
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
        use: ['vue-style-loader','css-loader'] //ts slightly different?
      },
      {    
        test: /\.(png|jpg|gif|svg)$/,    
        use: {
          loader: "file-loader",
          options: {
            name: '[path][name].[hash].[ext]' //ts slightly different?
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