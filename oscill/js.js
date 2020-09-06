let ctxSph = document.querySelector('#spherical').getContext('2d');
let ctxOsc = document.querySelector('#oscillo').getContext('2d');
let currentY = 0;
let currentX = 0;
let timer = 0;
let zoom = 0.05;
let ampl = 1;
let speed = 0.1;
let sphTail = 1000;
let sphDetail = 1;
let log = 1.1;
let freqes = [[], [], []] // freq_index, amples, freq_log

function draw() {
	drawSph();
	drawOsc();
	timer+=speed;
} let timerId = setInterval(draw, 10);

function addOsc() {
	freqes[0].push(0);
	freqes[1].push(1);
	document.querySelector('#inputHz').innerHTML = '';
	for (let i=0; i<freqes[0].length; i++) {
		document.querySelector('#inputHz').innerHTML += 
		`<div class="oscInputs" id="osc_${i}">
			<input value="${freqes[0][i]}" class="oscHz" type="range" step="0.01" min="0" max="1000" oninput="freqes[0][${i}]=eval(this.value); freqes[2][${i^log}]; this.nextSibling.nextSibling.firstChild.value=this.value">
			[<form onsubmit="this.parentNode.querySelector('input').value=eval(this.firstChild.value); freqes[0][${i}]=eval(this.firstChild.value); return false;"><input value="${freqes[0][i]}" type="text" size="10"></form>]
			<input value="${freqes[1][i]}" class="oscVol" type="range" step="0.01" min="0" max="2" oninput="freqes[1][${i}]=Number(this.value);">
			<button onclick="delOsc(${i})">✖</button>
		</div>`;
	}
} addOsc()

function delOsc(id) {
	freqes[0].splice(id, 1);
	freqes[1].splice(id, 1);
	document.querySelector(`#osc_${id}`).remove();
}

ctxOsc.lineWidth = 1;
ctxSph.lineWidth = 1;
ctxOsc.strokeStyle = '#fff';
ctxSph.strokeStyle = '#fff';
ctxOsc.fillStyle = '#000';
ctxSph.fillStyle = '#000';

function drawSph() {
	ctxSph.fillRect(0, 0, ctxSph.canvas.width, ctxSph.canvas.height);

	for (let x=0; x<=sphTail; x=x+(sphDetail)) {
		currentY = 0;
		currentX = 0;
		for (let i=0; i<freqes[0].length; i++) {
			let temp = (freqes[0][i]/ctxSph.canvas.height * (x*zoom+timer));
			currentY += Math.sin(temp)*freqes[2][i];
			currentX += Math.cos(temp)*freqes[2][i];
		}
		currentX = currentX*ampl;
		currentY = currentY*ampl;
		ctxSph.lineTo(ctxSph.canvas.width/2+ctxSph.canvas.width/4*currentX, ctxSph.canvas.height/2+ctxSph.canvas.height/4*currentY);
	}

	ctxSph.stroke();
	ctxSph.beginPath();
	currentY = 0;
	currentX = 0;
}

function drawOsc() {
	ctxOsc.fillRect(0, 0, ctxOsc.canvas.width, ctxOsc.canvas.height);

	for (let x=0; x<=ctxOsc.canvas.width; x++) {
		currentY = 0;
		for (let i=0; i<freqes[0].length; i++) {
			currentY += (Math.sin(freqes[0][i]/ctxOsc.canvas.width * (x*zoom+timer)) * freqes[2][i]);
		}
		currentY = currentY*ampl;
		ctxOsc.lineTo(x, ctxOsc.canvas.height/2 + ctxOsc.canvas.height/4 * (currentY));
	}
	ctxOsc.stroke();
	ctxOsc.beginPath();
	currentY = 0;
}

draw();

document.querySelector('#rr_ampl').value = 1;
document.querySelector('#rr_zoom').value = 0.95;
document.querySelector('#rr_speed').value = 0.1;
document.querySelector('#rr_detail').value = 2;
document.querySelector('#rr_tail').value = 1000;

function playTone(freq, gain) {
    let context = new AudioContext();
    let volume = context.createGain();
    volume.connect(context.destination);
    volume.gain.value = gain;
    osc = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(volume);
    osc.start();
    console.log('Playing at frequency ' + freq + ' with volume ' + gain);
	osc.stop(context.currentTime + 3)
}

function playTones() {
	for (let i=0; i<freqes[0].length; i++) {
		playTone(freqes[0][i], freqes[2][i]*ampl);
	}
}
