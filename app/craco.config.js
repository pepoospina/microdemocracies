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
          process: {
            browser: true,
            env: {
              NODE_ENV: '"development"',
              MAGIC_API_KEY: '"pk_live_5BF359361B5DB7B0"',
              ALCHEMY_KEY: '"lGUBeOhnguEVW2l5uSTRKQWs5xfts0dz"',
              FUNCTIONS_BASE: '"http://127.0.0.1:5001/microrevolutions-a6bcf/europe-west1"',
              ALCHEMY_GAS_POLICY_ID: '"4bb896df-1684-4e86-b732-07f696ecf2be"',
            },
          },
        }),
      ],
    },
  },
  plugins: [],
};
