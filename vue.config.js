module.exports = {
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      productName: "Cocos ICE Simulator",
      "appId": "com.cocos.cocosice",
      "electronVersion": "11.2.0",
      "mac": {
        "icon": "ice.icns",
        "target": [
          "dmg"
        ]
      },
      "win": {
        "asar": true,
        "asarUnpack": "static",
        "icon": "ice.ico",
        "target": [
          "zip"
        ]
      }
    },
  },

  css: {
    loaderOptions: {
      sass: {
        additionalData: `@use 'sass:math'; @use 'sass:color';`,
      },
    },
  },

  configureWebpack: () => {
    const conf = {
      resolve: {
        alias: {},
      },
      plugins: [
        // new BundleAnalyzerPlugin(),
      ],
      output: {},
    };
    return conf;
  },

  chainWebpack(config) {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,

          compilerOptions: {
            isCustomElement: (tag) => /webview/.test(tag),
          },
        };
      });

    config.module
      .rule('mjs$')
      .test(/\.mjs$/)
      .include.add(/node_modules/)
      .end()
      .type('javascript/auto');

    return config;
  },
};
