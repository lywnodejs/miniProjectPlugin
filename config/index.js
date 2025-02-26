const path = require('path')
const { UnifiedWebpackPluginV5 } = require('weapp-tailwindcss/webpack')

const config = {
  projectName: '微信小程序插件模版',
  date: '2024-12-26',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'miniprogram',
  plugins: [
    [
      '@tarojs/plugin-inject'  
    ]
  ],
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
    '@coms': path.resolve(__dirname, '..', 'src/plugin/components'),
    '@pages': path.resolve(__dirname, '..', 'src/plugin/pages'),
    '@config': path.resolve(__dirname, '..', 'src/baseConfig'),
    '@styles': path.resolve(__dirname, '..', 'src/styles'),
    '@assets': path.resolve(__dirname, '..', 'src/assets'),
  },
  sass: {
    resource: [
      'src/styles/_variables.scss',
      'src/styles/_mixins.scss'
    ],
    projectDirectory: path.resolve(__dirname, '..')
  },
  mini: {
    webpackChain(chain) {
      chain.merge({
        plugin: {
          install: {
            plugin: UnifiedWebpackPluginV5,
            args: [{
              appType: 'taro'
            }]
          }
        }
      })
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 10240 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  framework: 'react',
  compiler: 'webpack5',
  cache: {
    enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  defineConstants: {
  },
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
