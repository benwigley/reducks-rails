const webpack = require("webpack");
const path = require('path');

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: ["babel-loader"],
        exclude: /node_modules/,
      }
    ]
  },
  entry: {
    main: "./index.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "reducks-rails-demo.js"
  },
  devtool: "cheap-module-eval-source-map",
  resolve: {
    alias: {
      "reducks-rails": path.resolve(
        path.join(__dirname, "..", "src", "index.js")
        // path.join(__dirname, "..", "dist", "reducks-rails.js")
      )
    },
    extensions: [".js", ".jsx"]
  },
}
