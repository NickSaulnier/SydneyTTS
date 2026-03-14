const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mainConfig = {
  mode: process.env.NODE_ENV || 'development',
  target: 'electron-main',
  entry: path.join(__dirname, 'src', 'main', 'main.ts'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: { compilerOptions: { noEmit: false } },
        },
        exclude: /node_modules/,
      },
    ],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};

const rendererConfig = {
  mode: process.env.NODE_ENV || 'development',
  target: 'electron-renderer',
  entry: path.join(__dirname, 'src', 'renderer', 'index.tsx'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'renderer.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: { compilerOptions: { noEmit: false } },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
{
            loader: 'sass-loader',
            options: { sassOptions: { silenceDeprecations: ['legacy-js-api'] } },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'renderer', 'index.html'),
      filename: 'index.html',
    }),
  ],
  devtool: 'source-map',
};

module.exports = [mainConfig, rendererConfig];
