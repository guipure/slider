const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function getRules(type) {
  const scssLoaders = {
    dev: ['style-loader', 'css-loader', 'sass-loader'],
    prod: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
  };

  return [
    {
      test: /\.(scss)$/,
      use: scssLoaders[type],
    },
    {
      test: /\.ts$/,
      use: 'ts-loader',
    },
  ];
}

function getPlugins(type) {
  return [
    new HTMLWebpackPlugin({
      currentEnv: process.env.NODE_ENV,
      filename: 'index.html',
      template: './demo/index.html',
    }),
    new CleanWebpackPlugin(),
  ].concat(type === 'prod' ? (
    new MiniCssExtractPlugin({
      filename: 'styles/[name].bundle.css',
    })
  ) : []);
}

const commonConfig = {
  target: 'web',
  context: path.resolve(__dirname, '..', 'src'),
  entry: {
    demo: './demo/index.ts',
    slider: ['./plugin/slider.ts', './plugin/slider.scss'],
  },
  output: {
    filename: 'scripts/[name].bundle.js',
    path: path.resolve(__dirname, '..', 'dist'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
};

module.exports = { commonConfig, getRules, getPlugins };
