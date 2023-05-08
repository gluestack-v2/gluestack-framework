/** @type {import('next').NextConfig} */
const webpack = require("webpack");
const nextConfig = {
  reactStrictMode: true,
  // `SOURCEPATH` our source code path of our project
  // `SOURCEPATH` will be replaced at the time of build.
  transpilePackages: process.env.NODE_ENV === 'development' ?  ['SOURCEPATH'] : [],
  webpack: (config, { dev, isServer }) => {
    if (process.env.NODE_ENV === "development") {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /.tsx$/,
          resource => {
            // Set resource context for error debugging
            resource.context = 'SOURCEPATH';
          }
        ));
    }
    return config;
  },
}

module.exports = nextConfig
