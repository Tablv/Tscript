const common = {
    templatePath: "src/view/template.html",
    serverSidePath: "/admin/dashboard/visual-core/"
  },
  publicPath =
    process.env.NODE_ENV === "production" ? common.serverSidePath : "./",
  staticPath =
    process.env.NODE_ENV === "production" ? common.serverSidePath : "/";

module.exports = {
  publicPath,
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== "production",
  css: {
    loaderOptions: {
      sass: {
        prependData: `
        @import "@/assets/common.scss";
        $basePath: "${staticPath}";
        `
      }
    }
  },
  pages: {
    editor: {
      entry: "src/view/editor/editor.ts",
      template: common.templatePath,
      title: "可视化编辑器"
    },
    preview: {
      entry: "src/view/preview/preview.ts",
      template: common.templatePath,
      title: "预览图表"
    },
    share: {
      entry: "src/view/share/share.ts",
      template: common.templatePath,
      title: "图表分享"
    },
    validate: {
      entry: "src/view/share/validate.ts",
      template: common.templatePath,
      title: "图表分享验证"
    }
  },
  configureWebpack: config => {
    Object.assign(config, {
      externals: {
        vue: "Vue"
      }
    });
  },
  devServer: {
    port: 3000,
    proxy: {
      "/admin": {
        // target: "http://192.168.1.205:8080/admin",
        target: "http://127.0.0.1:8080/admin",
        changeOrigin: true,
        pathRewrite: {
          "^/admin": ""
        }
      }
    }
  }
};
