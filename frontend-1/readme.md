## Frontend tutorial 1

This tutorial aims to share a way of creation a frontend static page with high productive tehlologies and correspondent basic configurations.

***

#### Webpack configuration in file _webpack.config.js_

loaders:

- to transpile typescript to javascript:
    ```javascript
    {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: "awesome-typescript-loader",
        options: {
            useBabel: true,
            babelCore: "@babel/core" // needed for Babel v7
        }
    }
    ```
- to handle _style_ files like sass, scss and css
    ```javascript
    {
        test: /\.(sa|sc|c)ss$/,
        use: [
            "style-loader", // Creates `style` nodes from JS strings
            "css-loader", // Translates CSS into CommonJS
            "sass-loader" // Compiles Sass to CSS
        ]
    }
    ```
- to handle images whenever is imported in a source file, using hash, is avoided the browser cache for the same file in different compilations and text fonts
    ```javascript
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
        { 
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" 
        }
    ```

entry files:
- **index.tsx** is the typescript react file
- **style.scss** is a SASS file to apply style to the page

```javascript
base.entry = ["./content/style.scss", "./index.tsx"];
```

plugins:
   - **HtmlWebpackPlugin** defines the index page
```javascript
  const htmlWebpackPlugin = new HtmlWebpackPlugin({
    templateParameters: (compilation, assets) => {
      return {
        compilation,
        htmlWebpackPlugin: {
          files: assets
        },
      };
    },
    filename: 'index.html', //Name of target file after rendered
    template: 'index.html', //Name of template before rendered
    favicon: "favicon.ico",
    hash: true
  });
```

***

#### Dependencies configuration _package.json_
```json
{
  "name": "app_example",
  "version": "1.0.0",
  "description": "Example app",
  "main": "index.js",
  "scripts": {
    "start": "webpack --mode development",
    "prod": "webpack --mode production"
  },
  "license": "ISC",
  "devDependencies": {
    "@fortawesome/fontawesome-free": "^5.10.2",
    "@types/node-sass": "^4.11.0",
    "@types/react": "^16.9.2",
    "@types/react-dom": "^16.9.0",
    "awesome-typescript-loader": "^5.2.1",
    "@babel/core": "^7.4.5",
    "babel-loader": "^8.0.4",
    "bootstrap": "^4.1.3",
    "css-loader": "^1.0.0",
    "file-loader": "^2.0.0",
    "html-webpack-plugin": "^3.2.0",
    "node-sass": "^4.13.1",
    "node-static": "^0.7.11",
    "sass-loader": "^7.3.1",
    "style-loader": "^0.23.1",
    "typescript": "^3.6.2",
    "url-loader": "^1.1.1",
    "webpack": "^4.39.3",
    "webpack-cli": "^3.3.7"
  },
  "dependencies": {
    "react": "^16.9.0",
    "react-dom": "^16.9.0"
  }
}
```
in package.json nodes in devDependencies is used only to compile bundle
in dependencies is also a source code dependencies
***

#### Typscript configuration _tsconfig.json_
```javascript
{
  "compilerOptions": {
    "target": "es6",
    "module": "es6",
    "moduleResolution": "node",
    "declaration": false,
    "noImplicitAny": false,
    "jsx": "react",
    "sourceMap": true,
    "noLib": false,
    "suppressImplicitAnyIndexErrors": true,
    "experimentalDecorators": true
  },
  "compileOnSave": false,
  "exclude": [
    "node_modules"
  ]
}
```
***

#### Style
```sass
$fa-font-path: "./~@fortawesome/fontawesome-free/webfonts";

@import "node_modules/bootstrap/scss/bootstrap.scss";
// Required
@import "node_modules/bootstrap/scss/functions";
@import "node_modules/bootstrap/scss/variables";
@import "node_modules/bootstrap/scss/mixins";
// Optional
@import "node_modules/bootstrap/scss/reboot";
@import "node_modules/bootstrap/scss/type";
@import "node_modules/bootstrap/scss/images";
@import "node_modules/bootstrap/scss/code";
@import "node_modules/bootstrap/scss/grid";

@import '~@fortawesome/fontawesome-free/scss/fontawesome.scss';
@import '~@fortawesome/fontawesome-free/scss/solid.scss';
@import '~@fortawesome/fontawesome-free/scss/brands.scss';
$rct-icon-color: #33c !default;
$rct-label-hover: rgba($rct-icon-color, .1) !default;
$rct-label-active: rgba($rct-icon-color, .15) !default;
$rct-clickable-hover: rgba($rct-icon-color, .1) !default;
$rct-clickable-focus: rgba($rct-icon-color, .2) !default;

.box-shadow {
    box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05);
}
```
Only added the box-shadow class to give a little effect in the page, you can add other classes as you like.


***

Install the node modules to render and serve the page
```
npm install
npm start
npm run-script serve-static
```
Open the browser with url http://localhost:8080