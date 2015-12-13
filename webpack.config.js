var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  resolve: {
    modulesDirectories: [
      './js',
      'node_modules',
    ],
  },
  entry: './js/index.js',
  output: {
    filename: 'build/bundle.js',
  },
  plugins: [
    new webpack.ProvidePlugin({
      THREE: 'three.js',
    }),
  ],
  module: {
    loaders: [
      { test: /\.(glsl|vs|fs)$/, loader: 'shader' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.json$/, loader: 'json' },
      { test: /\.(js|jsx)$/, loader: 'babel' },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url?limit=10000',
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
      },
    ],
  },
};
