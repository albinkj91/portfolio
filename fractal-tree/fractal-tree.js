let width = innerWidth - 300;
let height = innerHeight - 70;

let canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
canvas.id = "canvas";
let ctx = canvas.getContext("2d");
let content = document.querySelector("#content");
content.width = width;
content.height = height;
content.appendChild(canvas);
ctx.strokeStyle = "#14213D";

let angleLabel = document.querySelector("#angleLabel");
let angleInput = document.querySelector("#angle");
let lengthLabel = document.querySelector("#lengthLabel");
let lengthInput = document.querySelector("#length");
let run = document.querySelector("#run");

ctx.lineWidth = 1;

let currentX = width / 2.0;
let currentY = height / 1.3;
let startLength = Math.round(height / 8);
let angle = toRadians(270);
let degrees = 0;
let interval;
let running = false;
let expanding = true;

lengthLabel.innerHTML = "Length: " + startLength;
angleLabel.innerHTML = degrees + "\u00B0";
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
		let angle1 = newAngle + toRadians(degrees);
		let angle2 = newAngle - toRadians(degrees);
		let length = newLength /= 1.2;
		fractalTree(angle1, newX, newY, length);
		fractalTree(angle2, newX, newY, length);
	}
}

function updateAngle(){
	ctx.clearRect(0, 0, width, height)
	if(degrees < 180 && expanding){
		degrees += 0.05;
	}else{
		expanding = false;
	}
	if(degrees > -180 && !expanding){
		degrees -= 0.05;
	}else{
		expanding = true;
	}
	
	ctx.beginPath();
	fractalTree(angle, currentX, currentY, startLength);
	ctx.stroke();
}

function toRadians(value){
	return value * (Math.PI / 180);
}

angleInput.oninput = () => {
	ctx.clearRect(0, 0, width, height)
	degrees = parseInt(angleInput.value);
	angleLabel.innerHTML = degrees + "\u00B0";
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
	interval = setInterval(updateAngle, 10);
	run.innerHTML = "Stop";
	run.id = "stop";
};

function stop(){
	clearInterval(interval);
	run.innerHTML = "Run";
	run.id = "run";
	running = false;
}