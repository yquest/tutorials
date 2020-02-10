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
 - Card, created in 5 different components within the App component
 
#### util.ts
 This will be a shared repository of functions and constants to be used in the whole project   
 
#### stores 
In the example we have two stores, the main one and the card5 each one have different purposes.
    
- **main**: persists the variables value1, value2, frontedList, backendList, maxList, message and all the components observed that uses it.
 
- **card5**: this store it's a typical validate scenario, first render without validation, after first attempt to send, becomes in/valid.
The validation states are associated to the components and a message variable is welcome to give the user a more detailed information.
In this case the message it self has the validation state mapped as *not validated* when is null, *valid* when is empty and *invalid* when has content.

#### service worker
Transpiling of service worker is done to /sw.js from the source typescript in sw folder.
The main purpose it's to cached the assets to be served offline and listen events from server through the *server sent event*.
The page launches the service worker, when it's ready sends a message to the service worker.
All the messages used between service worker and page use the format {command:xxx, message:xxx}, to identify the message type and the message it self.

#### Messaging between *service worker* and *page* and vice-versa
When the page starts, the service worker will be launched, when it's ready, a message will be sent to it and the page will wait the return, when the message arrives to the service worker it will launch the EventSource, this is a request waiting a server send event, when the event arrives will forward a message with the event content and so far and so forth.

#### server send event
To receive events from server, we add an endpoint /api/sse , this endpoint will kept alive.
We start the initiation of events listening in the service worker with by passing a mess 
After receive the event we forward to an notification in the browser.

