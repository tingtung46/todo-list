const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');

 module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
     static: './dist',
  },
  module: {
    rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
  },
  optimization: {
    runtimeChunk: 'single',
  },
 });