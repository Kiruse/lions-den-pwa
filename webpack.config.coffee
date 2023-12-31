path = require 'path'
CopyPlugin = require 'copy-webpack-plugin'
HtmlWebpackPlugin = require 'html-webpack-plugin'
{VueLoaderPlugin} = require 'vue-loader'
{EnvironmentPlugin, ProvidePlugin} = require 'webpack'
YAML = require 'yaml'
RoutesPlugin = require './plugins/routes-plugin'
require 'dotenv/config'

process.env.APIURL ?= '/api'

ASSETSPATH     = path.resolve __dirname, 'assets'
VIEWPATH       = path.resolve __dirname, 'views'
LIBPATH        = path.resolve __dirname, 'lib'
HOOKSPATH      = path.resolve __dirname, 'hooks'
COMPONENTSPATH = path.resolve __dirname, 'components'

module.exports =
  entry:
    index:
      import: path.resolve ASSETSPATH, 'app.coffee'
      dependOn: ['vue', 'firebase']
    vue: 'vue'
    firebase: path.resolve LIBPATH, 'firebase.coffee'
  resolve:
    extensions: [
      '.coffee', '.js', '.ts', '.vue', '.pug', '.sass', '.scss',
      '.png', '.svg', '.jpg', '.gif',
    ]
    alias:
      vue: 'vue/dist/vue.esm-bundler.js'
      '@/assets': ASSETSPATH
      '@/styles': path.resolve ASSETSPATH, 'styles'
      '@/lib':    LIBPATH
      '@/views':  VIEWPATH
      '@/hooks':  HOOKSPATH
      '@/comp':   COMPONENTSPATH
      '@/stores': path.resolve __dirname, 'stores'
      '@common':  path.resolve __dirname, 'api', 'v1', '_common'
  output:
    path: path.resolve __dirname, 'public'
    filename: '[name].js'
  module:
    rules: [
      test: /\.coffee$/
      loader: 'coffee-loader'
      options:
        bare: true
    ,
      test: /\.ts$/
      loader: 'ts-loader'
      options:
        compilerOptions:
          noEmit: false
    ,
      test: /\.sass$/
      use: [
        'vue-style-loader',
        'css-loader',
          loader: 'sass-loader'
          options:
            sassOptions:
              indentedSyntax: true
      ]
    ,
      test: /\.pug$/
      oneOf: [
        resourceQuery: /^\?vue/
        use: 'vue-pug-loader'
      ,
        use: ['raw-loader', 'pug-html-loader']
      ]
    ,
      test: /\.vue$/
      use: 'vue-loader'
    ,
      test: /\.ya?ml$/
      use: 'yaml-loader'
    ,
      test: /\.md$/
      use: 'raw-loader'
    ,
      test: /\.(png|svg|jpg|gif)$/
      use: 'file-loader'
    ,
      test: /\.txt$/
      use: 'raw-loader'
    ]
  plugins: [
    new EnvironmentPlugin ['APIURL']
    new ProvidePlugin
      Buffer: ['buffer', 'Buffer']
    new VueLoaderPlugin()
    new CopyPlugin
      patterns: [
        path.resolve __dirname, 'static'
      ,
        from: path.resolve __dirname, 'assets', 'manifest.yaml'
        to: path.resolve __dirname, 'public', 'manifest.json'
        transform: (content) ->
          Buffer.from JSON.stringify(YAML.parse(content.toString 'utf8'), undefined, 2)
      ]
    new HtmlWebpackPlugin
      template: path.resolve ASSETSPATH, 'app.pug'
      filename: '[name].html'
    new RoutesPlugin()
  ]
  performance:
    assetFilter: (asset) => asset isnt 'firebase.js'
