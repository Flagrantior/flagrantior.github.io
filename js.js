// autor: Gaan Valentin : flagrantior@gmail.com
// 'use strict';
const notes = [
	['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
	['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'],
	['D', 'Rb', 'R', 'Mb', 'M', 'F', 'Sb', 'S', 'Lb', 'L', 'Tb', 'T'],
];
let scale = '000000000000';
let zeroes = [4, 11, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10];
let frets = 24; let strings = 6;
let root = 0; // C
let notedisp = 0; // 0-letter, 1-step, 3-none.
const conso = [100, 9.3, 9.8, 18.5, 23.4, 30.6, 6.7, 45.2, 15.4, 29.6, 15.1, 7.8]; // octa = 89.1
let lang = 'eng'; // rus/eng
let colors = {
	focus: '#F00',
	fg: '#FFF',
	bg: '#000'
}

let preloader = document.querySelector('#preloader_preload');
function fadePreloader(el) {
	el.style.opacity = 1;
    var interpreloader = setInterval(function(){el.style.opacity = el.style.opacity - 0.05;
        if (el.style.opacity<=0.05){
        	clearInterval(interpreloader);
        	preloader.style.display = "none";
    }}, 16);
}
window.onload = function(){setTimeout(function(){fadePreloader(preloader);
    }, 1000);
};

function toBool(x) {
	x = x.split('');
	for (i=0; i<x.length; i++) {
		x[i] = (x[i]=='1')? true : false;
	}
	return x;
}
toBool(scale);

function drawFrets() {
	let infrets = document.querySelector('#Frets');
	infrets.innerHTML = '<line x1="3.7%" y1="8%" x2="3.7%" y2="92%" stroke-width="1px" stroke="'+colors.fg+'"></line>';
	for (let i=0; i<=frets; i++) {
		infrets.innerHTML += '<line x1="'+(6.3*i-(i*i*0.1)+4)+'%" y1="10%" x2="'+(6.3*i-(i*i*0.1)+4)+'%" y2="90%" stroke-width="1px" stroke="'+colors.fg+'"></line>';
	}
}
drawFrets();

function drawString() {
	let instrings = document.querySelector('#Strings');
	instrings.innerHTML = '';
	for (let i=0; i<strings; i++) {
		instrings.innerHTML += '<g id="str_'+i+'"><circle r="3px" cx="3%" cy="'+(100/(strings+1)*(i+1))+'%" fill="white"/><line x1="3%" y1="'+(100/(strings+1)*(i+1))+'%" x2="98.1%" y2="'+(100/(strings+1)*(i+1))+'%" stroke-width="'+(i*0.5+0.5)+'px" stroke="white"></line></g>'
	}
}
drawString();

function drawGNotes() {
	let ingnotes = document.querySelector('#gnotes');
	ingnotes.innerHTML = '';
	for (let i=0; i<strings; i++) {
		ingnotes.innerHTML +=
		'<g class="'+(notes[0][(zeroes[i])%12])+'" opacity="0">\
	 		<circle r="9" onclick="singlerescale(\''+(notes[0][(zeroes[i])%12])+'\')" cx="2.5%" cy="'+(100/(strings+1)*(i+1))+'%" fill="white" onmouseover="hightlight(\''+(notes[0][(zeroes[i])%12])+'\')" onmouseleave="hoverTimer()"/>\
			<text text-anchor="middle" x="2.5%" y="'+(100/(strings+1)*(i+1)+2.5)+'%" fill="black">'+(notes[0][(zeroes[i])%12])+'</text>\
		</g>';
		for (let j=0; j<frets; j++) {
			ingnotes.innerHTML +=
			'<g class="'+(notes[0][(zeroes[i]+j+1)%12])+'" opacity="0">\
	 			<circle r="9" onclick="singlerescale(\''+(notes[0][(zeroes[i]+j+1)%12])+'\')" cx="'+(6.205*j-(j*j*0.1)+7)+'%" cy="'+(100/(strings+1)*(i+1))+'%" fill="white" onmouseover="hightlight(\''+(notes[0][(zeroes[i]+j+1)%12])+'\')" onmouseleave="hoverTimer()"/>\
				<text text-anchor="middle" x="'+(6.205*j-(j*j*0.1)+7)+'%" y="'+(100/(strings+1)*(i+1)+2.5)+'%" fill="black">'+(notes[0][(zeroes[i]+j+1)%12])+'</text>\
			</g>'
		}
	}
}

let chords = [
	[[''		],[4, 7]],
	[['m'		],[3, 7]],
	[['7'		],[4, 7, 10]],
	[['maj7'	],[4, 7, 11]],
	[['m7'		],[3, 7, 10]],
	[['5'		],[7]],
	[['4'		],[5]],
	[['sus2'	],[2, 7]],
	[['sus4'	],[5, 7]],
	[['6'		],[4, 7, 9]],
	[['aug'		],[4, 8]],
	[['dim'		],[3, 6]],
];

let chordsconso = [];
for (i=0; i<chords.length; i++) {
	let tempconso = [1, 100];
	for (j=0; j<chords[i][1].length; j++) {
		tempconso[0]++;
		tempconso[1] += conso[chords[i][1][j]];
	}
	chordsconso.push((100/2)+((tempconso[1]/tempconso[0])-100/2)*2);
}

function chordsStartDraw() {
	document.querySelector('#Chords').innerHTML += '<div id="typetable"><div></div></div>';
	for (chr_type of chords) document.querySelector('#typetable').innerHTML += '<div onmouseover="chordTypesHightlight(this.innerText)" onmouseleave="chordTypesDehightlight(this.innerText)">'+chr_type[0]+'</div>';
	for (chr_prime of notes[0]) {
		document.querySelector('#chords').innerHTML += '<div id="prime_'+chr_prime+'"></div>';
		document.querySelector('#prime_'+chr_prime).innerHTML += '<div class="chordwrap"><div class="prime_0" onmouseleave="hoverTimer()" onmouseover="hightlight(\''+chr_prime+'\')"><sup class="chordsstep"></sup><div class="chordsprimes">'+chr_prime+'</div></div></div>';
		let i = 0;
		for (chr_type of chords) {i++; document.querySelector('#prime_'+chr_prime).innerHTML += `<div class="chordwrap"><div class="chr_${chr_type[0]}" onmouseover="this.style.color='rgb(${[255/100*chordsconso[i-1],255/100*chordsconso[i-1],255/100*chordsconso[i-1]]})'; chordHightlight(${notes[0].indexOf(chr_prime)}, [${chr_type[1]}])" onmouseleave="this.style.color='inherit'; chordDehighlight()">${chr_prime+chr_type[0]}</div></div>`};
	}
	document.querySelectorAll('#Chords > div > div')[1].innerText= 'M';
}
chordsStartDraw();

function retune(starttune=false) {
	let input = (starttune!==false && localStorage.getItem('tune')!=null)? localStorage.getItem('tune') : document.querySelector('#tune > form > input').value;
	let newtune = [];
	for (sign of input) {
		for (checknote of notes[0]) {
			if (sign==='b') {newtune[newtune.length-1] = notes[0][(notes[0].indexOf(newtune[newtune.length-1])-1)%12]; break}
			if (sign==='#') {newtune[newtune.length-1] = notes[0][(notes[0].indexOf(newtune[newtune.length-1])+1)%12]; break}
			if (sign.toUpperCase()===checknote[0]) {newtune.push(sign.toUpperCase()); break}
		}
	}
	newtune.reverse();
	strings = (newtune.length<12)? newtune.length : 12;
	for (i=0; i<strings; i++) {
		zeroes[i]=notes[0].indexOf(newtune[i]);
	}
	if (starttune===false) localStorage.setItem('tune', document.querySelector('#tune > form > input').value);
	drawString();
	drawGNotes();
	reroot(root);
}

function showChords() {
	for (i=0; i<12; i++) {
		if (scale[(i)%12]) {
			document.querySelector('#prime_'+notes[0][(i+root)%12]).style.display = 'flex';
			document.querySelector('#prime_'+notes[0][(i+root)%12]).style.order = i;
			document.querySelector('#prime_'+notes[0][(i+root)%12]+' .chordsstep').innerHTML = notes[1][i];
			for (i_chr of chords) {
				let exist = true;
				for (i_stp of i_chr[1]) {
					if (!scale[(i+i_stp)%12]) {
						exist = false;
						break;
					}
				}
				document.querySelector('#prime_'+notes[0][(i+root)%12]+' .chr_'+i_chr[0][0]).style.display = (exist)? 'block' : 'none';
			}
		} else document.querySelector('#prime_'+notes[0][(i+root)%12]).style.display = 'none';
	}
}

let piano = document.querySelector('#Piano > svg');
let pOffColor = '#131313'

piano.innerHTML=`
<rect id="pianokeyL_C"  onclick="singlerescale('C')"  onmouseover="hightlight('C')"  onmouseleave="hoverTimer('C')  "fill="${pOffColor}"  x="${100/15*1-3.3}%"      y="0" rx="5px" width="6.6%" height="100%" stroke="#000" stroke-width="0.3%"/>
<rect id="pianokeyL_D"  onclick="singlerescale('D')"  onmouseover="hightlight('D')"  onmouseleave="hoverTimer('D')  "fill="${pOffColor}"  x="${100/15*2-3.3}%"      y="0" rx="5px" width="6.6%" height="100%" stroke="#000" stroke-width="0.3%"/>
<rect id="pianokeyL_E"  onclick="singlerescale('E')"  onmouseover="hightlight('E')"  onmouseleave="hoverTimer('E')  "fill="${pOffColor}"  x="${100/15*3-3.3}%"      y="0" rx="5px" width="6.6%" height="100%" stroke="#000" stroke-width="0.3%"/>
<rect id="pianokeyL_F"  onclick="singlerescale('F')"  onmouseover="hightlight('F')"  onmouseleave="hoverTimer('F')  "fill="${pOffColor}"  x="${100/15*4-3.3}%"      y="0" rx="5px" width="6.6%" height="100%" stroke="#000" stroke-width="0.3%"/>
<rect id="pianokeyL_G"  onclick="singlerescale('G')"  onmouseover="hightlight('G')"  onmouseleave="hoverTimer('G')  "fill="${pOffColor}"  x="${100/15*5-3.3}%"      y="0" rx="5px" width="6.6%" height="100%" stroke="#000" stroke-width="0.3%"/>
<rect id="pianokeyL_A"  onclick="singlerescale('A')"  onmouseover="hightlight('A')"  onmouseleave="hoverTimer('A')  "fill="${pOffColor}"  x="${100/15*6-3.3}%"      y="0" rx="5px" width="6.6%" height="100%" stroke="#000" stroke-width="0.3%"/>
<rect id="pianokeyL_B"  onclick="singlerescale('B')"  onmouseover="hightlight('B')"  onmouseleave="hoverTimer('B')  "fill="${pOffColor}"  x="${100/15*7-3.3}%"      y="0" rx="5px" width="6.6%" height="100%" stroke="#000" stroke-width="0.3%"/>
<rect id="pianokeyR_C"  onclick="singlerescale('C')"  onmouseover="hightlight('C')"  onmouseleave="hoverTimer('C')  "fill="${pOffColor}"  x="${100/15*8-3.3}%"      y="0" rx="5px" width="6.6%" height="100%" stroke="#000" stroke-width="0.3%"/>
<rect id="pianokeyR_D"  onclick="singlerescale('D')"  onmouseover="hightlight('D')"  onmouseleave="hoverTimer('D')  "fill="${pOffColor}"  x="${100/15*9-3.3}%"      y="0" rx="5px" width="6.6%" height="100%" stroke="#000" stroke-width="0.3%"/>
<rect id="pianokeyR_E"  onclick="singlerescale('E')"  onmouseover="hightlight('E')"  onmouseleave="hoverTimer('E')  "fill="${pOffColor}"  x="${100/15*10-3.3}%"     y="0" rx="5px" width="6.6%" height="100%" stroke="#000" stroke-width="0.3%"/>
<rect id="pianokeyR_F"  onclick="singlerescale('F')"  onmouseover="hightlight('F')"  onmouseleave="hoverTimer('F')  "fill="${pOffColor}"  x="${100/15*11-3.3}%"     y="0" rx="5px" width="6.6%" height="100%" stroke="#000" stroke-width="0.3%"/>
<rect id="pianokeyR_G"  onclick="singlerescale('G')"  onmouseover="hightlight('G')"  onmouseleave="hoverTimer('G')  "fill="${pOffColor}"  x="${100/15*12-3.3}%"     y="0" rx="5px" width="6.6%" height="100%" stroke="#000" stroke-width="0.3%"/>
<rect id="pianokeyR_A"  onclick="singlerescale('A')"  onmouseover="hightlight('A')"  onmouseleave="hoverTimer('A')  "fill="${pOffColor}"  x="${100/15*13-3.3}%"     y="0" rx="5px" width="6.6%" height="100%" stroke="#000" stroke-width="0.3%"/>
<rect id="pianokeyR_B"  onclick="singlerescale('B')"  onmouseover="hightlight('B')"  onmouseleave="hoverTimer('B')  "fill="${pOffColor}"  x="${100/15*14-3.3}%"     y="0" rx="5px" width="6.6%" height="100%" stroke="#000" stroke-width="0.3%"/>
<rect id="pianokeyL_Db" onclick="singlerescale('Db')" onmouseover="hightlight('Db')" onmouseleave="hoverTimer('Db') "fill="${pOffColor}"  x="${100/15*1 +1.6-0.3}%" y="0" rx="1px" width="3.5%" height="60%"  stroke="#000" stroke-width="2%"  />
<rect id="pianokeyL_Eb" onclick="singlerescale('Eb')" onmouseover="hightlight('Eb')" onmouseleave="hoverTimer('Eb') "fill="${pOffColor}"  x="${100/15*2 +1.6+0.3}%" y="0" rx="1px" width="3.5%" height="60%"  stroke="#000" stroke-width="2%"  />
<rect id="pianokeyL_Gb" onclick="singlerescale('Gb')" onmouseover="hightlight('Gb')" onmouseleave="hoverTimer('Gb') "fill="${pOffColor}"  x="${100/15*4 +1.6-0.6}%" y="0" rx="1px" width="3.5%" height="60%"  stroke="#000" stroke-width="2%"  />
<rect id="pianokeyL_Ab" onclick="singlerescale('Ab')" onmouseover="hightlight('Ab')" onmouseleave="hoverTimer('Ab') "fill="${pOffColor}"  x="${100/15*5 +1.6}%"     y="0" rx="1px" width="3.5%" height="60%"  stroke="#000" stroke-width="2%"  />
<rect id="pianokeyL_Bb" onclick="singlerescale('Bb')" onmouseover="hightlight('Bb')" onmouseleave="hoverTimer('Bb') "fill="${pOffColor}"  x="${100/15*6 +1.6+0.6}%" y="0" rx="1px" width="3.5%" height="60%"  stroke="#000" stroke-width="2%"  />
<rect id="pianokeyR_Db" onclick="singlerescale('Db')" onmouseover="hightlight('Db')" onmouseleave="hoverTimer('Db') "fill="${pOffColor}"  x="${100/15*8 +1.6-0.3}%" y="0" rx="1px" width="3.5%" height="60%"  stroke="#000" stroke-width="2%"  />
<rect id="pianokeyR_Eb" onclick="singlerescale('Eb')" onmouseover="hightlight('Eb')" onmouseleave="hoverTimer('Eb') "fill="${pOffColor}"  x="${100/15*9 +1.6+0.3}%" y="0" rx="1px" width="3.5%" height="60%"  stroke="#000" stroke-width="2%"  />
<rect id="pianokeyR_Gb" onclick="singlerescale('Gb')" onmouseover="hightlight('Gb')" onmouseleave="hoverTimer('Gb') "fill="${pOffColor}"  x="${100/15*11+1.6-0.6}%" y="0" rx="1px" width="3.5%" height="60%"  stroke="#000" stroke-width="2%"  />
<rect id="pianokeyR_Ab" onclick="singlerescale('Ab')" onmouseover="hightlight('Ab')" onmouseleave="hoverTimer('Ab') "fill="${pOffColor}"  x="${100/15*12+1.6}%"     y="0" rx="1px" width="3.5%" height="60%"  stroke="#000" stroke-width="2%"  />
<rect id="pianokeyR_Bb" onclick="singlerescale('Bb')" onmouseover="hightlight('Bb')" onmouseleave="hoverTimer('Bb') "fill="${pOffColor}"  x="${100/15*13+1.6+0.6}%" y="0" rx="1px" width="3.5%" height="60%"  stroke="#000" stroke-width="2%"  />
`;

function rescale(newscale, single=false) {
	if (!single) {newscale = toBool(newscale)}
	let inpanelnotes = document.querySelectorAll('#Scale > div');
	for (i=0; i<12; i++) {
		if (newscale[i]!=scale[i]) {
			let innotes = document.querySelectorAll('#gnotes .'+notes[0][(i+root)%12]);
			inpanelnotes[i].style.background = (newscale[i])? colors.fg : colors.bg;
			inpanelnotes[i].style.color = (newscale[i])? colors.bg : colors.fg;
			document.querySelector('#pianokeyL_'+notes[0][(i+root)%12]).style.fill = (newscale[i])? colors.fg : pOffColor;
			document.querySelector('#pianokeyR_'+notes[0][(i+root)%12]).style.fill = (newscale[i])? colors.fg : pOffColor;
			for (j=0; j<innotes.length; j++) {
				innotes[j].style.opacity = (newscale[i])? 1 : 0;
			}
		}
	}
	scale = newscale;
	showChords();
}
rescale('101011010101');
retune(true);

function singlerescale(innote) {
	let x = (((notes[0].indexOf(innote))+12-root)%12);
	newscale = scale;
	newscale[x] =! newscale[x];
	document.querySelector('#pianokeyL_'+innote).style.fill = (scale[x])? colors.fg : pOffColor;
	document.querySelector('#pianokeyR_'+innote).style.fill = (scale[x])? colors.fg : pOffColor;
	if (scale[x]) {
		document.querySelector('#'+innote).style.background = colors.fg;
		document.querySelector('#'+innote).style.color = colors.bg;
		for (i of document.querySelectorAll('#gnotes .'+innote)) {
			i.style.opacity = 1;
		}
	} else {
		document.querySelector('#'+innote).style.background = colors.bg;
		document.querySelector('#'+innote).style.color = colors.fg;
		for (i of document.querySelectorAll('#gnotes .'+innote)) {
			i.style.opacity = 0;
		}
	}
	rescale(newscale, true);
}

function reroot(newroot) {
	root = Number(newroot);
	let innotes = document.querySelectorAll('#Scale > div');
	for (i=0; i<12; i++) {
		innotes[i].innerText = notes[0][(i+root)%12];
		innotes[i].setAttribute('id', notes[0][(i+root)%12]);
		let gnotes = document.querySelectorAll('#gnotes .'+notes[0][(i+root)%12]);
		for (j=0; j<gnotes.length; j++) {
			gnotes[j].style.opacity = (scale[i])? 1 : 0;
		}
		document.querySelector('#pianokeyL_'+notes[0][(i+root)%12]).style.fill = (scale[i])? colors.fg : pOffColor;
		document.querySelector('#pianokeyR_'+notes[0][(i+root)%12]).style.fill = (scale[i])? colors.fg : pOffColor;
	}
	newNoteDisp(true);
	showChords();
}

for (i=1; i<12; i++) {
	document.querySelector('#conso_'+i).style.background = `linear-gradient(0deg, #000, #fff ${conso[i]*1.2*2}%, rgba(0,0,0,0) ${conso[i]*1.2*2}%)`;
	document.querySelector('#conso_'+i).style.opacity = (scale[(i)%12])? 1 : 0.1;
}

function remode(newmode) {
	newmode = Number(newmode);
	let oldscale = [];
	for (i=0; i<12; i++) {
		oldscale[i] = Number(scale[(i+newmode+12-root)%12]);
	}
	rescale(oldscale.join(''));
	reroot(newmode);
	showChords();
}

let getZeroOrder = function() {
	return (Number(document.querySelector('#conso_0').style.order)+root)%12;
}

let note_hover_timer = undefined;
let highlightednote = undefined;

function hoverTimer() {
	note_hover_timer = setTimeout(function() {
			for (i=1; i<12; i++) {
				document.querySelector('#conso_'+i).style.opacity = (scale[i])? 1 : 0.1;
			}
			for (i=0; i<12; i++) {
				document.querySelectorAll('#consoes > div')[i].style.order = i;
				document.querySelector('#pianokeyL_'+notes[0][(i+root)%12]).style.fill = (scale[i])? colors.fg : pOffColor;
				document.querySelector('#pianokeyR_'+notes[0][(i+root)%12]).style.fill = (scale[i])? colors.fg : pOffColor;
				if (scale[i]) {
					document.querySelector('#'+notes[0][(i+root)%12]).style.background = colors.fg;
					for (gnote of document.querySelectorAll('#gnotes > .'+notes[0][(i+root)%12]+'> circle')) {
						gnote.style.fill = colors.fg;
					}
				}
			}
			if (highlightednote!=undefined) document.querySelector('#chords').style.color = '#fff'
	}, 200);
}

function hightlight(note) {
	if (highlightednote!=undefined) {
		for (i=0; i<chords.length; i++) {
			document.querySelector('#prime_'+highlightednote).style.color = 'inherit';
			document.querySelector('#prime_'+note).style.color = '#fff';
		}
	}
	document.querySelector('#chords').style.color = '#555';
	highlightednote = note;
	let prime = notes[0].indexOf(note);
	if (note_hover_timer!=undefined) clearTimeout(note_hover_timer);
	for (i=1; i<12; i++) {document.querySelector('#conso_'+i).style.opacity = (scale[(i+prime+12-root)%12])? 1 : 0.1}
	for (i=0; i<12; i++) {
		document.querySelector('#conso_'+i).style.order = (i+prime+12-root)%12
		if (scale[(prime+i+12-root)%12]) {
			document.querySelector('#'+notes[0][(prime+i)%12]).style.background = 'rgb('+[255/65*conso[i],255/65*conso[i],255/65*conso[i]]+')';
			for (gnote of document.querySelectorAll('#guitar .'+notes[0][(prime+i)%12]+' circle')) {
				gnote.style.fill = 'rgb('+[255/65*conso[i],255/65*conso[i],255/65*conso[i]]+')';
				gnote.style.stroke = '5px';
			}
		document.querySelector('#pianokeyL_'+notes[0][(prime+i)%12]).style.fill = 'rgb('+[255/65*conso[i],255/65*conso[i],255/65*conso[i]]+')';
		document.querySelector('#pianokeyR_'+notes[0][(prime+i)%12]).style.fill = 'rgb('+[255/65*conso[i],255/65*conso[i],255/65*conso[i]]+')';
		}
	}
	if (scale[(prime+12-root)%12]) {
		// document.querySelector('#prime_'+note).style.color = '#fff';
	}
	// if (scale[(prime+12-root)%12]) {
	// 	for (i=0; i<chords.length; i++) {
	// 		let consocolor = 255/100*chordsconso[i];
	// 		document.querySelector('#prime_'+note+' .chr_'+chords[i][0]).style.color = 'rgb('+[consocolor,consocolor,consocolor]+')';
	// 	}
	// }
}

function newNoteDisp(stop=false) {
	if (!stop) notedisp = (notedisp+1)%5;
	let inpanelnotes = document.querySelectorAll('#Scale > div');
	switch (notedisp) {
		case 0:
			for (i=0; i<12; i++) {
				let innotes = document.querySelectorAll('#gnotes .'+notes[0][(i+root)%12]+' > text');
				for (j=0; j<innotes.length; j++) {
					innotes[j].innerHTML = notes[0][(i+root)%12];
				}
				inpanelnotes[i].innerText = notes[0][(i+root)%12];
			}
		break;
		case 1:
			for (i=0; i<12; i++) {
				let innotes = document.querySelectorAll('#gnotes .'+notes[0][(i)%12]+' > text');
				for (j=0; j<innotes.length; j++) {
					innotes[j].innerHTML = notes[1][(i+12-root)%12];
				}
				inpanelnotes[i].innerText = notes[1][(i)%12];
			}
		break;
		case 2:
			for (i=0; i<12; i++) {
				let innotes = document.querySelectorAll('#gnotes .'+notes[0][(i+root)%12]+' > text');
				for (j=0; j<innotes.length; j++) {
					innotes[j].innerHTML = i;
				}
				inpanelnotes[i].innerText = i;
			}
		break;
		case 3:
			for (i=0; i<12; i++) {
				let innotes = document.querySelectorAll('#gnotes .'+notes[0][(i+root)%12]+' > text');
				for (j=0; j<innotes.length; j++) {
					innotes[j].innerHTML = notes[2][(i+root)%12];
				}
				inpanelnotes[i].innerText = notes[2][(i+root)%12];
			}
		break;
		case 4:
			for (i=0; i<12; i++) {
				let innotes = document.querySelectorAll('#gnotes .'+notes[0][(i+root)%12]+' > text');
				for (j=0; j<innotes.length; j++) {
					innotes[j].innerHTML = '';
				}
				inpanelnotes[i].innerText = '';
			}
		break;
	}
}

function chordHightlight(prime, steps) {
	// document.querySelector('#'+notes[0][(prime+i)%12]).style.background = colors.fg;
	for (gnote of document.querySelectorAll('#guitar .'+notes[0][(prime)%12]+' circle')) gnote.style.fill = colors.fg;
	for (i=1; i<12; i++) {
		if (scale[(prime+12-root+i)%12]) {
			if (steps.includes(i)) {
				document.querySelector('#'+notes[0][(prime+i)%12]).style.background = 'rgb('+[255/65*conso[i],255/65*conso[i],255/65*conso[i]]+')';
				document.querySelector('#pianokeyL_'+notes[0][(prime+i)%12]).style.fill = 'rgb('+[255/65*conso[i],255/65*conso[i],255/65*conso[i]]+')';
				document.querySelector('#pianokeyR_'+notes[0][(prime+i)%12]).style.fill = 'rgb('+[255/65*conso[i],255/65*conso[i],255/65*conso[i]]+')';
				for (gnote of document.querySelectorAll('#guitar .'+notes[0][(prime+i)%12]+' circle')) {
					gnote.style.fill = 'rgb('+[255/65*conso[i],255/65*conso[i],255/65*conso[i]]+')';
				}
			} else {
				document.querySelector('#'+notes[0][(prime+i)%12]).style.background = colors.bg;
				document.querySelector('#'+notes[0][(prime+i)%12]).style.color = colors.fg;
				for (gnote of document.querySelectorAll('#guitar .'+notes[0][(prime+i)%12])) {
					gnote.style.opacity = 0;
				}
				document.querySelector('#pianokeyL_'+notes[0][(prime+i)%12]).style.fill = pOffColor;
				document.querySelector('#pianokeyR_'+notes[0][(prime+i)%12]).style.fill = pOffColor;
			}
		}
	}
}

function chordDehighlight() {
	// document.querySelector('#'+notes[0][i]).style.background = colors.fg;
	for (i=0; i<12; i++) {
		if (scale[i]) {
			document.querySelector('#'+notes[0][(i+root)%12]).style.background = colors.fg;
			document.querySelector('#'+notes[0][(i+root)%12]).style.color = colors.bg;
			for (gnote of document.querySelectorAll('#guitar .'+notes[0][(i+root)%12])) {
				gnote.style.opacity = 1;
				gnote.firstElementChild.style.fill = colors.fg;
			}
		}
		document.querySelector('#pianokeyL_'+notes[0][(i+root)%12]).style.fill = (scale[i])? colors.fg : pOffColor;
		document.querySelector('#pianokeyR_'+notes[0][(i+root)%12]).style.fill = (scale[i])? colors.fg : pOffColor;
	}
}

// autor: Gaan Valentin : flagrantior@gmail.com

let isHintOpen = false;
function showHint() {
	document.querySelector('#showhint').innerText = (isHintOpen)? '▼' : '▲';
	document.querySelector('#hint').style.display = (isHintOpen)? 'none' : 'block';
	isHintOpen = !isHintOpen;
}

if (window.innerHeight>window.innerWidth) document.querySelector('#hint').src = '/hint/DARKHINT_V.png';

window.addEventListener('orientationchange', function() {
	if (window.innerHeight>window.innerWidth) {
		document.querySelector('#hint').src = '/hint/DARKHINT_H.png'
	} else {
		document.querySelector('#hint').src = '/hint/DARKHINT_V.png'
	}
});

function chordTypesHightlight(chr_type) {
	for (chr_prime of notes[0]) {
		if (scale[(notes[0].indexOf(chr_prime)+12-root)%12]) {
			if (document.querySelector('#prime_'+chr_prime+' .chr_'+chr_type).style.display == 'none') {
				document.querySelector('#'+chr_prime).style.background = '#222';
				for (gnote of document.querySelectorAll('#gnotes > .'+chr_prime+' > circle')) {
					gnote.style.fill = '#222';
					document.querySelector('#pianokeyL_'+chr_prime).style.fill = pOffColor;
					document.querySelector('#pianokeyR_'+chr_prime).style.fill = pOffColor;
				}
				document.querySelector('#conso_'+(notes[0].indexOf(chr_prime)+12-root)%12).style.opacity = 0.1;
			}
		}
	}
}

function chordTypesDehightlight(chr_type) {
	for (chr_prime of notes[0]) {
		if (scale[(notes[0].indexOf(chr_prime)+12-root)%12]) {
			if (document.querySelector('#prime_'+chr_prime+' .chr_'+chr_type).style.display == 'none') {
				document.querySelector('#'+chr_prime).style.background = '#fff';
				for (gnote of document.querySelectorAll('#gnotes > .'+chr_prime+' > circle')) {
					gnote.style.fill = colors.fg;
					document.querySelector('#pianokeyL_'+chr_prime).style.fill = colors.fg;
					document.querySelector('#pianokeyR_'+chr_prime).style.fill = colors.fg;
				}
			}
			document.querySelector('#conso_'+(notes[0].indexOf(chr_prime)+12-root)%12).style.opacity = 1;
		}
	}
}

function invertTheme() {
	let tmpbody = document.querySelector('body');
	if (localStorage.getItem('invertedColors')==0 || localStorage.getItem('invertedColors')===null) {
		tmpbody.style.background = '#fff';
		tmpbody.style.filter = 'invert()';
		localStorage.setItem('invertedColors', 1);
	} else {
		tmpbody.style.background = '#000';
		tmpbody.style.filter = '';
		localStorage.setItem('invertedColors', 0);
	}
}

if (localStorage.getItem('invertedColors')==1) {
	let tmpbody = document.querySelector('body');
	tmpbody.style.background = '#fff';
	tmpbody.style.filter = 'invert()';
}

