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

var filename = process.argv[2];
try{
	contents = readFile(filename);
}catch(ENOENT){
	console.log("Invalid filename");
}

if(contents.length != 16){
	console.log("wrong board size");
	return false;
}
