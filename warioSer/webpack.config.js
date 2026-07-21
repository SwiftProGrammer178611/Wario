const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  return {
    mode: argv.mode || 'development',
    entry: './src/js/canvas.js',
    output: {
      path: __dirname + '/dist/',
      filename: './js/canvas.bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader'
            }
          ]
        }
      ]
    },
    plugins: [
      ...(isProduction
        ? []
        : [
            new BrowserSyncPlugin({
              host: 'localhost',
              port: 3000,
              server: { baseDir: ['dist'] },
              files: ['./dist/*'],
              notify: false
            })
          ]),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        favicon: 'favicon.ico',
        template: 'src/index.html'
      })
    ],
    watch: !isProduction,
    devtool: isProduction ? false : 'source-map'
  }
}