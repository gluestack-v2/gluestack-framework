/** @type {import('next').NextConfig} */
const { withGluestackUI } = require('@gluestack/ui-next-adapter');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['react-native-svg', 'react-native', 'react-native-web'],
};

module.exports = withGluestackUI(nextConfig);
