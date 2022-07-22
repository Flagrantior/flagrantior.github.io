let ctxLis = document.querySelector('#lissajous').getContext('2d');
let ctxOsc = document.querySelector('#oscillo').getContext('2d');
let currentY = 0; let currentX = 0;
let timer = 0;
let zoom = 0.3;
let ampl = 0.5;
let speed = 0.1;
let sphTail = 1000;
let sphDetail = 1;
let offLis = 0;

function draw() {
	drawLis();
	drawOsc();
	timer+=speed;
} let timerId = setInterval(draw, 10);

let ctx = new (window.AudioContext || window.webkitAudioContext)();
let oscs = [];
let gains = [];
let osc_on = false;

function addOsc() {
	let osc = ctx.createOscillator();
	let gain = ctx.createGain();
	osc.frequency.value = 55;
	gain.gain.value = 1;
	osc.connect(gain).connect(ctx.destination);
	osc.type = 'sine';
	oscs.push(osc);
	gains.push(gain);
	osc.start();
	osc.disconnect();
	document.querySelector('#inputHz').innerHTML = '';
	for (let i=0; i<oscs.length; i++) {
		document.querySelector('#inputHz').innerHTML +=
		`<div class="oscInputs" id="osc_${i}">
			<input value="${oscs[i].frequency.value}" class="oscHz" type="range" step="0.01" min="0.01" max="1000" oninput="oscs[${i}].frequency.value=eval(this.value); this.nextSibling.nextSibling.firstChild.value=this.value">
			[<form onsubmit="this.parentNode.querySelector('input').value=eval(this.firstChild.value); oscs[${i}].frequency.value=eval(this.firstChild.value); return false;"><input value="${oscs[i].frequency.value}" type="text" size="5"></form>]
			<input value="${gains[i].gain.value}" class="oscVol" type="range" step="0.01" min="0" max="2" oninput="gains[${i}].gain.value=Number(this.value);">
			<button onclick="delOsc(${i})">X</button>
		</div>`;
	}

	playTones(); playTones();
} addOsc()

document.querySelector('.oscHz').value = 55;
document.querySelector('#osc_0 form input').value = 55;

function delOsc(id) {
	gains[id].disconnect();
	oscs[id].disconnect();
	oscs.splice(id, 1);
	gains.splice(id, 1);
	document.querySelector(`#osc_${id}`).remove();
}

ctxLis.lineWidth = 1; ctxOsc.lineWidth = 1;
ctxLis.strokeStyle = '#fff'; ctxOsc.strokeStyle = '#fff';
ctxLis.fillStyle = '#000'; ctxOsc.fillStyle = '#000';

function drawLis() {
	ctxLis.fillRect(0, 0, ctxLis.canvas.width, ctxLis.canvas.height);

	for (let x=0; x<=sphTail; x=x+(sphDetail)) {
		currentY = 0;
		currentX = 0;
		for (let i=0; i<oscs.length; i++) {
			currentY += Math.sin(oscs[i].frequency.value/ctxLis.canvas.height * (x*zoom+timer))*gains[i].gain.value;
			currentX += Math.cos(oscs[i].frequency.value/ctxLis.canvas.height * (x*zoom+timer+offLis))*gains[i].gain.value;
		}
		currentX = currentX*ampl;
		currentY = currentY*ampl;
		ctxLis.lineTo(ctxLis.canvas.width/2+ctxLis.canvas.width/4*currentX, ctxLis.canvas.height/2+ctxLis.canvas.height/4*currentY);
	}

	ctxLis.stroke();
	ctxLis.beginPath();
	currentY = 0;
	currentX = 0;
}

function drawOsc() {
	ctxOsc.fillRect(0, 0, ctxOsc.canvas.width, ctxOsc.canvas.height);

	for (let x=0; x<=ctxOsc.canvas.width; x++) {
		currentY = 0;
		for (let i=0; i<oscs.length; i++) {
			currentY += (Math.sin(oscs[i].frequency.value/ctxOsc.canvas.width * (x*zoom+timer)) * gains[i].gain.value);
		}
		currentY = currentY*ampl;
		ctxOsc.lineTo(x, ctxOsc.canvas.height/2 + ctxOsc.canvas.height/4 * (currentY));
	}
	ctxOsc.stroke();
	ctxOsc.beginPath();
	currentY = 0;
}

draw();

document.querySelector('#rr_ampl').value = 0.5;
document.querySelector('#rr_zoom').value = 0.95;
document.querySelector('#rr_speed').value = 0.1;
document.querySelector('#rr_detail').value = 2;
document.querySelector('#rr_tail').value = 1000;
document.querySelector('#rr_offLis').value = 0;

function playTones() {
	osc_on? oscs.map(osc => osc.disconnect()) : oscs.map((osc,i) => osc.connect(gains[i]).connect(ctx.destination));
	osc_on = !osc_on;
}
