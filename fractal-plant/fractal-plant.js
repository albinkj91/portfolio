const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

let x = 50;
let y = 750;
let angle = -Math.PI / 3;
const angleSize = -(Math.PI / 7);

ctx.strokeStyle = '#80bb80';

const n = 6;
const r = 5;
const steps = 10;
let axiom = 'X';
const plus = '+';
const minus = '-';
const save = '[';
const restore = ']';
const stack = [];

const applyRules = (string) => {
	let newAxiom = '';
	for(let i = 0; i < string.length; i++){
		switch(string[i]){
			case 'X':
				newAxiom += 'F+[[X]-X]-F[-FX]+X';
				break;
			case 'F':
				newAxiom += 'FF';
				break;
			case plus:
				newAxiom += '+';
				break;
			case minus:
				newAxiom += '-';
				break;
			case save:
				newAxiom += '['
				break;
			case restore:
				newAxiom += ']';
				break;
		}
	}
	axiom = newAxiom;
};

const processAxiom = (string, index) => {
	for(let i = index; i < index + steps; i++){
		switch(string[i]){
			case 'X':
				drawLine();
				break;
			case 'F':
				drawLine();
				break;
			case plus:
				angle += angleSize;
				break;
			case minus:
				angle -= angleSize;
				break;
			case save:
				stack.push({x, y, angle})
				break;
			case restore:
				let state = stack.pop();
				x = state.x;
				y = state.y;
				angle = state.angle;
				break;
			default:
				return;
		}
	}
};

const drawLine = () => {
	ctx.beginPath();
	ctx.moveTo(x, y);

	x += (r * Math.random() * 2) * Math.cos(angle);
	y += r * Math.sin(angle);

	ctx.lineTo(x, y);
	ctx.lineWidth = Math.random() * 2 + 1;
	ctx.stroke();
};

for(let i = 0; i < n; i++){
	applyRules(axiom);
}

console.log(axiom);

let index = 0;

const step = (timestamp) => {
	if(index >= axiom.length){
		return;
	}

	processAxiom(axiom, index, steps);
	index += steps;
	requestAnimationFrame(step);
};

requestAnimationFrame(step);