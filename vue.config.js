const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  publicPath: './', // 相对路径，方便二级目录部署
  devServer: {
    port: 8080,
    open: true,
    // proxy: {
    //   "/api": {
    //     target: "https://gtgb.gtshebei.com/",
    //     ws: true,
    //     changeOrigin: true,
    //     pathRewrite: { "^/api": "" }
    //   }
    // }
  },
  chainWebpack: config => {
    // 覆盖 images 规则
    config.module
      .rule('images')
      .set('type', 'asset/resource')
      .set('generator', {
        filename: 'static/img/[name].[hash:8][ext]'
      })

    // 新增 fonts 规则覆盖（Element UI 字体）
    config.module
      .rule('fonts')
      .set('type', 'asset/resource')
      .set('generator', {
        filename: 'static/fonts/[name].[hash:8][ext]',
        publicPath: '../' // 关键：让 CSS 能找到字体文件
      })
  }
})
