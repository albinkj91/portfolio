let width = innerWidth;
let height = innerHeight - 70;
console.log(height);

let canvas = document.createElement("canvas");
canvas.id = "canvas";
canvas.width = width;
canvas.height = height;
let content = document.querySelector("#content");
content.width = width;
content.height = height;
content.appendChild(canvas);
let ctx = canvas.getContext("2d");

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
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		ctx.fill();

		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		ctx.stroke();
	}

	move(){
		let gravityVector = new Vector(0, this.gravity);
		this.vector.add(gravityVector);

		this.x += this.vector.x * 0.001;
		this.y += this.vector.y * 0.001;

		if(this.y > (height - this.radius) && Math.abs(this.vector.x) > 0){
			this.vector.x -= this.vector.x * 0.003;
		}
	}

	checkBounds(){
		if(this.y > (height - this.radius)){
			this.y = height - this.radius;
			this.vector.y = -this.vector.y * 0.8;
		}
		if(this.x > (width - this.radius)){
			this.x = width - this.radius;
			this.vector.x = -this.vector.x * 0.7;
		}
		if(this.x < (0 + this.radius)){
			this.x = 0 + this.radius;
			this.vector.x = -this.vector.x * 0.7;
		}
		if(this.y < (0 + this.radius)){
			this.y = 0 + this.radius;
			this.vector.y = -this.vector.y * 0.9;
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

function render(){	
	balls.forEach(ball => ball.draw(ctx));
	requestAnimationFrame(render);
}

function start(){
	requestAnimationFrame(render);
	setInterval(() => {
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		balls.forEach(ball => ball.move());
	}, 1);
	setInterval(() => balls.forEach(ball => ball.checkBounds()), 1);
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
		start();
		running = true;
	}
	if(mouseDown){
		return;
	}

	heldBall = new Ball(event.offsetX, event.offsetY, parseInt(width * 0.026), new Vector(0, 0), 0, colors[Math.floor(Math.random() * 2)]);
	balls.push(heldBall);
	mouseStartX = event.offsetX;
	mouseStartY = event.offsetY;
	mouseDown = true;
});

canvas.addEventListener("mousemove", event => {
	if(heldBall != null){
		heldBall.x = event.offsetX;
		heldBall.y = event.offsetY;
	}
});

canvas.addEventListener("mouseup", event => {
	if(!mouseDown){
		return;
	}

	heldBall.vector.x = (event.offsetX - mouseStartX) * 30;
	heldBall.vector.y = (event.offsetY - mouseStartY) * 30;
	heldBall.gravity = 9.82 * 5;
	heldBall = null;
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