// autor: Gaan Valentin : flagrantior@gmail.com
'use strict';

let consomode = false;
let root = 0; // C
let scale = 0b101010110101;
let alter = 2; // b/#/n
const ratio = 2**(1/12);
const conso = [.6, .093, .098, .185, .234, .306, .067, .452, .154, .296, .151, .078]; // 0=1! 13=0.89
const precolors = [
	{
	main_bg:"#000000", conso:"#ff0000", diss:"#0000ff",
	stringed_notes_fg:"#000000", stringed_notes_bg:"#ffffff", stringed_notes_bd:"#000000",
	stringed_strings:"#ffffff", stringed_frets:"#ffffff",
	keyed_on_bg:"#ffffff", keyed_off_bg:"#2b2b2b", keyed_bd:"#000000",
	panel_fg:"#ffffff", panel_bg:"#000000", panel_on_fg:"#000000", panel_on_bg:"#ffffff",
	panel_off_fg:"#ffffff", panel_off_bg:"#000000", chords_fg:"#ffffff",
	},{
	main_bg:"linear-gradient(#202, #000 10%)", conso:"#00ffff", diss:"#ff00ff",
	stringed_notes_fg:"#000000", stringed_notes_bg:"#00ffff", stringed_notes_bd:"#000000",
	stringed_strings:"#ff00ff", stringed_frets:"#ff00ff",
	keyed_on_bg:"#00ffff", keyed_off_bg:"#000000", keyed_bd:"#330033",
	panel_fg:"#00ffff", panel_bg:"#000000", panel_on_fg:"#000000", panel_on_bg:"#00ffff",
	panel_off_fg:"#00ffff", panel_off_bg:"#000000", chords_fg:"#ff00ff",
	},{
	main_bg:"#000000", conso:"#229999", diss:"#555537",
	stringed_notes_fg:"#d5d599", stringed_notes_bg:"#002525", stringed_notes_bd:"#205959",
	stringed_strings:"#aaaa77", stringed_frets:"#88885a",
	keyed_on_bg:"#448585", keyed_off_bg:"#000000", keyed_bd:"#252510",
	panel_fg:"#66b5b5", panel_bg:"#000000", panel_on_fg:"#000000", panel_on_bg:"#66b5b5",
	panel_off_fg:"#aaaa77", panel_off_bg:"#000000", chords_fg:"#bbbb77",
	},{
	main_bg:'#ffffff', conso:'#ff0000', diss:'#0000ff',
	stringed_notes_fg:"#ffffff", stringed_notes_bg:"#000000", stringed_notes_bd:"#999999",
	stringed_strings:"#000000", stringed_frets:"#000000",
	keyed_on_bg:"#ffffff", keyed_off_bg:"#222222", keyed_bd:"#000000",
	panel_fg:"#000000", panel_bg:"#ffffff", panel_on_fg:"#ffffff", panel_on_bg:"#000000",
	panel_off_fg:"#000000", panel_off_bg:"#ffffff", chords_fg:"#000000",
	},
]

let colors = JSON.parse(localStorage.getItem('colors')) ?? precolors[0];

const consocolor = (k) => {
	return `#${[...Array(3).keys()].map(v => { return Math.round(
		parseInt(colors.conso.slice(1+2*v,3+2*v),16)*conso[k]*1.66
		+ parseInt(colors.diss.slice(1+2*v,3+2*v),16)*(1-conso[k]*1.66))
		.toString(16).padStart(2,0) }).join('')}`
}

let notes = [
	['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
	['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'],
	['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
];

const scales = new Map([
	[0b111111111111, 'Chromatic'],

	[0b101010110101, 'Major'],
	[0b010110101101, 'Minor'],
	[0b011010101101, 'Dorian'],
	[0b010110101011, 'Phrygian'],
	[0b101011010101, 'Lydian'],
	[0b011010110101, 'Mixolydian'],
	[0b010101101011, 'Locrian'],

	[0b010010101001, 'Pentatonic'],
	[0b100110110101, 'Harmonic Major'],
	[0b100110101101, 'Harmonic Minor'],
	[0b010110110011, 'Phrygian Dominant'],
	[0b010110110101, 'Melodic Major'],
	[0b101010101101, 'Melodic Minor'],
	[0b100110110011, 'Double Harmonic Major'],
	[0b100111001101, 'Double Harmonic Minor'],
	[0b000110001101, 'Japan'],
	[0b101010101011, 'Neapolitan'],
	[0b100101010011, 'Enigmatic'],
]);

const toggleconso = (newmode=null) => {
	const button = document.querySelector('#panelconso');
	consomode = newmode ?? !consomode;
	if (consomode) {
		button.style.background=`linear-gradient(90deg, ${[colors.conso, colors.diss]}`;
		button.style.color=colors.panel_bg;
	} else {
		button.style.background=colors.panel_bg;
		button.style.color=colors.panel_fg;
		stringed.shader(); keyed.shader(); panel.shader();
	}
};

const toggle = (k=null) => {
	if (!consomode) {
		if (k!==null) scale^=(1<<((k+12-root)%12));
		stringed.shader(); keyed.shader(); chords.shader(); panel.shader();
	} else {
		stringed.shader(k); keyed.shader(k); panel.shader(k);
	}
}

const colorize = () => {
	Object.entries(colors).map(([key, value]) => {
		document.querySelector(':root').style.setProperty(`--${key}`, value);
	})
	stringed.shader(); keyed.shader(); panel.shader(); chords.shader();
}

const renders = () => {
	stringed.render();
	keyed.render();
	panel.render();
	chords.render();
	linked();
	toggleconso(false);
	toggle();
	colorize();
}

const palette = (redraw=false) => {
	if (redraw) document.querySelector('#palette').remove();
	if (document.querySelector('#palette') === null) {
		document.querySelector('body').innerHTML += `<div id="palette"><div id="precolors">${
			precolors.map((preset, pid) =>
				`<div style="width:100%; height:1em; background:linear-gradient(90deg, ${[
					preset.panel_bg,
					preset.conso,
					preset.panel_fg,
					preset.diss,
					preset.panel_bg,
				]})" onclick="colors=precolors[${pid}]; palette(true); renders()"></div>`).join('')
		}</div><div class="colors">${
			Object.entries(colors).map(([key, value]) => {
				return `<div>${key}:<input type="text" onchange="colors.${
					key}=this.value; renders()" value="${value}"></div>`
				}).join('')
			}</div><div class="buttons">
			<div onclick="document.querySelector('#palette').remove()">CLOSE</div>
			<div onclick="document.querySelector('#palette').remove();
				localStorage.setItem('colors', JSON.stringify(colors))">SAVE</div></div></div>`
		} else document.querySelector('#palette').remove();
}



const stringed = {
	zeroes: JSON.parse(localStorage.getItem('stringed_zeroes')) ?? [4, 11, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10],
	frets: JSON.parse(localStorage.getItem('stringed_frets')) ?? 24,
	strings: JSON.parse(localStorage.getItem('stringed_strings')) ?? 6,
	fretted: JSON.parse(localStorage.getItem('stringed_fretted')) ?? true,

	render: () => {
		if (document.querySelector('#stringed') === null)
			document.write(`<div id="stringed"><svg height="${stringed.strings*25}"></svg></div>`);
		document.querySelector('#stringed > svg').innerHTML = `
				<line class="fret" x1="2%" x2="2%" y1="${15-stringed.strings}" y2="${
					87+stringed.strings}%" stroke-width="2.2"/>
				<line class="fret" x1="98.5%" x2="98.5%" y1="${15-stringed.strings}" y2="${
					87+stringed.strings}%" stroke-width="2.2"/>
				<line class="fret" x1="2.3%" x2="2.3%" y1="${15-stringed.strings}%" y2="${
					85+stringed.strings}%"/>
				<g class="fret">
					${stringed.fretted? `${[23.8, 48.2, 49, 61.26, 73.64, 74.4].map(x => {
						return `<circle cx="${x}%" cy="96%" r="3px" fill="${
							colors.stringed_frets}"></circle>`}).join('')}
							${[...Array(stringed.frets).keys()].map(f => {
							let x = 101.07-99.1*(1/ratio*1.0025)**(f+1);
							return `<line x1="${x}%" x2="${x}%" y1="${
								15-stringed.strings}%" y2="${
								85+stringed.strings}%" stroke-width="1px"/>`
						}).join('')}`
					: `${[25.91, 49.65, 50.36, 62.36, 74.42, 75.1].map(x => {
						return `<circle cx="${x}%" cy="96%" r="3px" fill="${
							colors.stringed_frets}"></circle>`}).join('')}`}
				</g>
				<g class="strings">${[...Array(stringed.strings).keys()].map(s => {
					let y = 100/(stringed.strings+1)*(s+1);
					return `<g class="string"><line x1="1.3%" y1="${y}%" x2="99%" y2="${
					y}%" stroke="${colors.stringed_strings}" stroke-width="${
						2.5/stringed.strings*s+.5}"/>
						<circle cx="1.3%" cy="${y}%" r="3px" fill="${colors.stringed_strings}"></circle>
						<circle cx="99%" cy="${y}%" r="3px" fill="${colors.stringed_strings}"></circle>
						<g class="notes">
							<g class="note" onclick="toggle(${
								(stringed.zeroes[(s)%12])%12})" opacity="0">
								<circle stroke-width="1px" r="10px" cx="1.25%" cy="${y}%"/>
								<text text-anchor="middle" dominant-baseline="middle" fill="${
									colors.stringed_notes_fg}" x="1.25%" y="${y+1.3}%">${
									notes[alter][(stringed.zeroes[s%12])%12]}</text>
							</g>
							${[...Array(stringed.frets).keys()].map(f => {
								let x = stringed.fretted?
									100.6-101.5*(1/ratio*1.0020)**(f+1) :
									101.07-99.1*(1/ratio*1.0025)**(f+1);
								return `<g class="note" onclick="toggle(${
									(stringed.zeroes[s%12]+(f+1))%12})" opacity="0">
									<circle r="10px" cx="${x}%" cy="${
										y}%" stroke-width="1px"/>
									<text text-anchor="middle" dominant-baseline="middle" fill="${
										colors.stringed_notes_fg}" x="${x}%" y="${y+1.3}%">${
										notes[alter][(stringed.zeroes[s%12]+(f+1))%12]}</text>
								</g>`
							}).join('')}
						</g></g>`}).join('')}
					</g>
				</g>`
		consomode=false;
		stringed.shader();
	},

	shader: (k=null) => {
		document.querySelectorAll('#stringed .string').forEach((string, sid) => {
			string.querySelectorAll('.note').forEach((note, nid) => {
				if (scale >> (stringed.zeroes[sid]+nid+12-root)%12 & 1) {
					note.setAttribute('opacity', '1');
					note.querySelector('circle').setAttribute('fill', ((consomode)?
						consocolor((nid+12-k+stringed.zeroes[sid])%12) : colors.stringed_notes_bg))
				} else { note.setAttribute('opacity', '0')}
			})
		})
	},

	retune: (event, input) => {
		!'ABCDEFGabcdefg#'.includes(event.key) && event.preventDefault(); // ADD OCTAVE NUMBERS
		if (event.key === 'Enter') {
			stringed.strings = input.value.length;
			let shift=0; let i=0;
			input.value.split('').reverse().forEach((note, nid) => {
				switch (note) {
					case '#': {shift=(shift+13)%12; i++; stringed.strings--; break}
					case 'b': {shift=(shift+11)%12; i++; stringed.strings--; break}
					default: {stringed.zeroes[nid-i]
						= notes[0].indexOf(note.toUpperCase())+shift; shift=0};
				}
			});
			localStorage.setItem('stringed_strings', JSON.stringify(stringed.strings));
			localStorage.setItem('stringed_zeroes', JSON.stringify(stringed.zeroes));
			stringed.render();
		}
	},

}


const keyed = {
	octaves: 2,

	render: () => {
		if (document.querySelector('#keyed') === null)
			document.write(`<div id="keyed"><div id="keyedwrap"></div></div>`);
		document.querySelector('#keyed > #keyedwrap').innerHTML = `${
			[...Array(keyed.octaves).keys()].map(octave => {
				return `<svg class="octaves octave_${octave}">
					${[...Array(7).keys()].map(note => {return `
						<rect class="note ${['C','D','E','F','G','A','B'][note]}" x="${
							100/7*note}%" y="2%"
						rx="5px" width="${100/7}%" height="95%" stroke-width="1px" onclick="toggle(
							${[0,2,4,5,7,9,11][note]})"/>`
					}).join('')}
					${[1,3,6,8,10].map(note => {return `
						<rect class="note ${notes[0][note]}" onclick="toggle(${
							note})" stroke-width="5px"
						x="${100/12*note}%" y="2%" rx="5px" width="${100/12+1.4}%" height="60%"/>`
					}).join('')}</svg>`
			}).join('')}`
		consomode=false;
		keyed.shader();
	},

	shader: (k=null) => {
		document.querySelectorAll('#keyed .octaves').forEach(octave => {
			[...Array(12).keys()].map(note => {
				octave.querySelector(`.note.${notes[0][(note+root)%12]}`)
					.setAttribute('fill', (scale >> (note)%12 & 1)?
						((consomode)? consocolor((note+24+root-k)%12) : colors.keyed_on_bg)
						: colors.keyed_off_bg)
			})
		})
	},
	
	octaver: (shift) => {
		if (keyed.octaves+shift > 0 && keyed.octaves+shift <= 8) {
			keyed.octaves += shift;
			keyed.render();
		}
	},
}


const panel = {
	render: () => {
		if (document.querySelector('#panel') === null) {
			document.write(`
				<div id="panel">
					<svg height="200px" width="200px" viewBox="0 0 100 100"><g>
						${[...Array(12).keys()].map(n => {
							let angle = Math.PI/12*2*(n-3);
							return `<g>
								<circle onclick="consomode? toggle(${(n*7)%12}) : panel.reroot(${(n*7)%12})" cx="${
									35*Math.cos(angle)+50}" cy="${
									35*Math.sin(angle)+50}" r="8"></circle>
								<text text-anchor="middle" dominant-baseline="middle" x="${
									35*Math.cos(angle)+50}" y="${35*Math.sin(angle)+50}"></text>
							</g>`
						}).join('')}</g>
					</svg>
					<div id="panelbuttons">
						<select id="scaleslist" onchange="scale=parseInt(this.value); toggleconso(false); toggle()">
							<option value="0" style="color: #777">Empty</option>
							${[...scales].map(s => {
								return `<option value="${s[0]}">${s[1]}</option>`
							}).join('')}
							${chords.chords.map(chord => {
								return `<option value="${
									((chord[0]%4096) | (chord[0]>>12))}">${chord[1]} chord</option>`
							}).join('')}
						</select>
						<div id="retune">[<input type="text" onkeypress="
							stringed.retune(event, this)" value="${
								[...Array(stringed.strings).keys()].map(nid =>
								notes[0][stringed.zeroes[stringed.strings-1-nid]]).join('')}">]</div>
						<div class="wrap">
							<div id="panelfretted" onclick="
								localStorage.setItem('stringed_fretted', !stringed.fretted);
								stringed.fretted=!stringed.fretted; stringed.render();
								toggleconso(false)">FRETTED</div>
							<div id="panelalter" onclick="
								alter=(alter+1)%3; stringed.render(); keyed.shader();
								panel.render(); panel.shader(); chords.render(); toggleconso(false)">ALTER</div>
						</div>
						<div class="wrap">
							<div onclick="palette()">THEME</div>
							<div id="panelconso" onclick="toggleconso(); consomode && toggle(root)">CONSO</div>
						</div>
					</div>
				</div>`
			)
			window.onload = () => panel.shader();
		};
		document.querySelectorAll('#panel svg g text').forEach((node, n) => {
			node.innerHTML = notes[alter][(n*7%12)];
		});
	},

	shader: (k=null, chord=null) => {
		document.querySelector('#panel #scaleslist').value = chord ??
			((scales.get(scale) !== undefined)? scale : '');
		document.querySelectorAll('#panel svg g circle').forEach((circle, cid) =>
			circle.setAttribute('fill', (consomode)?
				((scale >> (cid*7+12-root)%12 & 1)? consocolor((cid*7+12-k)%12) : ((k===(cid*7)%12 && chord==null)? colors.panel_on_bg+'77' : colors.panel_off_bg))
				: (((cid*7)%12===root)? colors.panel_on_bg : colors.panel_off_bg)) );
		document.querySelectorAll('#panel svg g text').forEach((text, tid) =>
			text.setAttribute('fill', ((tid*7+24-k+((k!==null)? root : 0))%12===root)?
				colors.panel_on_fg : (((scale>>(tid*7+24-root)%12)&1)? colors.panel_off_fg : colors.panel_off_fg+'66')));
	},

	reroot: (n) => {
		toggleconso(false);
		scale=((scale+(scale<<12)>>(n+12-root)%12)&4095);
		for (let i=12; i>(n+12-root)%12; i--) {
			notes[1].push(notes[1].splice(0, 1)[0]);
		}
		stringed.render(); panel.render(); chords.render();
		root=n; toggle();
	},
}


const chords = {
	chords: [
    //    13  11   9   7    5   3   1
        [0b00000_00000_00_00100_10001, 'M'       ],
        [0b00000_00000_00_00100_01001, 'm'       ],
        [0b00000_00000_00_00100_00001, '5'       ],
        [0b00000_00000_00_00001_00001, '4'       ],
        [0b00000_00000_00_01000_10001, 'aug'     ],
        [0b00000_00000_00_00010_01001, 'dim'     ],
        [0b00000_00000_10_00100_10001, 'maj7'    ],
        [0b00000_00000_01_00100_10001, 'dom7'    ],
        [0b00000_00000_01_01000_10001, 'aug7'    ],
        [0b00000_00000_01_00010_10001, 'dom7b5'  ],
        [0b00000_00000_01_00100_01001, 'm7'      ],
        [0b00000_00000_01_00010_01001, 'm7b5'    ],
        [0b00000_00000_00_10010_01001, 'dim7'    ],
        [0b00000_00000_00_00100_00101, 'sus2'    ],
        [0b00000_00000_00_00100_10101, 'add2'    ],
        [0b00000_00100_00_00100_10001, 'add9'    ],
        [0b00000_00100_01_00100_10001, '9'       ],
        [0b00000_00100_10_00100_10001, 'maj9'    ],
        [0b00000_00010_01_00100_10001, '.b9'     ],
        [0b00000_01000_01_00100_10001, '.#9'     ],
        [0b00000_00100_01_00100_01001, 'm9'      ],
        [0b00000_00000_00_00101_00001, 'sus4'    ],
        [0b00001_00100_01_00100_01001, 'm11'     ],
        [0b00010_00000_10_00100_10001, 'maj7#11' ],
        [0b00000_00000_01_00101_00001, '7sus4'   ],
        [0b00000_00000_00_10100_10001, 'maj6'    ],
        [0b10000_00000_01_00100_10001, '13'      ],
        [0b00000_00000_01_10100_01001, 'min6'    ],
        [0b00000_00100_00_10100_10001, '6/9'     ],
        [0b00000_00100_01_00101_00001, '9sus4'   ],
        [0b00000_00100_01_00010_01001, 'm9n5'    ],
    ],

	render: () => {
		if (document.querySelector('#chords') === null)
			document.write(`<div id="chords"><div id="chords_types">${
				chords.chords.map((chord, cid) => {return `<div onclick="chords.primes(${cid})">${chord[1]}</div>`}).join('')}</div><div id="chordswrap"></div></div>`);
		document.querySelector('#chordswrap').innerHTML = `
			${notes[alter].map((prime, pid) => {
				return `<div>${chords.chords.map(c => {
					return `<div class="chordwrap" onclick="chords.conso(${
						[pid, (c[0]>>12|c[0]&4095)]}, this)"><div>${prime}${c[1]}</div></div>`
				}).join('')}</div>`
			}).join('')}`;
		chords.shader();
	},

	shader: () => {
		document.querySelectorAll('#chordswrap > div').forEach((prime, pid) => {
			if (scale >> (pid+12-root)%12 & 1) {
				prime.style.display = 'flex';
				prime.style.order = (pid*7+12-(root*7)%12)%12;
				prime.querySelectorAll('.chordwrap > div').forEach((chord, cid) => {
					chord.style.display =
						((chords.chords[cid][0]>>12|chords.chords[cid][0]&4095
						|((scale<<12)+scale>>(pid+12-root)%12))
						===(((scale<<12)+scale)>>(pid+12-root)%12))? 'block' : 'none';
				})
			} else prime.style.display = 'none';
		})
	},
	
	conso: (k=0, chord, origin) => {
		if (origin.firstChild.style.display === 'block') {
			let temproot=root, tempscale=scale;
			root=k; scale=chord;
			consomode && toggleconso(false);
			stringed.shader(); keyed.shader(); panel.shader();
			toggleconso(true);
			stringed.shader(k); keyed.shader(k); panel.shader(k, chord);
			root=temproot;
			scale=tempscale;
		} else {
			toggleconso(false);
		};
	},

	primes: cid => {
		let temproot=root, tempscale=scale;
		scale=0;
		for (let i=0; i<12; i+=1) {
			if ((((tempscale<<12)+tempscale)
					| (((chords.chords[cid][0]>>12|chords.chords[cid][0])-(chords.chords[cid][0]>>12<<12)) <<i))
					==(tempscale<<12)+tempscale)
				scale+=2**i;
		}
		toggleconso(true);
		stringed.shader(root); keyed.shader(root); panel.shader(root);
		root=temproot; scale=tempscale;
	},
}

const linked = () => {
	if (document.querySelector('#linked') === null) {
		document.write(`<div id="linked">
			<b><a href="/hint/DARKHINT_H.png">HINT</a></b>
			<a href="/oscill">OSCILL</a>
			<a href="/spectro">SPECTRO</a>
			<a href="mailto:flagrantior@gmail.com">EMAIL</a>
			<a href="https://t.me/flagrantior">TELEGRAM</a>
			<div>Valentin Gaan</div>
		</div>`);
	}
}


renders();
