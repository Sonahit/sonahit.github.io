const merge = require("webpack-merge");
const base = require("./webpack.base.conf");
const path = require("path");
const BUILD_BASE = path.resolve(__dirname, "./dist");
const webpack = require("webpack");

const dev = merge(base, {
  mode: "development",
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: BUILD_BASE,
    publicPath: "/",
    compress: true,
    port: 8080,
    hot: true,
    historyApiFallback: true
  },
  devtool: "eval-source-map"
});

module.exports = dev;
