class Node{
	constructor(x, y, angle, size){
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.size = size;
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

let canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d");
ctx.lineWidth = 0.3;
let nodes = [];

for(let i = 0; i < 50; i++){
	let x = Math.random() * canvas.width;
	let y = Math.random() * canvas.height;
	let angle = Math.random() * 360 * Math.PI / 180;
	let nodeSize = (Math.random() * 1.1) + 0.4;
	nodes[i] = new Node(x, y, angle, nodeSize);
}

function checkCloseNodesAndDraw(){
	ctx.clearRect(0, 0, 1910, 1100);

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
	requestAnimationFrame(checkCloseNodesAndDraw);
}

requestAnimationFrame(checkCloseNodesAndDraw);