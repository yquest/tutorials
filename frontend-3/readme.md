## Frontend tutorial 3

This tutorial have as prerequisite the [frontend 2 tutorial](../frontend-2/readme.md) now we will start to call a backend service, even if it's simulated we can use as a test.
We added a 4rd card to load a list from backend.

***
#### package.json
removed the node-static dependency
added axios and webpack-dev-server dependencies

#### store
##### added actions
- *removeFromBackend* to remove from backend list
- *loadList* to call backend and load the data to the store 



To run the example like the first tutorial *frontent-1* you must run:
 ```
 npm install
 npm start
 ```
 Open the browser with url http://localhost:8080