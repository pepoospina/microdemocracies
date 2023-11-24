import * as base from './craco.config';

const webpack = require('webpack');

webpack.configure.plugins = [
  ...webpack.configure.plugins,
  new webpack.DefinePlugin({
    process: {
      ...webpack.configure.plugins.process,
      env: {
        ...webpack.configure.plugins.process.env,
        NODE_ENV: 'production',
        FUNCTIONS_BASE: 'https://europe-west1-microrevolutions-a6bcf.cloudfunctions.net',
      },
    },
  }),
];

module.exports = base;
