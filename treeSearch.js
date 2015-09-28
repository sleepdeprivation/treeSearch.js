var PriorityQueue = require("js-priority-queue");
var Queue = require("queue");



/*
	We want to abstract tree searches

		generator: 	maps 1 state to a set of states, called "successors"
		isGoal:		evaluate a state to determine if it is the goal
		
	Currently we have:
		BFS (breadth-first)
		UCS (uniform cost )

*/

var PUSH_COUNT = 0;
var VISIT_COUNT = 0;

function TreeSearch(objs){

	//special object
	this.startingState = objs.start;
		/*
			state objects should have:
			measure() function
		*/

	//functions
	this.generator = objs.generator;
	this.isGoal = objs.isGoal;
	//bool
	this.branchAndBound = objs.bb;

	this.shortestMeasure = Infinity;

	this.pQueue = new PriorityQueue({ comparator: function(A, B) { return A.measure - B.measure; }});
	this.queue = new Queue();

	this.BFS = function(){
		this.queue.push(this.startingState);
		var currentState;
		while(true){
			var addToQueue = [];
			while(this.queue.length > 0){
				currentState = this.queue.pop();
				if(this.isGoal(currentState)){
					console.log("WINNER:", currentState);
					return true;
				}else{
					children = this.generator(currentState);
					for(var ii = 0; ii < children.length; ii++){
						addToQueue.push(children[ii]);
					}
				}
			}
			for(kk = 0; kk < addToQueue.length; kk++){
				this.queue.push(addToQueue[kk]);
			}
		}
	}

	this.UCS = function(){
		var currentState = this.startingState;
		var children, tuple;
		var currentMeasure = currentState.measure();

		this.pQueue.queue({object: currentState, measure: currentMeasure});

		while(this.pQueue.length > 0){

			VISIT_COUNT++;
			tuple = this.pQueue.dequeue();
			currentState = tuple.object;
			currentMeasure = tuple.measure;

			if(this.isGoal(currentState)){
				console.log("WINNER:", currentState);
				return true;
			}

			children = this.generator(currentState);
			var childMeasure;
			for(var kk = 0; kk < children.length; kk++){
				childMeasure = children[kk].measure();
				//only check if we're not branch and bounding
				if(this.branchAndBound){
					if(childMeasure+currentMeasure <= this.shortestMeasure){
						PUSH_COUNT++;
						this.pQueue.queue({	object: children[kk], 
									measure: currentMeasure + childMeasure
								});
						if(this.isGoal(children[kk])){
							this.shortestMeasure = childMeasure+currentMeasure;
						}
					}
				}else{
					PUSH_COUNT++;
					this.pQueue.queue({	object: children[kk], 
								measure: currentMeasure + children[kk].measure()
							});
				}
			}

		}
	}
}

module.exports = TreeSearch;




