var TreeSearch = require("../treeSearch.js");
var fs = require('fs');


/*
	Reads a list of numbers and returns a list containing them,
	attempting to ignore punctuation
	Assumes 1-digit numbers
*/
function readFile(filename){
	var contents = fs.readFileSync(filename).toString();
	var lines = contents.split("");
	lines = lines.filter(function(e){return e != "\n" && !isNaN(parseInt(e))})
	lines = lines.map(Number);
	return lines;
}

/*
	return if the number of ones is strictly greater than the number of 2's,
	indicating it's two's move
*/
function twosMove(board){
	var ones = board.filter(function(e){ return e == 1 }).length;
	var twos = board.filter(function(e){ return e == 2 }).length;
	return ones > twos;
}

var test1 = readFile("../test_cases/test1");
var test2 = readFile("../test_cases/test2");
var test3 = readFile("../test_cases/test3");

var userBoard, userMini;

var filename = process.argv[2];
try{
	userBoard = readFile(filename);
	userMini = twosMove(userBoard);
}catch(ENOENT){
	console.log("Invalid filename");
}

if(userBoard.length != 16){
	console.log("wrong board size");
	return false;
}

/*
	The game of "collect four", which is a name I made up

	1 is a winner if there are 4 1's on the board which do not share a row or a column.
*/


function collectFourBoard(){
	//2d array needed
	this.board = [0,0,0,0, 0,0,0,0 ,0,0,0,0 ,0,0,0,0];
	this.clone = function(){
		retval = new collectFourBoard();
		retval.board = this.board.slice();
		return retval;
	}
	this.print = function(){
		var board = this.board;
		for(var ii = 0; ii < 4; ii++){
			console.log(board[ii*4 + 0],board[ii*4 + 1],board[ii*4 + 2],board[ii*4 + 3]);
		}
	}
}

/*
	Unfortunate that I have to do 2 DFS here.
	I feel like there is a more clever way
*/
function isGoal(board){
	if(DFS_Board([], board.board, 1) != undefined){
		return 1;
	}else if(DFS_Board([], board.board, 2) != undefined){
		return -1;
	}
	else if(board.board.indexOf(0) == -1){
		return 0;
	}
	return -2;
}

var staticEval = function(state){
	wins1 = DFS_Static([], state.board, 1);
	wins2 = DFS_Static([], state.board, 2);
	return  wins1 - wins2;
}


function DFS_Static(rows, board, num){
	var curRow = rows.length;
	sum = 0;
	var newRows, currentCell;
	if(curRow == 4) { return 1;}
	for(var kk = 0; kk < 4; kk ++){
		currentCell = board[curRow*4 + kk]
		if((currentCell == 0 || currentCell == num) && rows.indexOf(kk) == -1){
			newRows = rows.slice();
			newRows.push(kk);
			sum += DFS_Static(newRows, board, num);
		}
	}
	return sum;
}



//tricky little thing
/*
	Use DFS to check if num is the winner here,
	returns undefined if num is not a winner,
	otherwise returns the first winning set of columns it finds.
*/
function DFS_Board(rows, board, num){
	var curRow = rows.length;
	var newRows, retval;
	if(curRow == 4) return rows;	//we found a solution already
	for(var kk = 0; kk < 4; kk++){
		if(board[curRow*4 + kk] == num){
			if(rows.indexOf(kk) == -1){
				newRows = rows.slice();
				newRows.push(kk);
				retval = DFS_Board(newRows, board, num);
				if(retval != undefined){
					return retval;
				}
			}
		}
	}
	return undefined;
}




/*
	Just go in row major order and stick num into each
	empty space.
	Return all such boards.
*/
function generateSuccessors(board, mini){
	num = (!mini) ? 1 : 2;
	var retval = [];
	var duplicate1;

	for(var ii = 0; ii < 4; ii++){	//row
		for(var kk = 0; kk < 4; kk++){	//col
			if(board.board[ii*4 + kk] == 0){
				duplicate1 = board.clone();
				duplicate1.board[ii*4 + kk] = num;
				retval.push(duplicate1);
			}
		}
	}
	return retval;
}


var functionPack1 =
{
	isGoal: isGoal,
	generator: generateSuccessors,
	depthLimit: 6,
	staticEval: staticEval
};


var gameSearch = new TreeSearch(functionPack1);
var initial = new collectFourBoard();
console.log("using board: ", userBoard);
initial.board = userBoard;

//console.log(generateSuccessors(new collectFourBoard()));



//initial.board = [0,1,2,0, 2,0,1,2, 1,0,0,0, 0,0,0,0];
/*
0 1 2 0
2 0 1 2
1 0 0 0
0 0 0 0
*/

function test(board, mini){
	initial.board = board;
	console.log("board: ");
	gameSearch.count = 0;
	initial.print();
	console.log( ((!mini) ? "1" : "2")+" to move");
	console.log("performing minimax");

	var result = gameSearch.minimax(initial, mini);

	if(result == 1){
		console.log("1 wins!");
	}else if(result == 0){
		console.log("draw");
	}else{
		console.log("2 wins...");
	}

	console.log("nodes expanded: ", gameSearch.count);

	console.log("performing alphabeta");
	gameSearch.count = 0;
	gameSearch.bestMove = undefined;
	gameSearch.bestScore = -Infinity;
	var result = gameSearch.minimaxAB(initial, mini);

	if(result == 100){
		console.log("1 wins!");
	}else if(result == -100){
		console.log("2 wins...");
	}
	console.log("First move: ");
	gameSearch.bestMove.print();

	console.log("nodes expanded: ", gameSearch.count);
}

console.log("\n=============== test1 ===============\n\n");
test(test1, false);
console.log("\n=============== test2 ===============\n\n");
test(test2, false);
console.log("\n=============== test3 ===============\n\n");
test(test3, true);
console.log("\n============== userFile =============\n\n");
test(userBoard, userMini);








