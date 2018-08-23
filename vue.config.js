/* eslint-disable */
module.exports = {
  runtimeCompiler: true,
  baseUrl: '/',
  chainWebpack: config => {
    // GeoJSON Loader
    config.module
      .rule('json-loader')
      .test(/\.geojson$/)
      .use('json-loader')
        .loader('json-loader')
        .end()
  }
}
