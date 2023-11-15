const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          crypto: require.resolve('crypto-browserify'),
          os: require.resolve('os-browserify'),
        },
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.browser': true,
        }),
      ],
    },
  },
  plugins: [],
};
