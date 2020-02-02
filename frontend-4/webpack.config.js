const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require("fs");
const basePath = __dirname;
const srcPath = "src";

module.exports = [function(env, argv) {
  const base = {
    context: path.join(basePath, srcPath),
    resolve: {
      extensions: [".js", ".ts", ".tsx"]
    },
    output: {
      path: path.join(basePath, "dist")
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          loader: "awesome-typescript-loader",
          options: {
            useBabel: true,
            babelCore: "@babel/core" // needed for Babel v7
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: ["style-loader", "css-loader", "sass-loader"]
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: "file-loader",
          options: {
            name: "assets/img/[name].[ext]?[hash]"
          }
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: "file-loader?mimetype=image/svg+xml"
        },
        {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          loader: "file-loader?mimetype=application/font-woff"
        },
        {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          loader: "file-loader?mimetype=application/font-woff"
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: "file-loader?mimetype=application/octet-stream"
        },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" }
      ]
    }
  };

  base.entry = ["./content/style.scss", "./index.tsx"];
  base.output.filename = "bundle.js";

  const htmlWebpackPlugin = new HtmlWebpackPlugin({
    templateParameters: (compilation, assets) => {
      assets.js.unshift("tests");
      return {
        compilation,
        htmlWebpackPlugin: {
          files: assets
        }
      };
    },
    filename: "index.html", //Name of target file after rendered
    template: "index.html", //Name of template before rendered
    favicon: "favicon.ico",
    hash: true
  });

  base.plugins = [htmlWebpackPlugin];

  base.devServer = {
    contentBase: base.output.path,
    port: 8080,
    before: (app, server, compiler) => {
      app.get('/tests', function(req, res) {
        eval("" + fs.readFileSync(path.join(basePath, "webserver-tests/init.js")));
        module.exports(req, res);
        module.exports = {};
      });
      app.get('/sw', function(req, res) {
        res.sendFile(path.join(basePath, "sw.js"));
      });
      app.all("/api/*", function(req, res) { // handle all calls with the same server where path starts with /api/
        eval("" + fs.readFileSync(path.join(basePath, "webserver-tests/mock.js")));
        module.exports(req, res);
        module.exports = {};
      });
    }
  };

  return base;
} ,/*function (env, argv) {
  const base = {
    context: path.join(basePath, "sw"),
    resolve: {
      extensions: ['.js', '.ts', '.tsx']
    },
    output: {
      path: path.join(basePath, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'awesome-typescript-loader',
          options: {
            useBabel: true,
            "babelCore": "@babel/core", // needed for Babel v7
          }
        }
      ]
    }
  };

  // client-specific configurations
  base.entry = ['./sw.ts'];
  base.output.filename = 'sw.js';
  return base;
}*/];
