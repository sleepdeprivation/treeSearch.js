var TreeSearch = require("./treeSearch.js");


//credit Mozilla MDN
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}



//end credit


/*

		THE EIGHT QUEENS PROBLEM:

*/

/*
	Now that we have abstracted uniform cost search we will model the 8 queens problem
	to be handled by the search
*/

/*
	So first we need a board object,
	it is immutable so it doesn't need to be copied or passed about
*/
var BOARD = 
[
[2885,3391,1494,2404,981,1554,2512,3399],
[3208,3417,3243,2684,164,1352,2673,1206],
[450,559,2806,2632,344,2711,978,2073],
[3235,3437,3398,1389,2916,2816,2407,793],
[2240,3390,2322,2322,2461,662,2320,2661],
[346,1719,127,607,1123,1735,576,904],
[987,2834,3007,2501,3365,1578,422,1792],
[1937,503,3308,113,122,2289,1765,2476],
]; //[];

/*
for(var ii = 0; ii < 8; ii++){
	BOARD.push([]);
	for(var kk = 0; kk < 8; kk++){
		BOARD[ii].push(getRandomInt(1, 25));
	}
}
*/


/*
	We'll keep these lightweight
*/
function scoredBoard(row, array){
	this.currentRowNumber = row;	//start on the first row
	this.colNumbers = array; 	//we'll just keep pushing which column we picked, when we have 8 it's a winner
	this.measure = function(){
		if(this.colNumbers.length == 0){ return 0; }
		return BOARD[this.currentRowNumber][this.colNumbers[this.colNumbers.length-1]];
	}
};

/*
	We want to generator successor boards
*/
function generateSuccessors(board){
	var decisionRow = board.colNumbers.length;	//decision time
	var winners = [true, true, true, true, true, true, true, true];	//we're all winners here
	var COL, currentQueen;
	for(var ii = 0; ii < board.colNumbers.length; ii++){
		currentQueen = board.colNumbers[ii];
		//remove columns, simple enough
		winners[currentQueen] = false;
		//tricky, remove those diagonals
		COL = currentQueen + (decisionRow-ii);	//down right
		if(COL >= 0 && COL <= 7){
			winners[COL] = false;
		}
		COL = currentQueen - (decisionRow-ii);	//down left
		if(COL >= 0 && COL <= 7){
			winners[COL] = false;
		}
	}
	var makeTheBoard;
	var returnBoards = [];
	var newBoard;

	for(var ii = 0; ii < winners.length; ii++){
		makeTheBoard = winners[ii];
		if(makeTheBoard){
			newBoard = board.colNumbers.slice();
			newBoard.push(ii);
			returnBoards.push(new scoredBoard(decisionRow, newBoard));
		}
	}
	return returnBoards;
}

function checkWin(board){
	return board.colNumbers.length >= 8;
}


var functionPack1 =
{
	isGoal: checkWin,
	generator: generateSuccessors,
	start: new scoredBoard(0, []),
	bb: true
};

var queenSearcher = new TreeSearch(functionPack1);

queenSearcher.UCS();


