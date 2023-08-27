path = require 'path'
HtmlWebpackPlugin = require 'html-webpack-plugin'
{VueLoaderPlugin} = require 'vue-loader'
WorkboxPlugin = require 'workbox-webpack-plugin'

ASSETSPATH     = path.resolve __dirname, 'assets'
VIEWPATH       = path.resolve __dirname, 'views'
LIBPATH        = path.resolve __dirname, 'lib'
COMPONENTSPATH = path.resolve __dirname, 'components'

module.exports =
  entry:
    index:
      import: path.resolve ASSETSPATH, 'app.coffee'
      dependOn: ['vue']
    vue: 'vue'
  resolve:
    extensions: [
      '.coffee', '.js', '.ts', '.pug', '.sass', '.scss', '.vue',
      '.png', '.svg', '.jpg', '.gif',
    ]
    alias:
      vue: 'vue/dist/vue.esm-bundler.js'
      '@/assets': ASSETSPATH
      '@/styles': path.resolve ASSETSPATH, 'styles'
      '@/lib':    LIBPATH
      '@/views':  VIEWPATH
      '@/comp':   COMPONENTSPATH
      '@/stores': path.resolve __dirname, 'stores'
      # '@common':  path.resolve __dirname, 'api', 'v1', '_common'
  output:
    path: path.resolve __dirname, 'public'
    filename: '[name].js'
  module:
    rules: [
      test: /\.coffee$/
      use: 'coffee-loader'
    ,
      test: /\.ts$/
      use: 'ts-loader'
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
      test: /\.(png|svg|jpg|gif)$/
      use: 'file-loader'
    ,
      test: /\.txt$/
      use: 'raw-loader'
    ]
  plugins: [
    new VueLoaderPlugin()
    new HtmlWebpackPlugin
      template: path.resolve ASSETSPATH, 'app.pug'
      filename: '[name].html'
    new WorkboxPlugin.GenerateSW
      skipWaiting: true
      clientsClaim: true
    # new WorkboxPlugin.InjectManifest()
  ]
