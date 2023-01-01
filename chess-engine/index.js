const bottom = document.getElementById('bottom');
const board = document.getElementById('board');
const takenWhiteArea = document.getElementById('taken-white');
const takenBlackArea = document.getElementById('taken-black');
const logArea = document.getElementById('log-text');

const WHITE = 0;
const BLACK = 1;
const black = '#502020';
const white = '#eeddaa';
const PAWN = 'pawn';
const ROOK = 'rook';
const KNIGHT = 'knight';
const BISHOP = 'bishop';
const QUEEN = 'queen';
const KING = 'king';
const takenWhite = [];
const takenBlack = [];
const rankLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const promotionPieces = [ROOK, KNIGHT, QUEEN, BISHOP];

let turn = WHITE;
let selectedPiece;
let whitePawns = [];
let blackPawns = [];
let currentColor = white;
let gameHasEnded = false;

function Piece(type, rank, file, color){
	this.type = type,
	this.rank = rank,
	this.file = file,
	this.color = color,
	this.firstMove = true,
	this.enPassant = false,
	this.validMoves = []
};

for(let i = 0; i < 8; i++){
	blackPawns[i] = new Piece(PAWN, 1, i, BLACK);
	whitePawns[i] = new Piece(PAWN, 6, i, WHITE);
}

const boardState = [
	[
		new Piece(ROOK, 0, 0, BLACK),
		new Piece(KNIGHT, 0, 1, BLACK),
		new Piece(BISHOP, 0, 2, BLACK),
		new Piece(QUEEN, 0, 3, BLACK),
		new Piece(KING, 0, 4, BLACK),
		new Piece(BISHOP, 0, 5, BLACK),
		new Piece(KNIGHT, 0, 6, BLACK),
		new Piece(ROOK, 0, 7, BLACK)
	],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[
		new Piece(ROOK, 7, 0, WHITE),
		new Piece(KNIGHT, 7, 1, WHITE),
		new Piece(BISHOP, 7, 2, WHITE),
		new Piece(QUEEN, 7, 3, WHITE),
		new Piece(KING, 7, 4, WHITE),
		new Piece(BISHOP, 7, 5, WHITE),
		new Piece(KNIGHT, 7, 6, WHITE),
		new Piece(ROOK, 7, 7, WHITE)
	]
];

const getPiece = (rank, file) =>{
	return boardState[rank][file];
};

const setPiece = (rank, file, value) =>{
	boardState[rank][file] = value;
};

const getPieceByTile = (tile) =>{
	return getPiece(parseInt(tile.id[0]), parseInt(tile.id[1]));
};

const getTile = (rank, file) =>{
	return document.getElementById(`${rank}${file}`);
};

whitePawns.forEach(p => setPiece(p.rank, p.file, p));
blackPawns.forEach(p => setPiece(p.rank, p.file, p));

const movePiece = (piece, destRank, destFile) =>{
	if(getPiece(destRank, destFile) !== 0){
		if(getPiece(destRank, destFile).color === WHITE){
			takenWhite.push(getPiece(destRank, destFile));
		}else{
			takenBlack.push(getPiece(destRank, destFile));
		}
	}
	setPiece(destRank, destFile, piece);
	setPiece(piece.rank, piece.file, 0);
	piece.rank = destRank;
	piece.file = destFile;
};

const getNorthernMoves = (rank, file) =>{
	let moves = [];
	rank--;
	while(rank >= 0){
		if(getPiece(rank, file) !== 0){
			moves.push({rank: rank, file: file});
			break;
		}
		moves.push({rank: rank, file: file});
		rank--;
	}
	return moves;
};

const getNorthEasternMoves = (rank, file) =>{
	let moves = [];
	rank--;
	file++;
	while(rank >= 0 && file < 8){
		if(getPiece(rank, file) !== 0){
			moves.push({rank: rank, file: file});
			break;
		}
		moves.push({rank: rank, file: file});
		rank--;
		file++;
	}
	return moves;
};

const getNorthWesternMoves = (rank, file) =>{
	let moves = [];
	rank--;
	file--;
	while(rank >= 0 && file >= 0){
		if(getPiece(rank, file) !== 0){
			moves.push({rank: rank, file: file});
			break;
		}
		moves.push({rank: rank, file: file});
		rank--;
		file--;
	}
	return moves;
};

const getSouthernMoves = (rank, file) =>{
	let moves = [];
	rank++;
	while(rank < 8){
		if(getPiece(rank, file) !== 0){
			moves.push({rank: rank, file: file});
			break;
		}
		moves.push({rank: rank, file: file});
		rank++;
	}
	return moves;
};

const getSouthEasternMoves = (rank, file) =>{
	let moves = [];
	rank++;
	file++;
	while(rank < 8 && file < 8){
		if(getPiece(rank, file) !== 0){
			moves.push({rank: rank, file: file});
			break;
		}
		moves.push({rank: rank, file: file});
		rank++;
		file++;
	}
	return moves;
};

const getSouthWesternMoves = (rank, file) =>{
	let moves = [];
	rank++;
	file--;
	while(rank < 8 && file >= 0){
		if(getPiece(rank, file) !== 0){
			moves.push({rank: rank, file: file});
			break;
		}
		moves.push({rank: rank, file: file});
		rank++;
		file--;
	}
	return moves;
};

const getEasternMoves = (rank, file) =>{
	let moves = [];
	file++;
	while(file < 8){
		if(getPiece(rank, file) !== 0){
			moves.push({rank: rank, file: file});
			break;
		}
		moves.push({rank: rank, file: file});
		file++;
	}
	return moves;
};

const getWesternMoves = (rank, file) =>{
	let moves = [];
	file--;
	while(file >= 0){
		if(getPiece(rank, file) !== 0){
			moves.push({rank: rank, file: file});
			break;
		}
		moves.push({rank: rank, file: file});
		file--;
	}
	return moves;
};

const getValidKingMoves = (piece) =>{
	let moves = [];
	if(piece.rank > 0)						moves.push({rank: piece.rank - 1, file: piece.file});
	if(piece.rank < 7)						moves.push({rank: piece.rank + 1, file: piece.file});
	if(piece.file > 0)						moves.push({rank: piece.rank, file: piece.file - 1});
	if(piece.file < 7)						moves.push({rank: piece.rank, file: piece.file + 1});
	if(piece.rank > 0 && piece.file > 0)	moves.push({rank: piece.rank - 1, file: piece.file - 1});
	if(piece.rank < 7 && piece.file < 7)	moves.push({rank: piece.rank + 1, file: piece.file + 1});
	if(piece.rank > 0 && piece.file < 7)	moves.push({rank: piece.rank - 1, file: piece.file + 1});
	if(piece.rank < 7 && piece.file > 0)	moves.push({rank: piece.rank + 1, file: piece.file - 1});

	return moves
		.filter(x => getPiece(x.rank, x.file) === 0
		|| getPiece(x.rank, x.file).color !== piece.color);
};

const getValidQueenMoves = (piece) =>{
	let moves = getNorthernMoves(piece.rank, piece.file);
	moves.push(getSouthernMoves(piece.rank, piece.file));
	moves.push(getWesternMoves(piece.rank, piece.file));
	moves.push(getEasternMoves(piece.rank, piece.file));
	moves.push(getNorthWesternMoves(piece.rank, piece.file));
	moves.push(getNorthEasternMoves(piece.rank, piece.file));
	moves.push(getSouthWesternMoves(piece.rank, piece.file));
	moves.push(getSouthEasternMoves(piece.rank, piece.file));

	return moves
		.flatMap(x => x)
		.filter(x => getPiece(x.rank, x.file) === 0
			|| getPiece(x.rank, x.file).color !== piece.color);
};

const getValidKnightMoves = (piece) =>{
	let moves = [];
	if(piece.rank > 1 && piece.file < 7)	moves.push({rank: piece.rank - 2, file: piece.file + 1});
	if(piece.rank > 1 && piece.file > 0)	moves.push({rank: piece.rank - 2, file: piece.file - 1});
	if(piece.rank < 6 && piece.file < 7)	moves.push({rank: piece.rank + 2, file: piece.file + 1});
	if(piece.rank < 6 && piece.file > 0)	moves.push({rank: piece.rank + 2, file: piece.file - 1});
	if(piece.rank < 7 && piece.file < 6)	moves.push({rank: piece.rank + 1, file: piece.file + 2});
	if(piece.rank > 0 && piece.file < 6)	moves.push({rank: piece.rank - 1, file: piece.file + 2});
	if(piece.rank < 7 && piece.file > 1)	moves.push({rank: piece.rank + 1, file: piece.file - 2});
	if(piece.rank > 0 && piece.file > 1)	moves.push({rank: piece.rank - 1, file: piece.file - 2});

	return moves
		.filter(x => getPiece(x.rank, x.file) === 0
			|| getPiece(x.rank, x.file).color !== piece.color);
};

const getValidBishopMoves = (piece) =>{
	let moves = getNorthWesternMoves(piece.rank, piece.file);
	moves.push(getNorthEasternMoves(piece.rank, piece.file));
	moves.push(getSouthWesternMoves(piece.rank, piece.file));
	moves.push(getSouthEasternMoves(piece.rank, piece.file));

	return moves
		.flatMap(x => x)
		.filter(x => getPiece(x.rank, x.file) === 0
			|| getPiece(x.rank, x.file).color !== piece.color);
};

const getValidRookMoves = (piece) =>{
	let moves = getNorthernMoves(piece.rank, piece.file);
	moves.push(getSouthernMoves(piece.rank, piece.file));
	moves.push(getWesternMoves(piece.rank, piece.file));
	moves.push(getEasternMoves(piece.rank, piece.file));

	return moves
		.flatMap(x => x)
		.filter(x => getPiece(x.rank, x.file) === 0
			|| getPiece(x.rank, x.file).color !== piece.color);
};

const getValidPawnMoves = (piece) =>{
	let moves = [];
	if(piece.color === WHITE){
		if(piece.firstMove && getPiece(piece.rank-2, piece.file) === 0 && getPiece(piece.rank-1, piece.file) === 0){
			moves.push({rank: piece.rank-2, file: piece.file});
			if(piece.file > 0
				&& getPiece(piece.rank-2, piece.file-1) !== 0
				&& getPiece(piece.rank-2, piece.file-1).type === PAWN
				&& getPiece(piece.rank-2, piece.file-1).color !== piece.color){
				piece.enPassant = true;
			}else if(piece.file < 7
				&& getPiece(piece.rank-2, piece.file+1) !== 0
				&& getPiece(piece.rank-2, piece.file+1).type === PAWN
				&& getPiece(piece.rank-2, piece.file+1).color !== piece.color){
				piece.enPassant = true;
			}
		}
		if(piece.rank > 0 && getPiece(piece.rank-1, piece.file) === 0){
			moves.push({rank: piece.rank-1, file: piece.file});
		}
		if(piece.rank > 0 && piece.file > 0
			&& getPiece(piece.rank-1, piece.file-1) !== 0
			&& getPiece(piece.rank-1, piece.file-1).color !== piece.color){
			moves.push({rank: piece.rank-1, file: piece.file-1});
		}
		if(piece.rank > 0 && piece.file < 7
			&& getPiece(piece.rank-1, piece.file+1) !== 0
			&& getPiece(piece.rank-1, piece.file+1).color !== piece.color){
			moves.push({rank: piece.rank-1, file: piece.file+1});
		}
		getEnPassantMoves(piece, boardState)
			.forEach(x => moves.push({rank: x.rank-1, file: x.file, enPassantMove: true}));
	}else{
		if(piece.firstMove && getPiece(piece.rank+2, piece.file) === 0 && getPiece(piece.rank+1, piece.file) === 0){
			moves.push({rank: piece.rank+2, file: piece.file});
			if(piece.file > 0
				&& getPiece(piece.rank+2, piece.file-1) !== 0
				&& getPiece(piece.rank+2, piece.file-1).type === PAWN
				&& getPiece(piece.rank+2, piece.file-1).color !== piece.color){
				piece.enPassant = true;
			}else if(piece.file < 7
				&& getPiece(piece.rank+2, piece.file+1) !== 0
				&& getPiece(piece.rank+2, piece.file+1).type === PAWN
				&& getPiece(piece.rank+2, piece.file+1).color !== piece.color){
				piece.enPassant = true;
			}
		}
		if(piece.rank < 7 && getPiece(piece.rank+1, piece.file) === 0){
			moves.push({rank: piece.rank+1, file: piece.file});
		}
		if(piece.rank < 7 && piece.file > 0
			&& getPiece(piece.rank+1, piece.file-1) !== 0
			&& getPiece(piece.rank+1, piece.file-1).color !== piece.color){
			moves.push({rank: piece.rank+1, file: piece.file - 1});
		}
		if(piece.rank < 7 && piece.file < 7
			&& getPiece(piece.rank+1, piece.file+1) !== 0
			&& getPiece(piece.rank+1, piece.file+1).color !== piece.color){
			moves.push({rank: piece.rank+1, file: piece.file + 1});
		}
		getEnPassantMoves(piece, boardState)
			.forEach(x => moves.push({rank: x.rank+1, file: x.file, enPassantMove: true}));
	}
	return moves;
};

const getEnPassantMoves = (piece, boardState) =>{
	return boardState
		.flatMap(x => x)
		.filter(x =>
			x.enPassant && x.color !== piece.color &&
			(x.file === piece.file+1 && x.rank === piece.rank
			|| x.file === piece.file-1 && x.rank === piece.rank));
};

const enPassantTake = (piece, rank, file) =>{
	piece.validMoves.filter(x => x.enPassantMove && x.rank === rank && x.file === file)
		.forEach(x =>{
			if(piece.color === WHITE){
				takenWhite.push(getPiece(rank+1, file));
				setPiece(rank+1, file, 0);
			}else{
				takenBlack.push(getPiece(rank-1, file));
				setPiece(rank-1, file, 0);
			}
		});
};

const removeExpiredEnPassant = (color) =>{
	boardState.flatMap(x => x)
		.filter(x => x.color === color && x.enPassant)
		.forEach(x => x.enPassant = false);
};

const promote = (piece) =>{
	if(piece.type === PAWN){
		if(piece.color === BLACK && piece.rank === 7
			|| piece.color === WHITE && piece.rank === 0){
			getAndPlacePromotionPiece(piece);
		}
	}
};

const getAndPlacePromotionPiece = (piece) =>{
	let color;
	if(piece.color === BLACK){
		color = 'black';
	}else{
		color = 'white';
	}

	let popup = document.getElementById('popup');
	popup.hidden = false;
	popup.style.display = 'flex';
	let pieces = document.getElementById('pieces');

	for(let i = 0; i < 4; i++){
		let selectionPiece = {type: promotionPieces[i], element: document.createElement('img')};
		selectionPiece.element.id = selectionPiece.type;
		selectionPiece.element.src = `./assets/${color}_${promotionPieces[i]}.svg`;

		selectionPiece.element.addEventListener('click', e => {
			if(!gameHasEnded){
				promotionSelection(piece, e.originalTarget.id, pieces);
			}
		});

		pieces.appendChild(selectionPiece.element);
	}
};

const promotionSelection = (piece, selectedType, toClear) =>{
	getPiece(piece.rank, piece.file).type = selectedType
	popup.hidden = true;
	popup.style.display = 'none';
	toClear.innerHTML = '';
	clearBoard();
	renderBoard();
};

const highlightValidMoves = (moves) =>{
	const tiles = Array.of(board.childNodes)[0];
	const moveIds = moves.map(x => `${x.rank}${x.file}`);

	tiles.forEach(x => {
		if(moveIds.includes(x.id)){
			if(getPiece(parseInt(x.id[0]), parseInt(x.id[1])) === 0){
				const mark = document.createElement('div');
				mark.setAttribute('class', 'mark');
				x.appendChild(mark);
			}else{
				x.childNodes[0].style.borderRadius = '50%';
				x.childNodes[0].style.border = '4px solid rgba(0, 0, 0, 0.4)';
			}
		}
	});
};

const getValidMoves = (piece) =>{
	let moves = [];

	switch(piece.type){
		case PAWN:
			moves = getValidPawnMoves(piece);
			break;
		case KING:
			moves = getValidKingMoves(piece);
			break;
		case ROOK:
			moves = getValidRookMoves(piece);
			break
		case BISHOP:
			moves = getValidBishopMoves(piece);
			break;
		case KNIGHT:
			moves = getValidKnightMoves(piece);
			break;
		case QUEEN:
			moves = getValidQueenMoves(piece);
			break;
		default:
			console.log('Piece not found. This should never occur.');
	}
	return moves;
};

const getPiecesOnBoard = (color) =>{
	return boardState
		.flatMap(x => x)
		.filter(x => x.color === color);
};

const getAllMoves = (pieces) =>{
	return pieces.map(x => getValidMoves(x))
		.flatMap(x => x);
};

const getKing = (color) =>{
	return boardState
		.flatMap(x => x)
		.filter(x => x.type === KING && x.color === color)[0];
};

getPiecesByColor = (color) =>{
	if(color === BLACK){
		return getPiecesOnBoard(WHITE);
	}else{
		return getPiecesOnBoard(BLACK);
	}
};

const isCheck = (color) =>{
	let king = getKing(color);
	return isPosChecked(color, king.rank, king.file);
};

const isPosChecked = (color, rank, file) =>{
	let pieces = getPiecesByColor(color);
	let moves = getAllMoves(pieces);
	return containsPosition(moves, {rank: rank, file: file});
};

const evalPossibleMove = (piece, color, x) =>{
	let taken = color === BLACK ? takenWhite : takenBlack;
	let oldRank = piece.rank;
	let oldFile = piece.file;
	let takenCount = taken.length;
	movePiece(piece, x.rank, x.file);
	let check = isCheck(color)

	if(taken.length > takenCount){
		revertMoveWithCapture(piece, oldRank, oldFile, taken);
	}else{
		movePiece(piece, oldRank, oldFile);
	}

	if(!check){
		return true;
	}
	return false;
};

const isCheckMate = (color) =>{
	let pieces = getPiecesOnBoard(color);
	let moves = [];
	pieces.forEach(p => p.validMoves = getValidMoves(p));

	moves = pieces.map(p =>
		p.validMoves
			.filter(x => evalPossibleMove(p, color, x)))
		.flatMap(x => x);

	return moves.length === 0;
};

const isStalemate = (color) =>{
	let king = getKing(color);

	if(!isCheck(color)){
		let moves = getValidMoves(king);
		let moveCount = moves.length;
		let checkedKingMoves = moves
			.filter(x => !evalPossibleMove(king, color, x))
			.length;
		let pieces = getPiecesOnBoard(color);
		pieces = pieces.filter(x => x.type !== KING);
		let pieceMoves = getAllMoves(pieces);
		if(checkedKingMoves > 0 && checkedKingMoves === moveCount && pieceMoves.length === 0){
			return true;
		}
	}
	return false;
};

const isEven = (num) =>{
	return num % 2 === 0;
};

const isDeadPosition = () =>{
	let pieces = getPiecesOnBoard(BLACK);
	pieces.push(getPiecesOnBoard(WHITE));
	pieces = pieces.flatMap(x => x);

	let kingCount = pieces.filter(x => x.type === KING).length;
	let bishops = pieces.filter(x => x.type === BISHOP);

	let bishopsOnBlack = bishops.filter(x =>
		(isEven(x.rank) && isEven(x.file)) || (!isEven(x.rank) && !isEven(x.file))).length;

	let bishopsOnWhite = bishops.filter(x =>
		(!isEven(x.rank) && isEven(x.file)) || (isEven(x.rank) && !isEven(x.file))).length;

	let bishopCount = bishops.length;
	let knightCount = pieces.filter(x => x.type === KNIGHT).length;

	if((pieces.length === 2 && kingCount === 2)
		|| (pieces.length === 3 && kingCount === 2 && (bishopCount === 1 || knightCount === 1))
		|| (pieces.length === 4 && (bishopsOnBlack === 2 || bishopsOnWhite === 2))){
		guiLog('Dead Position.');
		return true;
	}
	return false;
};

const isDraw = () =>{
	if(isStalemate(BLACK) || isStalemate(WHITE) || isDeadPosition()){
		return true;
	}
	return false;
};

const highlightTile = (tile, color) =>{
	tile.style.backgroundColor = color;
};

const markTile = (tile, color) =>{
	const piece = getPieceByTile(tile.parentElement);
	if(piece.color === piece.color){
		tile.style.boxShadow = '4px 4px 4px black';
		tile.style.border = `4px solid ${color}`;
		tile.style.borderRadius = '3px';
	}
};

const unmarkTile = (tile) =>{
	tile.style.boxShadow = '';
	tile.style.border = '';
	tile.style.borderRadius = '';
};

const configPiece = (tile, piece) =>{
	const img = document.createElement('img');
	img.draggable = false;
	tile.addEventListener('mouseenter', () => {
		if(!gameHasEnded){
			markTile(img, '#308080');
		}
	});
	tile.addEventListener('mouseleave', () => {
		if(!gameHasEnded){
			unmarkTile(img);
		}
	});
	tile.appendChild(img);
	if(piece.color === 0){
		img.src = `./assets/white_${piece.type}.svg`
	}else{
		img.src = `./assets/black_${piece.type}.svg`

	}
	return tile;
};

const clearBoard = () =>{
	board.innerHTML = '';
};

const validClick = (piece) =>{
	return piece.color === turn
};

const swapTurn = () =>{
	if(turn === WHITE){
		turn = BLACK;
	}else{
		turn = WHITE;
	}
};

const containsPosition = (moves, position) =>{
	for(const p of moves){
		if(p.rank === position.rank && p.file === position.file){
			return true;
		}
	}
	return false;
};

const guiLog = (text) =>{
	logArea.value += `${text}\n`;
	logArea.scrollTop = 99999;
};

const guiLogLineBreak = (columns) =>{
	for(let i = 0; i < columns; i++){
		logArea.value += '-';
	}
	logArea.value += '\n';
	logArea.scrollTop = 99999;
}

const guiLogMove = (fromRank, fromFile, toRank, toFile) =>{
	logArea.value += `${8 - fromRank}${rankLabels[fromFile]} to ${8 - toRank}${rankLabels[toFile]}\n`;
	logArea.scrollTop = 99999;
};

const revertMoveWithCapture = (piece, oldRank, oldFile, takenPieces) =>{
	movePiece(piece, oldRank, oldFile);
	let captured = takenPieces.pop();
	setPiece(captured.rank, captured.file, captured);
};

const handleMove = (selectedPiece, rank, file) =>{
	let taken = selectedPiece.color === BLACK ? takenWhite : takenBlack;
	let takenCount = taken.length;
	let oldRank = selectedPiece.rank;
	let oldFile = selectedPiece.file;

	movePiece(selectedPiece, rank, file);
	enPassantTake(selectedPiece, rank, file);

	if(isCheck(selectedPiece.color)){
		if(taken.length > takenCount){
			revertMoveWithCapture(selectedPiece, oldRank, oldFile, taken);
		}else{
			movePiece(selectedPiece, oldRank, oldFile);
		}

		clearBoard();
		renderBoard();
		let king = getKing(selectedPiece.color);
		let kingTile = getTile(king.rank, king.file);
		kingTile.style.backgroundColor = 'red';
	}else{
		guiLogMove(oldRank, oldFile, rank, file);
		selectedPiece.firstMove = false;
		promote(selectedPiece);
		swapTurn();

		if(isCheck(turn) && isCheckMate(turn)){
			guiLog('Checkmate.');
			if(turn === BLACK){
				guiLog('White Wins!');
			}else{
				guiLog('Black Wins!');
			}
			gameHasEnded = true;
		}else if(isDraw()){
			guiLog('Draw.');
			gameHasEnded = true;
		}

		renderTaken(takenBlackArea, takenBlack);
		renderTaken(takenWhiteArea, takenWhite);
		clearBoard();
		renderBoard();
	}
};

const tileClick = (tile) =>{
	const rank = parseInt(tile.id[0]);
	const file = parseInt(tile.id[1]);

	if(selectedPiece === undefined){
		selectedPiece = getPiece(rank, file);
		if(!validClick(selectedPiece)){
			selectedPiece = undefined;
		}else{
			tile.style.backgroundColor = '#54AC63';
			removeExpiredEnPassant(selectedPiece.color);
			selectedPiece.validMoves = getValidMoves(selectedPiece);
			highlightValidMoves(selectedPiece.validMoves);
		}
	}else if(containsPosition(selectedPiece.validMoves, {rank: rank, file: file})){
		handleMove(selectedPiece, rank, file);
		selectedPiece = undefined;
	}else{
		selectedPiece = undefined;
		clearBoard();
		renderBoard();
	}
};

const renderTaken = (area, takenPieces) =>{
	area.innerHTML = '';
	takenPieces.forEach(x => {
		let img = document.createElement('img');
		img.className = 'taken-img';
		if(area.id === 'taken-black'){
			img.src = `./assets/black_${x.type}.svg`;
		}else{
			img.src = `./assets/white_${x.type}.svg`;
		}
		area.appendChild(img);
	});
};

const renderBoard = () =>{
	for(let i = 0; i < 8; i++){
		for(let j = 0; j < 8; j++){
			let tile = document.createElement('div');
			tile.className = 'tile';
			let piece = getPiece(i, j);
			tile.id = `${i}${j}`;

			if(piece !== 0){
				tile = configPiece(tile, piece);
			}

			tile.style.backgroundColor = currentColor;
			tile.draggable = false;
			if(currentColor === black){
				currentColor = white;
			}else{
				currentColor = black;
			}

			tile.addEventListener('click', () => {
				if(!gameHasEnded){
					tileClick(tile);
				}
			});
			board.appendChild(tile);
		}
		if(currentColor === black){
			currentColor = white;
		}else{
			currentColor = black;
		}
	}
};

renderBoard();
guiLog('Welcome!');
guiLogLineBreak(60);
