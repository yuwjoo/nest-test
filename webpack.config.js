const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = () => {
  return {
    mode: process.env.NODE_ENV,
    optimization: {
      nodeEnv: undefined,
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './public',
            to: './public',
          },
          {
            from: `./src/configuration/configs/config.${process.env.NODE_ENV}.yaml`,
            to: './config.yml',
          },
          {
            from: './package.json',
            to: './package.json',
          },
        ],
      }),
    ],
  };
};
