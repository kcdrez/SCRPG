"use strict";

const webpack = require("webpack");
const jquery = require("jquery");
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: ["./src/app.js"],
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".vue"],
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
      components: path.resolve(__dirname, "../src/components"),
      pages: path.resolve(__dirname, "../src/pages"),
      store: path.resolve(__dirname, "../src/vuex-state"),
      scripts: path.resolve(__dirname, "../src/scripts"),
      styles: path.resolve(__dirname, "../src/styles"),
    },
  },
  devServer: {
    hot: true,
    static: {
      watch: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      // {
      //   test: /\.tsx?$/,
      //   loader: "ts-loader",
      //   options: {
      //     appendTsSuffixTo: [/\.vue$/],
      //   },
      //   exclude: /node_modules/,
      // },
      {
        test: /\.scss$/,
        use: [
          "vue-style-loader",
          "css-loader",
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.png$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[path][name].[hash].[ext]",
          },
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
      // {
      //   test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      //   loader: 'url-loader?limit=100000'
      // }
    ],
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      inject: true,
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jquery: "jquery",
      "window.jQuery": "jquery",
      jQuery: "jquery",
    }),
    new CopyPlugin({
      patterns: [{ from: "src/assets/images", to: "images" }],
    }),
  ],
};
