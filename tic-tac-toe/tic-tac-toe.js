let width = innerHeight - 170;
let tileWidth = width / 3;

let content = document.querySelector("#content");
content.style.width = width;
let canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = width;
canvas.id = "canvas";
let ctx = canvas.getContext("2d");
content.appendChild(canvas);

/*********************************************************************************************************************************************/
/***************************************************************** Models ********************************************************************/
/*********************************************************************************************************************************************/

class AIMove{
	constructor(score, x, y){
		this.score = score;
		this.x = x;
		this.y = y;
	}
}

/*********************************************************************************************************************************************/
/****************************************************************** Game Logic ***************************************************************/
/*********************************************************************************************************************************************/

let playerTurn = true;
let gameBoard = [
	[' ', ' ', ' '],
	[' ', ' ', ' '],
	[' ', ' ', ' ']];

function placeMarker(x, y, mark){
	if(gameBoard[y][x] == ' '){
		gameBoard[y][x] = mark;
		return true;
	}
	return false;
}

function clearBoard(){
	gameBoard = [
		[' ', ' ', ' '],
		[' ', ' ', ' '],
		[' ', ' ', ' ']];
	ctx.clearRect(0, 0, width, width);
	drawGrid();
}

function hasWon(mark){
	for(let y = 0; y < gameBoard.length; y++){
		let wonHorizontally = true;
		let wonVertically = true;
		for(let x = 0; x < gameBoard.length; x++){
			if(gameBoard[y][x] != mark){
				wonHorizontally = false;
			}
			if(gameBoard[x][y] != mark){
				wonVertically = false;
			}
		}
		if(wonHorizontally || wonVertically){
			return true;
		}
	}

	if(gameBoard[0][0] == mark && gameBoard[1][1] == mark && gameBoard[2][2] == mark){
		return true;
	}
	if(gameBoard[2][0] == mark && gameBoard[1][1] == mark && gameBoard[0][2] == mark){
		return true;
	}
	return false;
}

function noMoreMoves(){
	for(let i = 0; i < gameBoard.length; i++){
		for(let j = 0; j < gameBoard[i].length; j++){
			if(gameBoard[i][j] == ' '){
				return false;
			}
		}
	}
	return true;
}

function isDraw(){
	return !hasWon('X') && !hasWon('O') && noMoreMoves();
}

canvas.addEventListener("mousedown", e => {
	if(!playerTurn){
		return;
	}

	let x = Math.floor(e.offsetX / tileWidth);
	let y = Math.floor(e.offsetY / tileWidth);

	if(placeMarker(x, y, 'X')){
		playerTurn = false;
	}else{
		return;
	}
	drawBoardState();

	if(!noMoreMoves()){
		let aiMove = minimax(true);
		gameBoard[aiMove.y][aiMove.x] = 'O';
	}
	drawBoardState();

	if(isDraw(gameBoard)){
		alert("Draw!");
		clearBoard();
		drawBoardState();
	}else if(hasWon('X')){
		alert("You Win!");
		clearBoard();
		drawBoardState();
	}else if(hasWon('O')){
		alert("AI Wins!");
		clearBoard();
		drawBoardState();
	}

	playerTurn = true;
});

drawGrid();
drawBoardState();

/*********************************************************************************************************************************************/
/**************************************************************** Graphics *******************************************************************/
/*********************************************************************************************************************************************/

function drawGrid(){
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 2;
	ctx.rect(1, 1, width - 2, width - 2);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(tileWidth, 0);
	ctx.lineTo(tileWidth, width);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(tileWidth * 2, 0);
	ctx.lineTo(tileWidth * 2, width);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(0, tileWidth);
	ctx.lineTo(width, tileWidth);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(0, tileWidth * 2);
	ctx.lineTo(width, tileWidth * 2);
	ctx.stroke();
}

function drawBoardState(){
	ctx.font = "200px Helvetica";
	ctx.textAlign = "center";
	for (let i = 0; i < gameBoard.length; i++) {
		for (let j = 0; j < gameBoard[i].length; j++) {
			if(gameBoard[i][j] == 'X'){
				ctx.fillStyle = "#fca311";
				ctx.fillText("X", j * tileWidth + tileWidth / 2, i * tileWidth + 0.8 * tileWidth);
			}else if(gameBoard[i][j] == 'O'){
				ctx.fillStyle = "#505050";
				ctx.fillText("O", j * tileWidth + tileWidth / 2, i * tileWidth + 0.8 * tileWidth);
			}
		}
	}
	ctx.fill();
}

/*********************************************************************************************************************************************/
/*************************************************************** Minimax AI ******************************************************************/
/*********************************************************************************************************************************************/

let aiMark = 'O';
let playerMark = 'X';


function minimax(aiTurn){
	let aiMove = new AIMove(0, 0, 0);
	if(hasWon(aiMark)){
		aiMove.score = 10;
		return aiMove;
	}
	if(hasWon(playerMark)){
		aiMove.score = -10;
		return aiMove;
	}

	let scores = [];

	for(let y = 0; y < gameBoard.length; y++){
		for(let x = 0; x < gameBoard.length; x++){
			if(gameBoard[y][x] == ' '){
				if(aiTurn){
					gameBoard[y][x] = aiMark;
				}else{
					gameBoard[y][x] = playerMark;
				}
				scores.push(minimax(!aiTurn));
				scores[scores.length - 1].x = x;
				scores[scores.length - 1].y = y;
				gameBoard[y][x] = ' ';
			}
		}
	}
	if(scores.length > 0){
		if(aiTurn){
			aiMove = maxScore(scores);
		}else{
			aiMove = minScore(scores);
		}
	}

	return aiMove;
}

function maxScore(scores){
	let max = new AIMove(-50, 0, 0);

	for(let i = 0; i < scores.length; i++){
		if(max.score < scores[i].score){
			max.score = scores[i].score;
			max.x = scores[i].x;
			max.y = scores[i].y;
		}
	}
	return max;
}

function minScore(scores){
	let min = new AIMove(50, 0, 0);

	for(let i = 0; i < scores.length; i++){
		if(min.score > scores[i].score){
			min.score = scores[i].score;
			min.x = scores[i].x;
			min.y = scores[i].y;
		}
	}
	return min;
}

/*function copyGameBoard(gameBoard){
	char[][] gameBoardCopy = new char[3][3];
	for(int i = 0; i < gameBoard.length; i++){
		gameBoardCopy[i] = gameBoard[i].clone();
	}
	return gameBoardCopy;
}*/