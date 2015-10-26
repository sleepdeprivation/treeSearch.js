var TreeSearch = require("../treeSearch.js");


//credit Mozilla MDN
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//credit random stack exchange user
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};


//end credit


/*

		THE N QUEENS PROBLEM:

*/

/*
	Now that we have abstracted uniform cost search we will model the N queens problem
	to be handled by the search
*/

/*
	So first we need a board object,
	it is immutable so it doesn't need to be copied or passed about
*/
var BOARD = 
[
[ 981,1299,1255, 456,1824,1215, 173, 479],
[ 879, 763,1183, 344,1975,1434, 529, 925],
[ 901,1636, 419, 459, 885, 447,1615,1941],
[ 618,1074, 608, 878, 224, 237,  59,1102],
[1025, 707, 949, 627, 521, 598,1872,1051],
[1030,1893, 465,1861, 824, 643,1472, 467],
[1648,1766,1702, 867,1199, 855, 985, 986],
[1602,1109, 393, 373, 529,1024,1166,1258]
];

var BOARD_SIZE = BOARD.length;
var BOARD_MIN = Infinity;
var BOARD_MAX = -Infinity;
for(var ii = 0; ii < BOARD.length; ii++){
	BOARD_MIN = Math.min(BOARD_MIN, BOARD[ii].min());
	BOARD_MAX = Math.max(BOARD_MAX, BOARD[ii].max());
}

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
	this.colNumbers = array; 	//we'll just keep pushing which column we picked, when we have BOARD_SIZE it's a winner
	this.measure = function(){
		if(this.colNumbers.length == 0){ return 0; }
		//var h = 0;
		//if(this.heuristic != undefined){ h = this.heuristic(); /*console.log("heuristic", h);*/}
		return BOARD[this.currentRowNumber][this.colNumbers[this.colNumbers.length-1]];
	}
};

var heuristic = function(){
	var retval = 0.0;
	for(var ii = this.colNumbers.length; ii < BOARD_SIZE; ii++){
		retval += BOARD[ii].min();
	}
	return retval;
}

/*
	We want to generator successor boards
*/
function generateSuccessors(board){
	var decisionRow = board.colNumbers.length;	//decision time
	var winners = [];
	for(var ii = 0; ii < BOARD_SIZE; ii++){
		winners.push(true);	//we're all winners here
	}
	var COL, currentQueen;
	for(var ii = 0; ii < board.colNumbers.length; ii++){
		currentQueen = board.colNumbers[ii];
		//remove columns, simple enough
		winners[currentQueen] = false;
		//tricky, remove those diagonals
		COL = currentQueen + (decisionRow-ii);	//down right
		if(COL >= 0 && COL < BOARD_SIZE){
			winners[COL] = false;
		}
		COL = currentQueen - (decisionRow-ii);	//down left
		if(COL >= 0 && COL < BOARD_SIZE){
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
	return board.colNumbers.length >= BOARD_SIZE;
}


var functionPack1 =
{
	isGoal: checkWin,
	generator: generateSuccessors,
	start: new scoredBoard(0, []),
	bb: true
};

console.log("performing UCS with branch and bound ");
var queenSearcher = new TreeSearch(functionPack1);
queenSearcher.UCS();

console.log("performing UCS without branch and bound");
functionPack1.bb = false;
var queenSearcher = new TreeSearch(functionPack1);
queenSearcher.UCS();

console.log("performing A*");
scoredBoard.prototype.heuristic = heuristic;
//console.log(i);
var queenSearcher = new TreeSearch(functionPack1);
queenSearcher.UCS();

//var queenSearcher = new TreeSearch(functionPack1);
//console.log(queenSearcher.count);
//console.log(queenSearcher.PUSH_COUNT);

