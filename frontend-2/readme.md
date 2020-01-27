## Frontend tutorial 2

This tutorial as a prerequisite the [frontend 1 tutorial](../frontend-1/readme.md), and the main goal is to dive into the mbox world to achieve dynamic shared state to several components.  

The tutorial will be divided in 3 cards each one with a button with a specific behavior that will be explained in depth.

  - **Card 1**    
    Each click will increment the number shown in the card
      
  - **Card 2**
    The card button will copy the value of Card 1
        
  - **Card 3**
    The card creates a list, for each click the list recieves a new element, and in each element's list a remove button will appears to provides an auto supression element ability
      
***

#### package.json
added 3 dependencies
```
"mobx": "4.9.2",
"mobx-react": "5.4.3",
"mobx-react-devtools": "6.0.3"
```

The strategy in the *mbox* is to share a store state between components, to use that we need to wrap the objects as observables and components as observers, simple as that.

I prefer a strict way of deal with actions (methods that will update values in store), that means, each action must be registered. 
In the example we use 3 number variables and 1 list of strings

declared strict way:
```javascript
configure({ enforceActions: "observed" });
```

store creation:
```javascript

```