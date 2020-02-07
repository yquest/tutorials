## Frontend tutorial 4

This tutorial have as prerequisite the [frontend 3 tutorial](../frontend-3/readme.md) now we will organize de code and split in templates, controllers and stores and add a service worker to cache all pages to serve it later when is offline.

#### webpack.config.js
replace the function in module.exports to an array of functions, the first element will compile the bundle.js, came from the src folder, the second one come from the sw folder.

#### controllers
All the controllers have the correspondent namespace in lowercase with the **Props** interface, witch is the entry type to the template.   
 - app controlled associated to App template
 - card controlled associated to Card template
 - navigation controlled associated to Navigation template
 - main controlled associated to Main template, and has the function to create the the Main component
 
#### templates
 
 - App template, the most embrace component this embraces the navigator and the cards component
 - Navigation template, is the top component within the app
 - Card, created in 4 different components within the App component
 
#### util.ts
 This will be a shared repository of functions and constants to be used in the whole project   
 
#### stores 
In the example we have a single store, the mainStore, however it's possible to have more than one.
 
#### service worker
load the /sw.js as the service worker, compiled from the sw typescript folder.
cached the 5 assets to be served

#### server send event
To receive events from server, we add an endpoint /api/sse , this endpoint will kept alive.
After receive the event we forward to an notification in the browser.

