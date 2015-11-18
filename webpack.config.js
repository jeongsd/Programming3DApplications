module.exports = {
  devtool: 'eval',
  resolve: {
    modulesDirectories: [
      './js',
      'node_modules',
    ],
  },
  entry: './js/app.js',
  output: {
    filename: 'build/bundle.js',
  },
  module: {
    loaders: [
      { test: /\.(glsl|vs|fs)$/, loader: 'shader' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.(js|jsx)$/, loader: 'babel' },
    ],
  },
};
