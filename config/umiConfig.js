import { resolve } from 'path'
import routes from './router.js'
const fs = require('fs')
const path = require('path')
const lessToJs = require('less-vars-to-js')
const assetDir = 'static'
const IS_PROD = process.env.NODE_ENV !== 'development' // 是否为生产环境
const proxyUrl = '' // 若需代理此处填入/api-nac 69行输入地址
const { SYSTEM } = process.env

const copyDir = ()=>{
  fs.cpSync('../../framework/src/utils','src/utils',{recursive:true} ,(err) => {
    if (err) {
      console.error(err);
    }
  })
  fs.cpSync('../../framework/src/components','src/components',{recursive:true} ,(err) => {
    if (err) {
      console.error(err);
    }
  })
  fs.cpSync('../../framework/src/layouts','src/layouts',{recursive:true} ,(err) => {
    if (err) {
      console.error(err);
    }
  })
  fs.cpSync('../../framework/src/pages/common','src/pages/common',{recursive:true} ,(err) => {
    if (err) {
      console.error(err);
    }
  })
  fs.cpSync('../../framework/src/services','src/services',{recursive:true} ,(err) => {
    if (err) {
      console.error(err);
    }
  })
  fs.cpSync('../../framework/src/themes','src/themes',{recursive:true} ,(err) => {
    if (err) {
      console.error(err);
    }
  })
  fs.cpSync('../../framework/src/models','src/models',{recursive:true} ,(err) => {
    if (err) {
      console.error(err);
    }
  })
  fs.cpSync('../../framework/src/assets/common','src/assets/common',{recursive:true} ,(err) => {
    if (err) {
      console.error(err);
    }
  })
  fs.cpSync('../../framework/src/assets/topology','src/assets/topology',{recursive:true} ,(err) => {
    if (err) {
      console.error(err);
    }
  })
  fs.cpSync('../../framework/src/assets/alibaba','src/assets/alibaba',{recursive:true} ,(err) => {
    if (err) {
      console.error(err);
    }
  })
  fs.cpSync('../../framework/src/assets/iconfont','src/assets/iconfont',{recursive:true} ,(err) => {
    if (err) {
      console.error(err);
    }
  })
  fs.cpSync('../../framework/src/assets/switch','src/assets/switch',{recursive:true} ,(err) => {
    if (err) {
      console.error(err);
    }
  })
  fs.cpSync('../../framework/public','public',{recursive:true} ,(err) => {
    if (err) {
      console.error(err);
    }
  })
  fs.cpSync('../../framework/src/locales/zh-CN/common','src/locales/zh-CN/common',{recursive:true} ,(err) => {
    if (err) {
      console.error(err);
    }
  })
}

export default {
  devtool: IS_PROD ? false : 'source-map',
  ignoreMomentLocale: true,
  hash: false,

  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  routes,
  antd: {}, // 启用UMI自带的antd
  mock: {},
  base:'dsp/',
  outputPath: 'dist',
  publicPath: '/',
  alias: {
    api: resolve(__dirname, SYSTEM?`../../packages/${SYSTEM}/src/services`:'../src/services'),
    components: resolve(__dirname, SYSTEM?`../../packages/${SYSTEM}/src/components`:'../src/components'),
    config: resolve(__dirname, SYSTEM?`../../packages/${SYSTEM}/src/utils/config`:'../src/utils/config'),
    themes: resolve(__dirname, SYSTEM?`../../packages/${SYSTEM}/src/themes`:'../src/themes'),
    utils: resolve(__dirname, SYSTEM?`../../packages/${SYSTEM}/src/utils`:'../src/utils'),
  },
  locale: {
    default: 'zh-CN', // 默认语言，当检测不到具体语言时，展示 default 中指定的语言。
    antd: false, // 开启后，支持 antd 国际化
    title: false, // 在项目中配置的 title 及路由中的 title 可直接使用国际化 key，自动被转成对应语言的文案
    baseNavigator: false, // 开启浏览器语言检测。
    baseSeparator: '-', // 国家（lang） 与 语言（langua ge） 之间的分割符。
  },
  title: false,
  dva: { 
    immer: true,
    skipModelValidate: true,
  },
  dynamicImport: {
    loading: 'components/Loader/Loader',
  },
  extraBabelPresets: ['@lingui/babel-preset-react'],
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lodash',
    ],
    [
      'import',
      {
        libraryName: '@ant-design/icons',
        libraryDirectory: 'es/icons',
        camel2DashComponentName: false,
      },
      'ant-design-icons',
    ],
    IS_PROD ? 'transform-remove-console' : '', // 生产关闭打印
  ],

  proxy: {
    '/api-nac': {
      target: 'https://10.88.8.19',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/api-nac': '' },
    },
    proxy: true,
  },

  targets: { ie: 9 },

  theme:process.env.SYSTEM==='nba'?{
    "primary-color": "#bb3b24",
    'font-size-base': '13px',
    ...lessToJs(
      fs.readFileSync(path.join(__dirname, '../src/themes/default.less'), 'utf8')
    ),
  }: process.env.SYSTEM==='nac'?{
    "primary-color": "#1890ff",
    'font-size-base': '14px',
    ...lessToJs(
      fs.readFileSync(path.join(__dirname, '../src/themes/defaultNac.less'), 'utf8')
    ),
  }:{
    "primary-color": "#1890ff",
    'font-size-base': '13px',
    ...lessToJs(
      fs.readFileSync(path.join(__dirname, '../src/themes/default.less'), 'utf8')
    ),
  },
  
  chainWebpack: function (config, { env, webpack, createCSSRule }) {
    process.env.SYSTEM&&copyDir()
      //全局化SYSTEM变量
    config.plugin('define').tap(([option,...rest])=>{
      const options ={
        ...option,
        SYSTEM:JSON.stringify(process.env.SYSTEM),
        URL:JSON.stringify(proxyUrl)
      }
      return[options,...rest]
    })
    config.output
      .filename(assetDir + '/js/[name].js')
      .chunkFilename(assetDir + '/js/[name].chunk.js')
    config.plugin('extract-css').tap(() => [
      {
        filename: `${assetDir}/css/[name].css`,
        chunkFilename: `${assetDir}/css/[name].chunk.css`,
        ignoreOrder: true,
      },
    ])

    // 修改fonts输出目录
    config.module
      .rule('fonts')
      .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'))
      .tap((options) => ({
        ...options,
        name: assetDir + '/fonts/[name].[ext]',
        publicPath: '../../',
        fallback: {
          ...options.fallback,
          options: {
            name: assetDir + '/fonts/[name].[ext]',
            esModule: false,
            publicPath: '../../',
          },
        },
      }))
    // 修改图片输出目录
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp|ico)(\?.*)?$/)
      .use('url-loader')
      .loader(require.resolve('url-loader'))
      .tap((options) => {
        const newOptions = {
          ...options,
          name: assetDir + '/img/[name].[ext]',
          fallback: {
            ...options.fallback,
            options: {
              name: assetDir + '/img/[name].[ext]',
              esModule: false,
            },
          },
        }
        return newOptions
      })
    if (process.env.NODE_ENV === 'production') {
      config.merge({
        optimization: {
          minimize: true,
          splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 2,
            automaticNameDelimiter: '.',
            cacheGroups: {
              vendor: {
                name: 'vendors',
                test: /^.*node_modules[\\/](?!ag-grid-|lodash|wangeditor|react-virtualized|rc-select|rc-drawer|rc-time-picker|rc-tree|rc-table|rc-calendar|antd).*$/,
                chunks: 'all',
                priority: 10,
              },
              virtualized: {
                name: 'virtualized',
                test: /[\\/]node_modules[\\/]react-virtualized/,
                chunks: 'all',
                priority: 10,
              },
              rcselect: {
                name: 'rc-select',
                test: /[\\/]node_modules[\\/]rc-select/,
                chunks: 'all',
                priority: 10,
              },
              rcdrawer: {
                name: 'rcdrawer',
                test: /[\\/]node_modules[\\/]rc-drawer/,
                chunks: 'all',
                priority: 10,
              },
              rctimepicker: {
                name: 'rctimepicker',
                test: /[\\/]node_modules[\\/]rc-time-picker/,
                chunks: 'all',
                priority: 10,
              },
              ag: {
                name: 'ag',
                test: /[\\/]node_modules[\\/]ag-grid-/,
                chunks: 'all',
                priority: 10,
              },
              antd: {
                name: 'antd',
                test: /[\\/]node_modules[\\/]antd[\\/]/,
                chunks: 'all',
                priority: 9,
              },
              rctree: {
                name: 'rctree',
                test: /[\\/]node_modules[\\/]rc-tree/,
                chunks: 'all',
                priority: -1,
              },
              rccalendar: {
                name: 'rccalendar',
                test: /[\\/]node_modules[\\/]rc-calendar[\\/]/,
                chunks: 'all',
                priority: -1,
              },
              rctable: {
                name: 'rctable',
                test: /[\\/]node_modules[\\/]rc-table[\\/]es[\\/]/,
                chunks: 'all',
                priority: -1,
              },
              wang: {
                name: 'wang',
                test: /[\\/]node_modules[\\/]wangeditor[\\/]/,
                chunks: 'all',
                priority: -1,
              },
              lodash: {
                name: 'lodash',
                test: /[\\/]node_modules[\\/]lodash[\\/]/,
                chunks: 'all',
                priority: -2,
              },
            },
          },
        },
      })
    }
  },
}
