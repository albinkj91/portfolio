/*
 * OP-codes
 */
const ADD = 1;
const SUB = 2;
const STA = 3;
const LDA = 5;
const BRA = 6;
const BRZ = 7;
const BRP = 8;
const INP = 901;
const OUT = 902;
const HLT = "000";
const DAT = "";

/*
 * Constants
 */
const LABEL_POSITION = 0;
const OP_CODE_POSITION = 1;
const VALUE_POSITION = 2;

const intervalTime = 100;

const sampleProgram = "	INP\n" +
			"loop	OUT\n" +
			"	STA count\n" +
			"	SUB one\n" +
			"	STA count\n" +
			"	BRP loop\n" +
			"	HLT\n" +
			"one	DAT 1\n" +
			"count	DAT"

/*
 * DOM elements
 */
let runButton = document.querySelector("#run");
let loadButton = document.querySelector("#load");
let stepButton = document.querySelector("#step");

const ramContainer = document.querySelector("#ram");

let codeArea = document.querySelector("#code");
let inputArea = document.querySelector("#input");
let outputArea = document.querySelector("#output");

let programCounter = document.querySelector("#program-counter");
let mar = document.querySelector("#mar");
let mdr = document.querySelector("#mdr");
let cir = document.querySelector("#cir");
let acc = document.querySelector("#accumulator");

/*
 * General variables
 */
let interval;
let running = false;
let lastHighlightedCell = 0;
let instructions = [];
let dataAddresses = new Map();

/*
 * Classes
 */
class Instruction{
	constructor(index, opCode, label, value){
		this.index = index;
		this.opCode = opCode;
		this.label = label;
		this.value = value;
	}
} 

/*
 * Visuals
 */
function setRamContainer(memorySpace){
	for(let i = 0; i < memorySpace; i++){
		let cell = document.createElement("cell");
		let cellIndex = document.createElement("h3");
		let cellValue = document.createElement("h5");

		cellIndex.innerHTML = i;
		cellValue.innerHTML = "000";

		cell.appendChild(cellIndex);
		cell.appendChild(cellValue);
		ramContainer.appendChild(cell);
	}
}

function highlightCell(index){
	ramContainer.children[index].style.background = "lime";
	ramContainer.children[index].style.color = "#202020";
}

function hideCellHighlight(index){
	ramContainer.children[index].style.background = "#202020";
	ramContainer.children[index].style.color = "lime";
}

function reset(){
	programCounter.innerHTML = "00";
	mar.innerHTML = "000";
	mdr.innerHTML = "000";
	cir.innerHTML = "000";
	acc.innerHTML = "000";
	inputArea.innerHTML = "";
	outputArea.innerHTML = "";
	hideCellHighlight(lastHighlightedCell);
	
	for(let i = 0; i < 100; i++){
		setCellValue(i, "000");
	}
}

/*
 * RAM acesss
 */
function getCellValue(index){
	return ramContainer.children[index].children[1].innerHTML;
}

function setCellValue(index, value){
	ramContainer.children[index].children[1].innerHTML = value;
}

function loadRam(){
	for(let i = 0; i < instructions.length; i++){
		setCellValue(instructions[i].index, instructions[i].opCode);

		if(instructions[i].value != undefined){
			setCellValue(instructions[i].index, getCellValue(instructions[i].index) + "" + instructions[i].value);
		}
	}
}

/*
 * Lexical analysis
 */
function retrieveAndProcessSourceCode(){
	return document
		.querySelector("#code")
		.value.toUpperCase()
		.replaceAll(/\t+/g, " ")
		.split("\n");
}

function assemble(sourceCode){
	for(let i = 0; i < sourceCode.length; i++){
		instructions[i] = new Instruction();
		instructions[i].index = i;
		let codeLine = sourceCode[i].split(" ");

		if(codeLine.length === 2){
			codeLine[2] = "";
		}
		checkOPCodeAndLoadRAM(codeLine, instructions[i]);
	}

	instructions.forEach(i => {
		if(i.opCode != DAT){
			i.value = dataAddresses.get(i.value);
		}
	});
}

function checkOPCodeAndLoadRAM(codeLine, currentInstruction){
	switch(codeLine[OP_CODE_POSITION]){
		case "ADD":
			currentInstruction.opCode = ADD;
			break
		case "SUB":
			currentInstruction.opCode = SUB;
			break
		case "STA":
			currentInstruction.opCode = STA;
			break
		case "LDA":
			currentInstruction.opCode = LDA;
			break
		case "BRA":
			currentInstruction.opCode = BRA;
			break
		case "BRZ":
			currentInstruction.opCode = BRZ;
			break
		case "BRP":
			currentInstruction.opCode = BRP;
			break
		case "OUT":
			currentInstruction.opCode = OUT;
			break
		case "INP":
			currentInstruction.opCode = INP;
			break;
		case "HLT":
			currentInstruction.opCode = HLT;
			break;
		case "DAT":
			currentInstruction.opCode = DAT;
			currentInstruction.value = codeLine[VALUE_POSITION];
			currentInstruction.label = codeLine[LABEL_POSITION];

			if(currentInstruction.value == ""){
				currentInstruction.value = 0;
			}

			dataAddresses.set(codeLine[LABEL_POSITION], currentInstruction.index);
			break;
	}

	if(currentInstruction.opCode !== DAT){
		currentInstruction.label = codeLine[LABEL_POSITION];
		currentInstruction.value = codeLine[VALUE_POSITION];
		if(currentInstruction.label != ""){
			dataAddresses.set(currentInstruction.label, currentInstruction.index);
		}
	}
}

/*
 * OP-code functionality
 */
function add(memoryAddress){
	acc.innerHTML = parseInt(acc.innerHTML) + parseInt(getCellValue(memoryAddress));
}

function sub(memoryAddress){
	acc.innerHTML = parseInt(acc.innerHTML) - parseInt(getCellValue(memoryAddress));
}

function sta(memoryAddress){
	setCellValue(memoryAddress, acc.innerHTML);
}

function lda(memoryAddress){
	acc.innerHTML = getCellValue(memoryAddress);
}

function bra(memoryAddress){
	programCounter.innerHTML = memoryAddress;
}

function brz(memoryAddress){
	if(parseInt(acc.innerHTML) === 0){
		bra(memoryAddress);
	}
}

function brp(memoryAddress){
	if(parseInt(acc.innerHTML) >= 0){
		bra(memoryAddress);
	}
}

function inp(){
	let input = prompt("INPUT:");
	inputArea.innerHTML += input + "\n";
	acc.innerHTML = input;
}

function out(){
	outputArea.innerHTML += acc.innerHTML + "\n";
}

/*
 * Execution
 */
function executeOpCode(value){
	let opCode = parseInt(value.substring(0, 1));
	let memoryAddress = parseInt(value.substring(1));

	if(parseInt(value) === INP){
		inp();
		mdr.innerHTML = INP;
	}else if(parseInt(value) === OUT){
		out();
		mdr.innerHTML = OUT;
	}else if(value === HLT){
		hideCellHighlight(lastHighlightedCell);
		running = false;
		clearInterval(interval);
	}else{
		mar.innerHTML = memoryAddress;
		mdr.innerHTML = getCellValue(memoryAddress);
		switch(opCode){
			case ADD:
				add(memoryAddress);
				break;
			case SUB:
				sub(memoryAddress);
				break;
			case STA:
				sta(memoryAddress);
				break;
			case LDA:
				lda(memoryAddress);
				break;
			case BRA:
				bra(memoryAddress);
				break;
			case BRZ:
				brz(memoryAddress);
				break;
			case BRP:
				brp(memoryAddress);
				break;
		}
	}
}

function step(){
	hideCellHighlight(lastHighlightedCell);
	let programCounterValue = parseInt(programCounter.innerHTML);
	highlightCell(programCounterValue);
	lastHighlightedCell = programCounterValue;
	cir.innerHTML = getCellValue(programCounterValue);
	mar.innerHTML = programCounterValue;

	programCounter.innerHTML = programCounterValue + 1;
	executeOpCode(cir.innerHTML);
}

function executeProgram(){
	interval = setInterval(step, intervalTime);
}

/*
 * Event handlers
 */
codeArea.addEventListener("keydown", event => {
	if(event.key == "Tab"){
		let caretPosition = codeArea.selectionStart;
		codeArea.value = codeArea.value.substring(0, caretPosition) + "\t" + codeArea.value.substring(caretPosition);
		event.preventDefault();
		codeArea.selectionStart = caretPosition + 1;
		codeArea.selectionEnd = caretPosition + 1;
	}
});

loadButton.addEventListener("click", () => {
	if(!running){
		reset();
		let sourceCode = retrieveAndProcessSourceCode();
		assemble(sourceCode);
		loadRam();
	}
});

runButton.addEventListener("click", () => {
	if(!running){
		executeProgram();
		runnning = true;
	}
});

stepButton.addEventListener("click", () => step());

setRamContainer(100);
codeArea.innerHTML = sampleProgram;