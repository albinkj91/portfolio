let width = innerWidth;
let height = innerHeight - 120;

let canvas = document.createElement("canvas");
canvas.id = "canvas";
canvas.width = width;
canvas.height = height;
document.querySelector("#content").appendChild(canvas);
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

		ctx.fillText("FPS: " + frameCount, 50, 50);
	}

	move(){
		let gravityVector = new Vector(0, this.gravity);
		this.vector.add(gravityVector);

		this.x += this.vector.x * 0.001;
		this.y += this.vector.y * 0.001;

		if(this.y > 714 && Math.abs(this.vector.x) > 0){
			this.vector.x -= this.vector.x * 0.005;
			console.log(this.vector.x);
		}
		console.log(this.x);
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

function update(){
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	balls.forEach(ball => ball.move());
	balls.forEach(ball => ball.checkBounds());
	balls.forEach(ball => ball.draw(ctx));
}

function render(){	
	requestAnimationFrame(render);

	now = performance.now();
	elapsed = now - then;

	if(elapsed > fpsInterval){
		frameCount = Math.floor(1000 / (now - then));
		then = now - (elapsed % fpsInterval);
	}
}

let frameCount = 0;
let fps = 60;
let fpsInterval = 1000 / fps;
let then = performance.now();
let startTime = then;
let now;
let elapsed;


/***************************************************************************************************************************/
/***************************************************************************************************************************/
/***************************************************************************************************************************/


let balls = [];
let heldBall;
let mouseStartX;
let mouseStartY;
let mouseDown = false;

canvas.addEventListener("mousedown", event => {
	if(mouseDown){
		return;
	}

	heldBall = new Ball(event.offsetX, event.offsetY, 50, new Vector(0, 0), 0, "#fca311");
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

requestAnimationFrame(render);
setInterval(update, 1);