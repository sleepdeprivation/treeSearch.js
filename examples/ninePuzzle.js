var TreeSearch = require("./treeSearch.js");


/*
	Swap two elements, clones the array first
*/
Array.prototype.swap = function(x1, x2){
	var retval = this.slice(0);
	var temp = retval[x1];
	retval[x1] = retval[x2];
	retval[x2] = temp;
	return retval;
}



/*

		9-PUZZLE

*/


function ninePuzzle(state){
	this.state = state;
	this.measure = function(){
		return 1;
	}

	this.print = function(){
		for(var ii =0; ii < 3; ii++){
			console.log(state[3*ii + 0],state[3*ii + 1],state[3*ii + 2]);
		}
	}
	

}

var startPuzzle = new ninePuzzle([2,8,3,1,6,4,7,0,5]);
var goalPuzzle = new ninePuzzle([1,2,3,8,0,4,7,6,5]);

function correctNinePuzzle(state){
	for(var ii = 0; ii < 9; ii++){
		if(state.state[ii] != goalPuzzle.state[ii]){
			return false;
		}
	}
	return true;
}

function generateNinePuzzles(state){
	var retvals = [];
	var zero = state.state.indexOf(0);
	if(Math.floor(zero/3) != 0){	//up
		retvals.push(new ninePuzzle(state.state.swap(zero, zero-3)));
	}

	if(Math.floor(zero/3) != 2){	//down
		retvals.push(new ninePuzzle(state.state.swap(zero, zero+3)))
	}

	if((zero%3) != 0){			//left
		retvals.push(new ninePuzzle(state.state.swap(zero, zero-1)));
	}

	if((zero%3) != 2){			//right
		retvals.push(new ninePuzzle(state.state.swap(zero, zero+1)));
	}

	//console.log("rval", retvals);
	return retvals;
}


var functionPack2 =
{
	isGoal: correctNinePuzzle,
	generator: generateNinePuzzles,
	start: startPuzzle,
	bb: true
};

var nineSearcher = new TreeSearch(functionPack2);
nineSearcher.BFS();

