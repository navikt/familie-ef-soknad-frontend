import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { sentryWebpackPlugin } from '@sentry/webpack-plugin';

const publicPath = process.env.PUBLIC_URL || '/';
const kopieresOver = ['filer', 'favicon.ico', 'manifest.json', 'robots.txt'];

const config = {
  mode: 'production',
  entry: {
    'familie-ef-soknad': ['./src/index.tsx'],
  },
  output: {
    path: path.join(process.cwd(), 'build'),
    filename: '[name].[contenthash].js',
    publicPath: publicPath,
    clean: true,
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs'],
    fallback: { crypto: false, fs: false, path: false, os: false },
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js|tsx|ts)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        include: path.join(process.cwd(), 'src'),
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                namedExport: false,
              },
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'icss',
              },
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['autoprefixer']],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/,
        type: 'asset/resource',
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.svg$/i,
        use: ['@svgr/webpack', 'url-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.PUBLIC_URL': JSON.stringify(publicPath),
    }),
    new MiniCssExtractPlugin(),
    new ESLintPlugin({
      configType: 'flat',
      extensions: [`ts`, `tsx`],
      emitWarning: true,
      emitError: false,
    }),
    new CopyPlugin({
      patterns: kopieresOver.map((navn) => {
        return {
          from: path.join(process.cwd(), `public/${navn}`),
          to: path.join(process.cwd(), `build/${navn}`),
        };
      }),
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),

    new HtmlWebpackPlugin({
      publicPath: publicPath,
      template: path.join(process.cwd(), 'public/index.html'),
      inject: 'body',
      alwaysWriteToDisk: true,
    }),
    new ForkTsCheckerWebpackPlugin({
      async: true,
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
    process.env.SENTRY_AUTH_TOKEN
      ? sentryWebpackPlugin({
          org: 'nav',
          url: 'https://sentry.gc.nav.no/',
          project: 'familie-ef-soknad',
          authToken: process.env.SENTRY_AUTH_TOKEN,
          release: {
            name: process.env.SENTRY_RELEASE,
            uploadLegacySourcemaps: {
              paths: ['build'],
              urlPrefix: `~${publicPath}`,
            },
          },
          errorHandler: (err) => {
            console.warn('Sentry CLI Plugin: ' + err.message);
          },
        })
      : undefined,
  ],
  optimization: {
    minimizer: [new TerserPlugin()],
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: true,
    emitOnErrors: false,
  },
};

export default config;
