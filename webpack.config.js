const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

console.log('Directory: ', __dirname)

module.exports = env => {
  return {
    devtool: false,
    entry: path.join(__dirname, 'src', 'index.js'),
    externals: {
      redux: {
        commonjs: 'redux',
        commonjs2: 'redux',
        amd: 'redux',
        root: 'redux'
      }
    },
    mode: env.production ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.js$/,
          loaders: ['babel-loader'],
          exclude: /node_modules/,
        }
      ]
    },
    output: {
      filename: 'reducks-rails.js',
      library: 'reducks-rails',
      libraryTarget: 'umd',
      globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
    optimization: {
      minimize: true,
      minimizer: [
        env.production && new TerserPlugin({
          test: /\.js(\?.*)?$/i,
        }),
      ].filter(plugin => !!plugin),
    },
    plugins: [
      env.development && new BundleAnalyzerPlugin(),
    ].filter(plugin => !!plugin) // filter out false items
  }
}
