const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin') ;
const merge = require('webpack-merge');

require('@babel/polyfill')

module.exports = (env, opts) => {
  const config = {
    // 중복되는옵션
    resolve: {
      extensions: ['.vue','.js']
    },
    entry: { // 진입점
      app: [
        '@babel/polyfill', // polyfill 설정
        path.join(__dirname, 'main.js') // __dirname 현재경로
      ]
    },
    output: { // 결과물에 대한 설정
      filename: '[name].js', // entry 별칭이 들어간다
      path: path.join(__dirname, 'dist') // dist 생성 후 app.js를 넣겠다
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader', 
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader', 
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
      }),
      new CopyPlugin({
        patterns :[{
          from: 'assets/',
          to: ''
        }]
      }),
    ],
  };

  if(opts.mode === 'development'){
    return merge(config, {
      devtool: 'eval',
      devServer: {
        open:false,
        hot: true
      }
    })
  } else {
    return merge(config, {
      devtool: 'cheap-module-source-map',
      plugins: [
        new CleanWebpackPlugin()
      ]
    })
  }

}