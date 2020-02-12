const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require("fs");
const basePath = __dirname;
const srcPath = "src";
const swSrcPath = "sw";
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isInSrc = (file)=>file.startsWith(path.resolve(basePath,srcPath));
const isNotInSrc = (file)=>!file.startsWith(path.resolve(basePath,srcPath));
const isNotInSwSrc = (file)=>!file.startsWith(path.resolve(basePath,swSrcPath));

module.exports = [
  function(env, argv) {
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
            use: [ MiniCssExtractPlugin.loader, "css-loader",  "sass-loader"]
          },
          {
            test: /\.(png|jpg|gif|svg)$/,
            loader: "file-loader",
            exclude: isNotInSrc,
            options: {
              name: "assets/img/[name].[ext]?[hash]"
            }
          },
          {
            type: "javascript/auto",
            test: /\.(json)/,
            exclude: isNotInSrc,
            use: [
              {
                loader: "file-loader",
                options: { name: "[name].[ext]" }
              }
            ]
          },
          {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: "file-loader?mimetype=image/svg+xml",
            exclude: isInSrc
          },
          {
            test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
            loader: "file-loader?mimetype=application/font-woff",
            exclude: isInSrc
          },
          {
            test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
            loader: "file-loader?mimetype=application/font-woff",
            exclude: isInSrc
          },
          {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: "file-loader?mimetype=application/octet-stream",
            exclude: isInSrc
          },
          { 
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader",
            exclude: isInSrc
          }
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

    base.plugins = [htmlWebpackPlugin,new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css'
    })];

    base.devServer = {
      contentBase: base.output.path,
      port: 8080,
      before: (app, server, compiler) => {
        eval(
          "" + fs.readFileSync(path.join(basePath, "webserver-tests/mock.js"))
        );
        app.get("/tests", function(req, res) {
          eval(
            "" + fs.readFileSync(path.join(basePath, "webserver-tests/init.js"))
          );
        });
      }
    };

    return base;
  },
  function(env, argv) {
    const base = {
      context: path.join(basePath, swSrcPath),
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
            exclude: isNotInSwSrc,
            loader: "awesome-typescript-loader",
            options: {
              useBabel: true,
              babelCore: "@babel/core" // needed for Babel v7
            }
          }
        ]
      }
    };

    // client-specific configurations
    base.entry = ["./sw.ts"];
    base.output.filename = "sw.js";
    return base;
  }
];
