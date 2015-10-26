# treeSearch.js
A general implementation of uniform cost search and breadth first search

###why?
Project for a class at university.

###how?
There are some examples in the examples directory.
The assignment requested we solve the eight queens problem with a board denoted with different costs.

In general, initialize tree search using 

  
```javascript
var searcher = new TreeSearch({
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
```
