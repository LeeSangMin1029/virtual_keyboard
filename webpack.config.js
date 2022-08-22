// ./webpack.config.js
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtrackPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
module.exports = {
  // webpack에게 다른 모듈을 사용하고 있는 최상위 모듈의 위치를 알려준다.
  entry: "./src/js/index.js",
  // webpack이 번들링한 모듈의 위치와 이름을 정해준다.
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
    clean: true,
  },
  devtool: "source-map",
  mode: "development",
  // 개발을 편하게 도와주는 옵션
  devServer: {
    host: "localhost",
    open: true,
    port: 8080,
    watchFiles: "index.html",
  },
  // loader가 할 수 없는 일을 대신할 목적, 웹팩 전체적인 과정에 개입가능
  plugins: [
    new HtmlWebpackPlugin({
      title: "keyboard",
      template: "./index.html",
      inject: "body",
      favicon: "./favicon.ico", // 이건 아무런 icon 다운로드 해서 최상위에 위치시키면 된다.
    }),
    new MiniCssExtrackPlugin({
      filename: "style.css",
    }),
  ],
  module: {
    rules: [
      {
        test: [/\.css$/],
        use: [MiniCssExtrackPlugin.loader, "css-loader"],
      },
    ],
  },
  // html, css, js 등 여러가지 모듈의 최적화를 위한 옵션
  optimization: {
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
};
