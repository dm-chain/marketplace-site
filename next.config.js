const path = require('path');
const images = require('next-images');
const videos = require('next-videos');
const withTM = require('next-transpile-modules')(['@tonclient/lib-web']);
const withPlugins = require('next-compose-plugins');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = withPlugins([
  videos(
    images({
      fileExtensions: ['jpg', 'jpeg', 'png', 'gif'],
      webpack(config, { isServer }) {
        config.module.rules.push({
          test: /\.svg$/,
          issuer: {
            test: /\.(js|ts)x?$/,
          },
          use: ['@svgr/webpack'],
        });

        if (isServer) {
          return {
            ...config,
            entry() {
              return config.entry().then((entry) => ({
                ...entry,
                worker: path.resolve(process.cwd(), 'src/scripts/coingecko.ts'),
              }));
            }
          };
        }

        return config;
      },
      sassOptions: {
        includePaths: [path.join(__dirname, './src/resources/styles')],
        prependData: `
              @import "mixins";
              @import "variables";
          `,
      },
    })
  ),
  // TODO: doesnt work
  new CopyPlugin({
    patterns: [{ from: './node_modules/@tonclient/lib-web/tonclient.wasm', to: './public' }],
  }),
  withTM,
]);
