const path = require('path')

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
    plugins: [
      // somePluginEnabled && new SomePlugin()
    ].filter(plugin => !!plugin) // filter out false items
  }
}
