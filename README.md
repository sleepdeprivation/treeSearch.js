# treeSearch.js
A lot of different search algorithms all bundled into one.
We have
Minimax (with and without Alpha-Beta pruning)
Uniform Cost Search (with and without branch and bound)
A*
Breadth First Search

### why?
Project for a class at university.

### how?
There are some examples in the examples directory.

In general, initialize tree search using 

  
```javascript
var searcher = new TreeSearch({       //object with options
      isGoal: goal,                   //a boolean function to evaluate any state
      generator: generateChildren,    //given a state, generate child states
      start: initialState,            //the initial state
      bb: true                        //whether uniform cost search should use branch and bound
});
```

Followed by
```javascript
  searcher.UCS();
  //or
  searcher.BFS();
  //or
  searcher.minimax(initialState, isMini);
  //or
  searcher.minimaxAB(initialState, isMini, depth);
```

Each of these has their own special options and you can find out about them through the examples.
