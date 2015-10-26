

var testBoard1 = [0,0,0,1, 0,0,0,1, 1,0,0,0, 1,0,0,0];	//fail
var testBoard2 = [0,1,0,0, 0,0,1,0, 0,0,0,1, 1,0,0,0];	//pass
var testBoard3 = [0,1,0,0, 0,0,1,0, 0,0,1,0, 0,1,0,0];	//fail
var testBoard4 = [0,1,0,0, 0,0,1,0, 1,0,0,0, 1,0,0,0];	//fail
var testBoard5 = [0,0,1,0, 0,1,0,0, 1,0,0,0, 0,0,0,1];	//pass



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

function print_board(board){
	for(var ii = 0; ii < 4; ii++){
		console.log(board[ii*4 + 0],board[ii*4 + 1],board[ii*4 + 2],board[ii*4 + 3]);
	}
}

print_board(testBoard1);
console.log(DFS_Board([], testBoard1, 1));

print_board(testBoard2);
console.log(DFS_Board([], testBoard2, 1));

print_board(testBoard3);
console.log(DFS_Board([], testBoard3, 1));

print_board(testBoard4);
console.log(DFS_Board([], testBoard4, 1));

print_board(testBoard5);
console.log(DFS_Board([], testBoard5, 1));






