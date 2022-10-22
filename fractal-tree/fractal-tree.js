let width = innerWidth - 300;
let height = innerHeight - 70;

const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
canvas.id = "canvas";
const ctx = canvas.getContext("2d");
const content = document.querySelector("#content");
content.width = width;
content.height = height;
content.appendChild(canvas);
ctx.strokeStyle = "#14213D";

const angleLabel = document.querySelector("#angleLabel");
const angleInput = document.querySelector("#angle");
const lengthLabel = document.querySelector("#lengthLabel");
const lengthInput = document.querySelector("#length");
const run = document.querySelector("#run");

ctx.lineWidth = 1;

let currentX = width / 2.0;
let currentY = height / 1.3;
let startLength = Math.round(height / 8);
let angle = 3*Math.PI/2;
let currentAngle = 0;
let interval;
let running = false;

lengthLabel.innerHTML = "Length: " + startLength;
angleLabel.innerHTML = currentAngle + "\u00B0";
lengthInput.value = startLength;

ctx.beginPath();
fractalTree(angle, currentX, currentY, startLength);
ctx.stroke();

function fractalTree(newAngle, x, y, newLength){
	let newX = x + newLength * Math.cos(newAngle);
	let newY = y + newLength * Math.sin(newAngle);
	ctx.moveTo(x, y);
	ctx.lineTo(newX, newY);
	
	if(newLength < 15){
		return;
	}else{
		let angle1 = newAngle + currentAngle;
		let angle2 = newAngle - currentAngle;
		let length = newLength /= 1.2;
		fractalTree(angle1, newX, newY, length);
		fractalTree(angle2, newX, newY, length);
	}
}

let elapsed, initial;
let animationId;
let stepSize = Math.PI / 700;

function updateAngle(timestamp){
	if(initial === undefined){
		initial = timestamp;
	}
	elapsed = timestamp - initial;

	if(running && elapsed > 1000 / 60){
		elapsed = 0;
		initial = timestamp;

		if(currentAngle > 2 * Math.PI){
			currentAngle = 0;
		}

		currentAngle += stepSize;
		
		ctx.clearRect(0, 0, width, height)
		ctx.beginPath();
		fractalTree(angle, currentX, currentY, startLength);
		ctx.stroke();
	}
	requestAnimationFrame(updateAngle);
}

angleInput.oninput = () => {
	ctx.clearRect(0, 0, width, height)
	currentAngle = parseInt(angleInput.value) * Math.PI / 180;
	angleLabel.innerHTML = Math.round(currentAngle * 180 / Math.PI) + "\u00B0";
	ctx.beginPath();
	fractalTree(angle, currentX, currentY, startLength);
	ctx.stroke();
}

lengthInput.oninput = () => {
	ctx.clearRect(0, 0, width, height)
	startLength = parseInt(lengthInput.value);
	lengthLabel.innerHTML = "Length: " + startLength;
	ctx.beginPath();
	fractalTree(angle, currentX, currentY, startLength);
	ctx.stroke();
}

run.onclick = () => {
	if(!running){
		start();
		running = true;
	}else{
		stop();
	}
}

onresize = () => {
	ctx.clearRect(0, 0, width, height);
	width = innerWidth - 300;
	height = innerHeight - 70;
	content.width = width;
	content.height = height;
	canvas.width = width;
	canvas.height = height;
	currentX = width / 2.0;
	currentY = height / 1.3;
	startLength = Math.round(height / 8);
	ctx.strokeStyle = "#14213D";
	ctx.beginPath();
	fractalTree(angle, currentX, currentY, startLength);
	ctx.stroke();
}

function start(){
	requestAnimationFrame(updateAngle);
	run.innerHTML = "Stop";
	run.id = "stop";
};

function stop(){
	cancelAnimationFrame(animationId)
	run.innerHTML = "Run";
	run.id = "run";
	running = false;
}