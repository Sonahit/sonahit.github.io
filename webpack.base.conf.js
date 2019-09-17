const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const BUILD_BASE = path.resolve(__dirname, "./dist");
const config = require("./config");
const baseConfig = {
  mode: "none",
  entry: {
    app: path.resolve(__dirname, "./src/index.js")
  },
  output: {
    filename: config.isProduction ? "[name].[hash].bundle.js" : "[name].bundle.js",
    path: BUILD_BASE
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(sc|c|sa)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: config.isProduction,
              reloadAll: true
            }
          },
          "css-loader"
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        loader: "file-loader",
        options: {
          name: "[name].[ext]"
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      hash: config.isProduction,
      template: path.resolve(__dirname, "./public/index.html"),
      inject: true
    }),
    new MiniCssExtractPlugin({
      filename: config.isProduction ? `css/[name].[hash].css` : `css/[name].css`,
      chunkFilename: config.isProduction ? `css/[id].[hash].css` : `css/[id].css`,
      ignoreOrder: false
    }),
    new CleanWebpackPlugin()
  ]
};

module.exports = baseConfig;
