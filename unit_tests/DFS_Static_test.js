
//credit Mozilla MDN
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var testBoard1 = [1,2,1,2, 2,1,0,0, 1,0,0,0, 2,0,0,0];	//1-8 2-7

var counter = 0;
function DFS_Static(rows, board, num){
	counter++;
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

/*
for(var qq = 0 ; qq < 100000; qq++){
	for(var ii = 0 ; ii < 4; ii++){
		for(var kk = 0 ; kk < 4; kk++){
			testBoard1[ii*4 + kk] = getRandomInt(0, 3);
		}
	}
	DFS_Static([], testBoard1, 1);	//8
	console.log(counter);
	counter = 0;
}*/

console.log(DFS_Static([], testBoard1, 1));	//8
console.log(DFS_Static([], testBoard1, 2));	//7
