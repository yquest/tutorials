## Frontend tutorial 3

This tutorial have as prerequisite the [frontend 2 tutorial](../frontend-2/readme.md) now we will start to call a backend service synchronously and asynchronously, even if it's simulated we can use as a test.
We added a 4th card to load a list from backend.

***
#### package.json
removed the node-static dependency
added axios and webpack-dev-server dependencies

#### store
##### added actions
- *removeFromBackend* to remove from backend list
- *loadList* to call backend and load the data to the store 

#### axios
Axios it's a web client, in our case scenario allow us to call a rest web-service and load the the necessary data **asynchronously** to fill the fourth card list.
```javascript
function loadList(e: React.MouseEvent) {
  e.preventDefault();
  Axios.get("/api/data").then(res => {
    store.loadList(res.data);
  });
}
``` 

#### webpack-dev-server
As we notice in *package.json* the node-static was removed and replaced with *webpack-dev-server* this give us a few benefits.
First of all, it's possible to change code and it will be recompiled automatically, second and the best, it's possible to have a dev server configured to serve dynamic content.
Also the change of *htmlWebpackPlugin* to add a new asset to load synchronously the initial the backendList values in the store.

##### init.js
```javascript
  app.get('/tests', function(req, res) {
    eval("" + fs.readFileSync(path.join(basePath, "webserver-tests/init.js")));
    module.exports(req, res);
    module.exports = {};
  });
```
serving the code of init.js as the example
```javascript
module.exports = function(req, res) {
  console.log(`serving initialisation state, page:${req.url}`);

  const state = [
    "my element 1",
    "my element 2"
  ];

  res.writeHead(200, { "Content-Type": "application/javascript" });
  res.end(`var __state = ${JSON.stringify(state)};`);
};
```

The variable __state created is used to load the initial state in the store.

```javascript
backendList: window["__state"] as IObservableArray<string>,
```

*The synchronous load will be very useful when we will start to talk about SSR(server side rendering) this is way that we need some data to be rendered in the first time.*

##### devServer
In webpack.config.json now we have a new object to configure, the **devServer**
```$javascript
  base.devServer = {
    contentBase: base.output.path,
    port: 8080,
    before: (app, server, compiler) => {
      app.all("/api/*", function(req, res) { // handle all calls with the same server where path starts with /api/
        eval("" + fs.readFileSync(path.join(basePath, "webserver-tests/mock.js")));
        module.exports(req, res);
        module.exports = {};
      });
    }
  };
```
The most part of attributes are auto-explained, however there is the *before* that needs a deeper look.

###### devserver.before
This function allow us to use a webserver in webpack, within we can configure the routers that we need apart from the static content, in our particular case we route all the requests started with /api/*
In each call we read the webserver-tests/mock.js that means, if we need a different response we can change the implementation within.
For our example we use:      
```$javascript
module.exports = function (req,res) {
    console.log(`serving url:${req.path} with method ${req.method}`)
    if(req.path === '/api/data'){
        const data = [
            "my custom data 1",
            "my custom data 2",
            "my custom data 3",
            "my custom data 4",
        ];
        res.status(200).json(data);
    }else{
        res.end();
    }
}
```
*Et voila* the call, (in our case) to http://localhost:/8080/api/data will give us the response:
```$json
["my custom data 1","my custom data 2","my custom data 3","my custom data 4"]
``` 

To run the example you must run:
 ```
 npm install
 npm start
 ```
 Open the browser with url http://localhost:8080