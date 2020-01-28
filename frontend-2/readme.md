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

####store creation
Fisrst off all we need to create the actions.
```javascript
const storeActions = {
  update1: action,
  update2: action,
  remove: action,
  addToList: action
};
```
After, we create the store itself.
```javascript
const store = observable(
  {
    value1: 0,
    value2: 0,
    list: [] as IObservableArray<string>,
    maxList: 0,
    update1() {
      store.value1 = store.value1 + 1;
    },
    update2(n: number) {
      store.value2 = n;
    },
    remove(idx: number) {
      store.list.remove(store.list[idx]);
    },
    addToList() {
      store.maxList++;
      store.list.push(`item id:${store.maxList}`);
    }
  },
  storeActions
);
```
You can notice that we have a type IObservableArray, this is the type of all arrays used in stores, it's the method **observable** who transforms the original array into this.
This type it's enhance the original array and give it extra methods as **remove**.

In my opinion, the easiest way to create a jsx component is something like the example above:
```javascript
const Card = (props: CardProps) => (
  <div className="col-lg-6 mb-3">
    <div className="card box-shadow">
      <div className="card-header">
        <h4>{props.title}</h4>
      </div>
      <div className="card-body">
        <h5 className="card-title">{props.value}</h5>
        {props.children}
        <a href="#" className="btn btn-primary" onClick={props.evt}>
          {props.btn}
        </a>
      </div>
    </div>
  </div>
);
```

But if you want to re-render de component after store changes one element, that the component has access, you need tu use the **observer** function, like the example above:

```javascript
const Card = observer((props: CardProps)) => (
  <div className="col-lg-6 mb-3">
    <div className="card box-shadow">
      <div className="card-header">
        <h4>{props.title}</h4>
      </div>
      <div className="card-body">
        <h5 className="card-title">{props.value}</h5>
        {props.children}
        <a href="#" className="btn btn-primary" onClick={props.evt}>
          {props.btn}
        </a>
      </div>
    </div>
  </div>
));
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