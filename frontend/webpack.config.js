const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js", // relative to the frontend directory app
  mode: "development",
  output: {
    path: path.resolve(__dirname, "./static/frontend"), // current directory
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  optimization: {
    minimize: true, // smaller js
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
  ],
};