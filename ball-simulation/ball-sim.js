let width = innerWidth;
let height = innerHeight - 70;

let canvas = document.createElement("canvas");
canvas.id = "canvas";
canvas.width = width;
canvas.height = height;
let content = document.querySelector("#content");
content.width = width;
content.height = height;
content.appendChild(canvas);
let ctx = canvas.getContext("2d");
ctx.lineWidth = 5;

class Vector{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	add(vector){
		this.x += vector.x;
		this.y += vector.y;
	}

	sub(vector){
		this.x -= vector.x;
		this.y -= vector.y;
	}

	calcAngle(){
		return Math.atan(this.y / this.x);
	}

	calcMagnitude(){
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
}

class Ball{
	constructor(x, y, radius, vector, gravity, color){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.vector = vector;
		this.gravity = gravity;
		this.color = color;
	}

	draw(ctx){
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		ctx.stroke();
	}

	move(){
		let gravityVector = new Vector(0, this.gravity);
		this.vector.add(gravityVector);

		this.x += parseInt(this.vector.x * 0.003);
		this.y += parseInt(this.vector.y * 0.003);

		if(this.y > (height - this.radius) && Math.abs(this.vector.x) > 0){
			this.vector.x -= parseInt(this.vector.x * 0.003);
		}
	}

	hasStopped(){
		if(this.vector.x == 0 && this.vector.y == 0){
			return true;
		}
		return false;
	}

	checkBounds(){
		if(this.y > (height - this.radius)){
			this.y = height - this.radius;
			this.vector.y = parseInt(-this.vector.y * 0.8);
		}
		if(this.x > (width - this.radius)){
			this.x = width - this.radius;
			this.vector.x = parseInt(-this.vector.x * 0.7);
		}
		if(this.x < (0 + this.radius)){
			this.x = 0 + this.radius;
			this.vector.x = parseInt(-this.vector.x * 0.7);
		}
		if(this.y < (0 + this.radius)){
			this.y = 0 + this.radius;
			this.vector.y = parseInt(-this.vector.y * 0.9);
		}
	}

	calcDistanceToCollidedBall(ball){
		let dx = ball.x - this.x;
		let dy = ball.y - this.y;

		return Math.sqrt(dx * dx + dy * dy);
	}

	calcAngleToCollidedBall(ball){
		let dx = ball.x - this.x;
		let dy = ball.y - this.y;

		return Math.atan(dy / dx);
	}
}

let start;
let framesPerSecond = 0;
let frameStart;

function step(timestamp){	
	if(start == undefined){
		start = timestamp;
	}
	if(frameStart == undefined){
		frameStart = timestamp;
	}
	const elapsed = timestamp - start;
	if(elapsed > 1000 / 200){
		start = undefined;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		balls.forEach(ball => {
			ball.move();
			ball.checkBounds();
			ball.draw(ctx);
			if(ball.hasStopped()){
				console.log('stopped');
			}
			console.log(ball.vector.x);
			console.log(ball.vector.y);
		});
		requestAnimationFrame(step, timestamp);
		framesPerSecond++;
	}

	const elapsedFrameTime = timestamp - frameStart;
	if(elapsedFrameTime > 1000){
		console.log(framesPerSecond);
		framesPerSecond = 0;
		frameStart = timestamp;
	}
	requestAnimationFrame(step);
}


/***************************************************************************************************************************/
/***************************************************************************************************************************/
/***************************************************************************************************************************/


let balls = [];
let heldBall;
let mouseStartX;
let mouseStartY;
let mouseDown = false;
let running = false;
const colors = ["#fca311", "#14213D"];

canvas.addEventListener("mousedown", event => {
	if(!running){
		requestAnimationFrame(step);
		running = true;
	}
	if(mouseDown){
		return;
	}

	heldBall = new Ball(event.offsetX, event.offsetY, parseInt(width * 0.026), new Vector(1, 1), 0, colors[Math.floor(Math.random() * 2)]);
	balls.push(heldBall);
	mouseStartX = event.offsetX;
	mouseStartY = event.offsetY;
	mouseDown = true;
});

canvas.addEventListener("mousemove", event => {
	if(heldBall != undefined){
		heldBall.x = event.offsetX;
		heldBall.y = event.offsetY;
	}
});

canvas.addEventListener("mouseup", event => {
	if(!mouseDown){
		return;
	}

	heldBall.vector.x = (event.offsetX - mouseStartX) * 20;
	heldBall.vector.y = (event.offsetY - mouseStartY) * 20;
	heldBall.gravity = 9.82 * 5;
	heldBall = undefined;
	mouseDown = false;
});

onresize = () => {
	ctx.clearRect(0, 0, width, height);
	width = innerWidth;
	height = innerHeight - 70;
	content.width = width;
	content.height = height;
	canvas.width = width;
	canvas.height = height;

	if(!running){
		ctx.font = (width * 0.015625 + 5) + "px Helvetica";
		ctx.textAlign = "center";
		ctx.fillText("Click, drag and release to toss a ball", width / 2, height / 2.5);
	}
}

ctx.font = (width * 0.015625 + 5) + "px Helvetica";
ctx.textAlign = "center";
ctx.fillText("Click, drag and release to toss a ball", width / 2, height / 2.5);