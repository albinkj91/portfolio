let width = innerWidth;
let height = innerHeight - 120;

let canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
canvas.id = "canvas";
let ctx = canvas.getContext("2d");
document.querySelector("#content").appendChild(canvas);
ctx.strokeStyle = "#14213D";

ctx.lineWidth = 1;

let currentX = width / 2.0;
let currentY = height / 1.3;
let startRadius = height / 8;
let angle = toRadians(270);
let degrees = 0;
let interval;
let running = false;
let expanding = true;

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

function increaseDegree(){
	ctx.clearRect(0, 0, width, height)
	if(degrees < 30 && expanding){
		degrees += 0.05;
	}else{
		expanding = false;
	}
	if(degrees > -30 && !expanding){
		degrees -= 0.05;
	}else{
		expanding = true;
	}
	
	ctx.beginPath();
	fractalTree(angle, currentX, currentY, startRadius);
	ctx.stroke();
}

function toRadians(number){
	return number * (Math.PI / 180);
}

setInterval(increaseDegree, 10);