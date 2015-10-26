var PriorityQueue = require("js-priority-queue");
var Queue = require("queue");



/*
	We want to abstract tree searches

		generator: 	maps 1 state to a set of states, called "successors"
		isGoal:		evaluate a state to determine if it is the goal
		
	Currently we have:
		BFS (breadth-first)
		UCS (uniform cost )
		minimax (adversarial game-tree)

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
	this.staticEval = objs.staticEval;
	//bool
	this.branchAndBound = objs.bb;

	//ply limit for minimax
	this.depthLimit = objs.depthLimit || undefined;

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

	this.VISIT_COUNT = 0;
	this.PUSH_COUNT = 0;
	this.UCS = function(){
		this.pQueue = new PriorityQueue({ comparator: function(A, B) { return A.measure - B.measure; }});
		var currentState = this.startingState;
		var children, tuple;
		var currentMeasure = currentState.measure()
		var currentHeuristic = (typeof currentState.heuristic == undefined ? 0 : currentState.heuristic());
		var added = 0; var subtracted = 0;

		this.pQueue.queue({	object: 	currentState,
					measure: 	currentMeasure + currentHeuristic,
					heuristic: 	currentHeuristic
				});

		while(this.pQueue.length > 0){

			this.VISIT_COUNT++;
			tuple = this.pQueue.dequeue();
			currentState = tuple.object;
			currentMeasure = tuple.measure - tuple.heuristic;	//this is an accurate measure
			subtracted += tuple.heuristic;
			//console.log(currentMeasure, tuple.measure);


		//console.log(this.pQueue.priv.data);

			if(this.isGoal(currentState)){
				console.log("WINNER:", currentState);
				console.log("COST: ", currentMeasure);
				console.log("Nodes pushed to queue: ", this.PUSH_COUNT);
				console.log("Nodes popped from queue: ", this.VISIT_COUNT);
				return true;
			}

			children = this.generator(currentState);
			var childMeasure;
			for(var kk = 0; kk < children.length; kk++){
				childMeasure = children[kk].measure();
				childHeuristic = typeof children[kk].heuristic == undefined ? 0 : children[kk].heuristic();
				added += childHeuristic;
				//console.log(childMeasure);
				//only check if we're not branch and bounding
				if(this.branchAndBound){
					if(childMeasure+currentMeasure+childHeuristic <= this.shortestMeasure){
						this.PUSH_COUNT++;
						this.pQueue.queue({	object: children[kk], 
									measure: currentMeasure + childMeasure + childHeuristic,
									heuristic: childHeuristic
								});
						if(this.isGoal(children[kk])){
							this.shortestMeasure = childMeasure+currentMeasure+childHeuristic;
						}
					}
				}else{
					this.PUSH_COUNT++;
					this.pQueue.queue({	object: children[kk], 
								measure: currentMeasure + childMeasure + childHeuristic,
								heuristic: childHeuristic
							});
				}
			}

		}
	}

	this.count = 0;
	this.minimax = function(currentState, mini, depth){
		depth = depth || 0;
		this.count++;
		if(this.depthLimit != undefined){
			if(depth >= this.depthLimit){
				return this.staticEval(currentState);
			}
			if(!mini){
				depth += 1;
			}
		}
		var val,successor,board;
		var goal = this.isGoal(currentState)
		if(goal != -2) return goal;
		if(!mini){ val = -Infinity; }
		else{ val = Infinity; }
		var successors = this.generator(currentState, mini);
		for(var ii = 0; ii < successors.length; ii ++ ){
			successor = successors[ii];
			if(!mini) val = Math.max(val, this.minimax(successors[ii], true, depth));
			else val = Math.min(val, this.minimax(successors[ii], false, depth));
		}
		return val;
	}

	this.bestMove;
	this.bestScore = -Infinity;

	/*
		minimax with alpha-beta pruning
	*/
	this.minimaxAB = function(currentState, mini, depth, alpha, beta){

		this.count++;
		depth = depth || 0;
		var res, nextAlpha, nextBeta, val, successor;
		if(alpha != 0){	//wasted hours because 0 is falsy!!!
			alpha = alpha || -Infinity;
		}
		if(beta != 0){
			beta = beta || Infinity;
		}


		var goal = this.isGoal(currentState);
		if(goal == 1) {return 100};	//win for 1
		if(goal == -1) {return -100};	//win for 2
		if(goal == 0) {return this.staticEval(currentState)};	//draw

		if(this.depthLimit != undefined){		//depthLimit set to 6
			if(depth >= this.depthLimit){
				return this.staticEval(currentState);	//staticEval works for test case provided
			}
		}

		res = (!mini) ? alpha : beta;

		var successors = this.generator(currentState, mini);
		for(var ii = 0; ii < successors.length; ii ++ ){

			successor = successors[ii];

			nextAlpha = (!mini) ? res : alpha;
			nextBeta = (!mini) ? beta : res;

			val = this.minimaxAB(successor, !mini, depth + 1, nextAlpha, nextBeta);

			//max compares to alpha
			res = (!mini) ? Math.max(res, val) : Math.min(res, val);

			if(depth == 0){
				if(val > this.bestScore){
					this.bestMove = successor;
					this.bestScore = val;
				}
			}

			if((!mini && res >= beta) || (mini && res <= alpha)){
				return res;
			}
		}
		return res;
	}

}

module.exports = TreeSearch;




