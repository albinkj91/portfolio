let width = innerWidth - 300;
let height = innerHeight - 120;

let canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
canvas.id = "canvas";
let ctx = canvas.getContext("2d");
document.querySelector("#content").appendChild(canvas);
ctx.strokeStyle = "#fca311";

ctx.lineWidth = 1;

let currentX = width / 2.0;
let currentY = height / 1.3;
let startRadius = height / 8;
let angle = toRadians(270);
let degrees = 0;
let interval;
let running = false;

ctx.beginPath();
fractalTree(angle, currentX, currentY, startRadius);
ctx.stroke();

function fractalTree(newAngle, x, y, newRadius){

	let newX = x + newRadius * Math.cos(newAngle);
	let newY = y + newRadius * Math.sin(newAngle);
	ctx.moveTo(x, y);
	ctx.lineTo(newX, newY);
	
	if(newRadius < 15){
		return;
	}else{
		let angle1 = newAngle + toRadians(degrees);
		let angle2 = newAngle - toRadians(degrees);
		let radius = newRadius /= 1.2;
		fractalTree(angle1, newX, newY, radius);
		fractalTree(angle2, newX, newY, radius);
	}
}

function start(){
	if(!running){
		interval = setInterval(increaseDegree, 10);
		running = true;
	}
}

function stop(){
	clearInterval(interval);
	running = false;
}

function increaseDegree(){
	ctx.clearRect(0, 0, width, height);
	degrees += 0.05;
	ctx.beginPath();
	fractalTree(angle, currentX, currentY, startRadius);
	ctx.stroke();
}



function toRadians(number){
	return number * (Math.PI / 180);
}