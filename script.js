let width = innerWidth;
let height = innerHeight / 2;

const canvas = document.createElement("canvas");
canvas.id = "canvas";
canvas.width = width;
canvas.height = height;
const content = document.querySelector("#content");
content.appendChild(canvas);
const ctx = canvas.getContext("2d");

class Node{
	constructor(x, y, angle){
		this.x = x;
		this.y = y;
		this.angle = angle;
	}

	move(){
		if(Math.random() < 0.5){
			this.angle += 3 * Math.PI / 180;
		}else{
			this.angle -= 3 * Math.PI / 180;
		}
		this.x += 0.5 * Math.cos(this.angle);
		this.y += 0.5 * Math.sin(this.angle);

		if(this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0){
			this.x = Math.random() * canvas.width;
			this.y = 1;
			this.angle = 90 * Math.PI / 180;
		}
	}
}

ctx.lineWidth = 0.3;
let nodes = [];
let ratio = 47.51
let numberOfNodes = (height + width) / ratio;

onresize = () => {
	width = innerWidth;
	height = innerHeight / 2;
	canvas.width = width;
	canvas.height = height;
	numberOfNodes = (width + height) / ratio;
	setNodes();
	ctx.lineWidth = 0.3;
}

function setNodes(){
	nodes = [];
	for(let i = 0; i < numberOfNodes; i++){
		let x = Math.random() * canvas.width;
		let y = Math.random() * canvas.height;
		let angle = Math.random() * 360 * Math.PI / 180;
		nodes[i] = new Node(x, y, angle);
	}
}
let frames = 0;
let start;
let prev = 0;

function checkCloseNodesAndDraw(timestamp){
	if(start == undefined){
		start = timestamp;
	}
	const elapsed = timestamp - start;
	if(elapsed > 1000 / 60){
		ctx.clearRect(0, 0, width, height);
		for(let i = 0; i < nodes.length; i++){
			nodes[i].move();
			for (let j = 0; j < nodes.length; j++) {
				let deltaX = Math.abs(nodes[i].x - nodes[j].x);
				let deltaY = Math.abs(nodes[i].y - nodes[j].y);

				let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
				ctx.strokeStyle = "rgba(0, 0, 0," + (1 - distance / 300) + ")";
				ctx.beginPath();
				ctx.moveTo(nodes[i].x, nodes[i].y);
				ctx.lineTo(nodes[j].x, nodes[j].y);
				ctx.stroke();
			}
		}
		start = undefined;
		console.log('now');
		requestAnimationFrame(checkCloseNodesAndDraw, timestamp);
	}
	requestAnimationFrame(checkCloseNodesAndDraw);
}

setNodes();
requestAnimationFrame(checkCloseNodesAndDraw);