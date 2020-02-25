## Frontend tutorial 2

This tutorial have as prerequisite the [frontend 1 tutorial](../frontend-1/readme.md), and the main goal is to use react-hooks to create the main component state and used to render the correspondent children.  

The tutorial will be divided in 3 cards each one with a button with a specific behavior that will be explained in depth.

  - **Card 1**    
    Each click will increment the number shown in the card
      
  - **Card 2**
    The card button will copy the value of Card 1
        
  - **Card 3**
    The card creates a list, for each click the list recieves a new element, and in each element's list a remove button will appears to provides an auto supression element ability
      
***

With functional components it's possible to add the state with react-hooks and with that add behavior to the components, for that reason we create a controller with the method useController, to repect the convection of react-hooks.

####controller creation
Fisrst off all we need to create the actions.
```javascript
function useController(): Controller {
  ...
}
```


You can notice that in props parameters passed to jsx components in the example we use interfaces, with that we ensure the types used, there is a special parameter **children**, this parameter allow us to pass a body within the element body like the example above:

```javascript
<Card
  title="Card 2"
  evt={update2OnClickEvt}
  value={store.value2}
  btn="copy first"
>
  <p>Copy value from Card 1</p>
</Card>
```

To run the example like the first tutorial *frontent-1* you must run:
 ```
 npm install
 npm start
 npm run-script serve-static
 ```
 Open the browser with url http://localhost:8080