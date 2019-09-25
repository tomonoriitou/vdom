//const webpack = require("webpack");
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const pjson = require('./package.json');
// const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

//
let production = false;
if (process.env.NODE_ENV === 'production') {
  console.log('production mode');
  production = true;
}else{
  console.log('development mode');
}

module.exports = {

  // mode
  mode: production?'production':'development',
  // sourcemap
  devtool: production?'source-map':'inline-source-map',

  //
  entry: {
    'main': ['./src/main.ts'],
    'vdom': ['./src/index.ts'],
    'vdom.ie11': ['./src/index.ie11.ts'],
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'js/[name].js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      //
      {
        test: /\.template\.html$/,
        loaders: [
          {
            loader: 'raw-loader',
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          //{ loader: 'style-loader', options: { injectType: 'lazyStyleTag' } },
          // 'style-loader', // creates style nodes from JS strings
          'to-string-loader',
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ],
      }
      //
    ]
  },

  //
  resolve: {
    extensions: ['.ts', '.d.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({configFile: './tsconfig.json',})],
  },

  plugins: (production)?[
    new CompressionPlugin({
      test: /\.(css)|(js)$/,
      compressionOptions: {
        level: 6
      }
    }),
    new BundleAnalyzerPlugin()
  ]:[
  ],

  //
	devServer: {
    //open: true,//ブラウザを自動で開く
    openPage: "index.html",//自動で指定したページを開く
    contentBase: path.join(__dirname, 'public'),// HTML等コンテンツのルートディレクトリ
    watchContentBase: true,//コンテンツの変更監視をする
    //
    port: 4004, // ポート番号
		host: '0.0.0.0',
		useLocalIp: true
	}

};
