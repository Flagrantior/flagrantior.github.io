let SCALE = [true, false, true, false, true, true, false, true, false, true, false, true];
const OFST = [5, 0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10];
let TOFS = [-1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let NOTE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const STEP = ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'];
// const STEP = ['U', 'm2', 'M2', 'm3', 'M3', 'P4', 'D5', 'P5', 'm6', 'M6', 'm7', 'M7'];
let NNAM = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let ROOT = 0;
let TRND = false;
let CHTRND = false;
let STRINGS = 6;
let V = 0;
let TBLTRN = false;
let FRETS = 25;
let alter = '#';

function LOGOREC() {
    for (let i=-V; i<=V; i++) {
        document.getElementById("Vlogo").innerHTML += '<line \
        x1="'+(50+i*7.5)+'%" \
        y1="'+(100-V*15)+'%" \
        x2="'+(50-(V+1)*10)+'%" \
        y2="'+(90-V*15-57.5)+'%" \
        stroke="white"></line><line \
        x1="'+(50+i*7.5)+'%" \
        y1="'+(100-V*15)+'%" \
        x2="'+(50+(V+1)*10)+'%" \
        y2="'+(90-V*15-57.5)+'%" \
        stroke="white"></line>';
    }
    V++;
    if (V>2) return;
    LOGOREC();
}
LOGOREC();

function TUNEIN(TUNECOOKIE) {
    if (TUNECOOKIE!=undefined || document.getElementById("tunein").value.length>0) {
        let tval = '';
        if (TUNECOOKIE!=undefined) {tval = TUNECOOKIE} else {tval = document.getElementById("tunein").value}
        if (tval.length>36) {tval = tval.slice(0, 36)}
        let tvalx = [];
        for (i=0; i<tval.length; i++) {
            if (tvalx.length<12) {
                if (tval[i]=='#') {
                    if (tvalx[0]!=undefined) {
                        if (!tvalx[tvalx.length-1].includes('#')&tval[i]!='E'&tval[i]!='B'&tval[i]!='e'&tval[i]!='b') {
                            tvalx[tvalx.length-1] = NOTE[(NOTE.indexOf(tvalx[tvalx.length-1])+1)%12];
                       }
                    }
                } else if (tval[i]=='c'||tval[i]=='d'||tval[i]=='e'||tval[i]=='f'||tval[i]=='g'||tval[i]=='a'||tval[i]=='b'||tval[i]=='C'||tval[i]=='D'||tval[i]=='E'||tval[i]=='F'||tval[i]=='G'||tval[i]=='A'||tval[i]=='B') {
                    tvalx.push(tval[i].toUpperCase());
                }
            }
        }
        if (tvalx[0]!=undefined) {
            for (i=tvalx.length-1; i>=0; i--) {
                while ((NNAM[((OFST[i]+24+TOFS[i]))%12])!=tvalx[tvalx.length-i-1]) {
                    TOFS[i]=(TOFS[i]-1)%12;
                }
            }
        }
        REDRAWSTRINGS(tvalx.length-STRINGS);
    } else {
        TOFS = [-1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        STRINGS = 6;
        REDRAWSTRINGS(0);
    }
} // ресрой гитары

function TURN() {
    TRND=!TRND;
    if (TRND) {NNAM = STEP}
        else {NNAM = NOTE}
    REDRAW();
}

function FULLOFF(OFF) {
    for (let i=0; i<12; i++) {
        TOFS[i] = (TOFS[i]+OFF)%12;
    }
    REDRAW();
}

function RESCALE(SCALEKEY) {
    SCALE[SCALEKEY]=!SCALE[SCALEKEY];
    REDRAW();
}

function REROOT(WAY) {
    if (WAY != -1) {
        if (WAY) {ROOT=(ROOT+1)%12} else {ROOT=(ROOT-1)%12}
        if (ROOT<0) ROOT+=12;
    }
    REDRAW();
}

function SELECTROOT(uroot, redraw) {
    ROOT = Number(uroot);
    if (redraw!=true) {REDRAW()}
}

function SELECTSCALE(uscale) {
    for (i=0; i<12; i++) {
        SCALE[i] = Number(uscale[i]);
    }
    REDRAW();
}

function REDRAW(OFSTKEY, OFSTVAL, NULLER) {
    document.getElementById("notes").innerHTML = '';
    document.getElementById("MCHRDS").innerHTML = '';
    document.getElementById("QCHRDS").innerHTML = '';
    document.getElementById("QRCHRDS").innerHTML = '';
    document.getElementById("SCHRDS").innerHTML = '';
    document.getElementById("SXCHRDS").innerHTML = '';
    document.getElementById("ACHRDS").innerHTML = '';
    document.getElementById("S2CHRDS").innerHTML = '';
    document.getElementById("S4CHRDS").innerHTML = '';
    document.getElementById("TRN").innerHTML = '';    
    document.getElementById("scaleslist").value = "scale";

    TOFS[OFSTKEY]=(TOFS[OFSTKEY]+OFSTVAL)%12;
    if (OFST[OFSTKEY]<1) OFST[OFSTKEY]+=12;

    if (NULLER) {
        TOFS[OFSTKEY]=0;
    }

    for (let i=0; i<STRINGS; i++) {
        if (!TRND&!SCALE[(((OFST[i]+TOFS[i])-ROOT)+24)%12]) {
            document.getElementById("notes").innerHTML += ('<circle id="notepin_'+i+'" class="note_'+(NOTE[((OFST[i]+24+TOFS[i]))%12])+'"r="10" cx="6.8%" cy="'+GETSTRINGSWIDTH(i)+'%" fill="black"/><text text-anchor="middle" x="6.8%" y="'+(GETSTRINGSWIDTH(i)+2.5)+'%" fill="#777777" class="NOTEPIN">'+NNAM[((OFST[i]+24+TOFS[i]))%12])+'</text>';
        } // неактивные ноты нулевого лада

        if (SCALE[(((OFST[i]+TOFS[i])-ROOT)+12)%12]) {
            if (TRND) {
                document.getElementById("notes").innerHTML += ('<circle class="note_'+(NOTE[((OFST[i]+24+TOFS[i]))%12])+'" r="9" cx="6.8%" cy="'+GETSTRINGSWIDTH(i)+'%" fill="white" onmouseover="HIGHLIGHT(\''+(NOTE[((OFST[i]+24+TOFS[i]))%12])+'\')" onmouseleave="HIGHLIGHTRESET()"/><text text-anchor="middle" x="6.8%" y="'+(GETSTRINGSWIDTH(i)+2.5)+'%" fill="black" class="NOTEBOLD">'+(STEP[((OFST[i]+24+TOFS[i])-ROOT+12)%12])+'</text>');
            } else {
                document.getElementById("notes").innerHTML += ('<circle class="note_'+(NOTE[((OFST[i]+24+TOFS[i]))%12])+'" r="9" cx="6.8%" cy="'+GETSTRINGSWIDTH(i)+'%" fill="white" onmouseover="HIGHLIGHT(\''+(NOTE[((OFST[i]+24+TOFS[i]))%12])+'\')" onmouseleave="HIGHLIGHTRESET()"/><text text-anchor="middle" x="6.8%" y="'+(GETSTRINGSWIDTH(i)+2.5)+'%" fill="black" class="NOTEBOLD">'+(NOTE[((OFST[i]+24+TOFS[i]))%12])+'</text>');
            }
        } // активные ноты нулевого лада

        for (let f=1; f<FRETS; f++) {
            if (SCALE[((f+(OFST[i]+24+TOFS[i])-ROOT)+12)%12]) {
                if (TRND&&!CHTRND) {
                    document.getElementById("notes").innerHTML += ('<circle class="note_'+(NOTE[(f+(OFST[i]+24+TOFS[i]))%12])+'" r="9" cx="'+(4.95+5.9*f-(f*(0.1^(f-1))*0.0942))+'%" cy="'+GETSTRINGSWIDTH(i)+'%" fill="white" onmouseover="HIGHLIGHT(\''+(NOTE[(f+(OFST[i]+24+TOFS[i]))%12])+'\')" onmouseleave="HIGHLIGHTRESET()"/><text text-anchor="middle" x="'+(4.95+5.9*f-(f*(0.1^(f-1))*0.0942))+'%" y="'+(GETSTRINGSWIDTH(i)+2.5)+'%" fill="black" class="NOTEBOLD">'+(STEP[(f+(OFST[i]+24+TOFS[i]-ROOT+12))%12])+'</text>');
                } else {
            		document.getElementById("notes").innerHTML += ('<circle class="note_'+(NOTE[(f+(OFST[i]+24+TOFS[i]))%12])+'" r="9" cx="'+(4.95+5.9*f-(f*(0.1^(f-1))*0.0942))+'%" cy="'+GETSTRINGSWIDTH(i)+'%" fill="white" onmouseover="HIGHLIGHT(\''+(NOTE[(f+(OFST[i]+24+TOFS[i]))%12])+'\')" onmouseleave="HIGHLIGHTRESET()"/><text text-anchor="middle" x="'+(4.95+5.9*f-(f*(0.1^(f-1))*0.0942))+'%" y="'+(GETSTRINGSWIDTH(i)+2.5)+'%" fill="black" class="NOTEBOLD">'+(NOTE[(f+(OFST[i]+24+TOFS[i]))%12])+'</text>');
            	}
            }
	    } // нанесение нот на гриф

    }

    document.getElementById("strings").innerHTML += '\
    <text x="96.7%" y="28%" fill="white" text-anchor="middle" style="user-select: none; font-size: 2em; cursor: pointer;" onclick="REDRAWSTRINGS(-1)">-</text>\
    <text x="96.7%" y="92%" fill="white" text-anchor="middle" style="user-select: none; font-size: 2em; cursor: pointer;" onclick="REDRAWSTRINGS(1)">+</text>'
    document.getElementById("rootslist").value = ROOT;
    document.getElementById("modeslist").innerHTML = '<option value="mode" selected disabled hidden>MODE</option>';

    for (let i=0; i<12; i++) {

        function SCALECHECK() {
            if (TRND) {
                if (SCALE[i]) {return STEP[(i)%12]} else {return STEP[(i)%12]}
            } else {
                if (SCALE[i]) {return NNAM[(i+ROOT)%12]} else {return NNAM[(i+ROOT)%12]}
            }
        }

        let stp_R = document.getElementById("stp_"+i+"");
        let stp_X = stp_R.querySelector(".column");

        
        if (SCALE[i]==true) {
            stp_R.querySelector("button").setAttribute("onmouseover", "HIGHLIGHT('"+(NOTE[(i+ROOT)%12])+"')");
            if (TRND) {
                document.getElementById("modeslist").innerHTML += '<option value="'+(NOTE[(i+ROOT)%12])+'">'+STEP[i]+'</option>';
            } else {
                document.getElementById("modeslist").innerHTML += '<option value="'+(NOTE[(i+ROOT)%12])+'">'+NOTE[(i+ROOT)%12]+'</option>';
            }
        } else {
            stp_R.querySelector("button").setAttribute("onmouseover", '');
        }

        stp_R.querySelector("button").innerHTML = (SCALECHECK());

        if (SCALE[i]) {
            stp_R.querySelector("button").style.color = "black";
            stp_R.querySelector("button").style.background = "white";
            stp_R.onclick = "RESCALE("+i+")";
        } else {
            stp_R.querySelector("button").style.color = "white";
            stp_R.querySelector("button").style.background = "#0A0A0A";
            stp_R.querySelector("button").style.color = "#606060";
            stp_R.onclick = "RESCALE("+i+")";
        }

        stp_X.innerHTML = '';

        let HLSTRING = GETHLSTRING(i);

        if (TBLTRN) {
            document.getElementById("CHRD1").style.display = "none";
            if (SCALE[i%12]&SCALE[(i+4)%12]&SCALE[(i+7)%12]) {
                stp_X.innerHTML += (HLSTRING+'4, 7)" onclick="PLAY(\''+(i+ROOT)%12+'\', [4, 7])" style="margin-top: 10px">M<\/div>');
            } else {stp_X.innerHTML += ('<div style="margin-top: 10px">&nbsp</div>');}
            if (SCALE[i%12]&SCALE[(i+3)%12]&SCALE[(i+7)%12]) {
                stp_X.innerHTML += (HLSTRING+'3, 7)" onclick="PLAY(\''+(i+ROOT)%12+'\', [3, 7])">m<\/div>');
            } else {stp_X.innerHTML += ('<div>&nbsp</div>');}
            if (SCALE[i%12]&SCALE[(i+7)%12]) {
                stp_X.innerHTML += (HLSTRING+'7)" onclick="PLAY(\''+(i+ROOT)%12+'\', [7])">5<\/div>');
            } else {stp_X.innerHTML += ('<div>&nbsp</div>');}            
            if (SCALE[i%12]&SCALE[(i+5)%12]) {
                stp_X.innerHTML += (HLSTRING+'5)" onclick="PLAY(\''+(i+ROOT)%12+'\', [7])">4<\/div>');
            } else {stp_X.innerHTML += ('<div>&nbsp</div>');}
            if (SCALE[i%12]&SCALE[(i+4)%12]&SCALE[(i+7)%12]&SCALE[(i+10)%12]) {
                stp_X.innerHTML += (HLSTRING+'4, 7, 10)" onclick="PLAY(\''+(i+ROOT)%12+'\', [4, 7, 10])">7<\/div>');
            } else {stp_X.innerHTML += ('<div>&nbsp</div>');}
            if (SCALE[i%12]&SCALE[(i+3)%12]&SCALE[(i+7)%12]&SCALE[(i+10)%12]) {
                stp_X.innerHTML += (HLSTRING+'3, 7, 10)" onclick="PLAY(\''+(i+ROOT)%12+'\', [3, 7, 10])">m7<\/div>');
            } else {stp_X.innerHTML += ('<div>&nbsp</div>');}
            if (SCALE[i%12]&SCALE[(i+4)%12]&SCALE[(i+7)%12]&SCALE[(i+11)%12]) {
                stp_X.innerHTML += (HLSTRING+'4, 7, 11)" onclick="PLAY(\''+(i+ROOT)%12+'\', [3, 7, 11])">M7<\/div>');
            } else {stp_X.innerHTML += ('<div>&nbsp</div>');}
            if (SCALE[i%12]&SCALE[(i+4)%12]&SCALE[(i+7)%12]&SCALE[(i+9)%12]) {
                stp_X.innerHTML += (HLSTRING+'4, 7, 9)" onclick="PLAY(\''+(i+ROOT)%12+'\', [4, 7, 9])">6<\/div>');
            } else {stp_X.innerHTML += ('<div>&nbsp</div>');}
            if (SCALE[i%12]&SCALE[(i+3)%12]&SCALE[(i+7)%12]&SCALE[(i+9)%12]) {
                stp_X.innerHTML += (HLSTRING+'3, 7, 9)" onclick="PLAY(\''+(i+ROOT)%12+'\', [3, 7, 9])">m6<\/div>');
            } else {stp_X.innerHTML += ('<div>&nbsp</div>');}
            if (SCALE[i%12]&SCALE[(i+2)%12]&SCALE[(i+7)%12]) {
                stp_X.innerHTML += (HLSTRING+'2, 7)" onclick="PLAY(\''+(i+ROOT)%12+'\', [3, 6])">sus2<\/div>');
            } else {stp_X.innerHTML += ('<div>&nbsp</div>');}
            if (SCALE[i%12]&SCALE[(i+5)%12]&SCALE[(i+7)%12]) {
                stp_X.innerHTML += (HLSTRING+'5, 7)" onclick="PLAY(\''+(i+ROOT)%12+'\', [4, 8])">sus4<\/div>');
            } else {stp_X.innerHTML += ('<div>&nbsp</div>');}
            if (SCALE[i%12]&SCALE[(i+3)%12]&SCALE[(i+6)%12]) {
                stp_X.innerHTML += (HLSTRING+'3, 6)" onclick="PLAY(\''+(i+ROOT)%12+'\', [2, 7])">dim<\/div>');
            } else {stp_X.innerHTML += ('<div>&nbsp</div>');}
            if (SCALE[i%12]&SCALE[(i+4)%12]&SCALE[(i+8)%12]) {
                stp_X.innerHTML += (HLSTRING+'4, 8)" onclick="PLAY(\''+(i+ROOT)%12+'\', [5, 7])">aug<\/div>');
            } else {stp_X.innerHTML += ('<div>&nbsp</div>');}
        } else {
            document.getElementById("CHRD1").style.display = "block";
            if (SCALE[i%12]&SCALE[(i+4)%12]&SCALE[(i+7)%12]) {
                document.getElementById("MCHRDS").innerHTML += (HLSTRING+'4, 7)" onclick="PLAY(\''+(i+ROOT)%12+'\', [4, 7])"><sup>'+ STEP[i%12] +'</sup>'+ NOTE[(i+ROOT)%12]+'<\/div>');
            }
            if (SCALE[i%12]&SCALE[(i+3)%12]&SCALE[(i+7)%12]) {
                document.getElementById("MCHRDS").innerHTML += (HLSTRING+'3, 7)" onclick="PLAY(\''+(i+ROOT)%12+'\', [3, 7])"><sup>'+ STEP[i%12] +'</sup>'+ NOTE[(i+ROOT)%12] +'m<\/div>');
            }
            if (SCALE[i%12]&SCALE[(i+7)%12]) {
                document.getElementById("QCHRDS").innerHTML += (HLSTRING+'7)" onclick="PLAY(\''+(i+ROOT)%12+'\', [7])"><sup>'+ STEP[i%12] +'</sup>'+ NOTE[(i+ROOT)%12] +'5<\/div>');
            }
            if (SCALE[i%12]&SCALE[(i+5)%12]) {
                document.getElementById("QRCHRDS").innerHTML += (HLSTRING+'5)" onclick="PLAY(\''+(i+ROOT)%12+'\', [7])"><sup>'+ STEP[i%12] +'</sup>'+ NOTE[(i+ROOT)%12] +'4<\/div>');
            }
            if (SCALE[i%12]&SCALE[(i+4)%12]&SCALE[(i+7)%12]&SCALE[(i+10)%12]) {
                document.getElementById("SCHRDS").innerHTML += (HLSTRING+'4, 7, 10)" onclick="PLAY(\''+(i+ROOT)%12+'\', [4, 7, 10])"><sup>'+ STEP[i%12] +'</sup>'+ NOTE[(i+ROOT)%12] +'7<\/div>');
            }
            if (SCALE[i%12]&SCALE[(i+4)%12]&SCALE[(i+7)%12]&SCALE[(i+11)%12]) {
                document.getElementById("SCHRDS").innerHTML += (HLSTRING+'4, 7, 11)" onclick="PLAY(\''+(i+ROOT)%12+'\', [3, 7, 11])"><sup>'+ STEP[i%12] +'</sup>'+ NOTE[(i+ROOT)%12] +'M7<\/div>');
            }       
            if (SCALE[i%12]&SCALE[(i+3)%12]&SCALE[(i+7)%12]&SCALE[(i+10)%12]) {
                document.getElementById("SCHRDS").innerHTML += (HLSTRING+'3, 7, 10)" onclick="PLAY(\''+(i+ROOT)%12+'\', [3, 7, 10])"><sup>'+ STEP[i%12] +'</sup>'+ NOTE[(i+ROOT)%12] +'m7<\/div>');
            }
            if (SCALE[i%12]&SCALE[(i+4)%12]&SCALE[(i+7)%12]&SCALE[(i+9)%12]) {
                document.getElementById("SXCHRDS").innerHTML += (HLSTRING+'4, 7, 9)" onclick="PLAY(\''+(i+ROOT)%12+'\', [4, 7, 9])"><sup>'+ STEP[i%12] +'</sup>'+ NOTE[(i+ROOT)%12] +'6<\/div>');
            }
            if (SCALE[i%12]&SCALE[(i+3)%12]&SCALE[(i+7)%12]&SCALE[(i+9)%12]) {
                document.getElementById("SXCHRDS").innerHTML += (HLSTRING+'3, 7, 9)" onclick="PLAY(\''+(i+ROOT)%12+'\', [3, 7, 9])"><sup>'+ STEP[i%12] +'</sup>'+ NOTE[(i+ROOT)%12] +'m6<\/div>');
            }
            if (SCALE[i%12]&SCALE[(i+3)%12]&SCALE[(i+6)%12]) {
                document.getElementById("ACHRDS").innerHTML += (HLSTRING+'3, 6)" onclick="PLAY(\''+(i+ROOT)%12+'\', [3, 6])"><sup>'+ STEP[i%12] +'</sup>'+ NOTE[(i+ROOT)%12] +'dim<\/div>');
            }
            if (SCALE[i%12]&SCALE[(i+4)%12]&SCALE[(i+8)%12]) {
                document.getElementById("ACHRDS").innerHTML += (HLSTRING+'4, 8)" onclick="PLAY(\''+(i+ROOT)%12+'\', [4, 8])"><sup>'+ STEP[i%12] +'</sup>'+ NOTE[(i+ROOT)%12] +'aug<\/div>');
            }
            if (SCALE[i%12]&SCALE[(i+2)%12]&SCALE[(i+7)%12]) {
                document.getElementById("S2CHRDS").innerHTML += (HLSTRING+'2, 7)" onclick="PLAY(\''+(i+ROOT)%12+'\', [2, 7])"><sup>'+ STEP[i%12] +'</sup>'+ NOTE[(i+ROOT)%12] +'sus2<\/div>');
            }
            if (SCALE[i%12]&SCALE[(i+5)%12]&SCALE[(i+7)%12]) {
                document.getElementById("S4CHRDS").innerHTML += (HLSTRING+'5, 7)" onclick="PLAY(\''+(i+ROOT)%12+'\', [5, 7])"><sup>'+ STEP[i%12] +'</sup>'+ NOTE[(i+ROOT)%12] +'sus4<\/div>');
            }
        }
    }

    document.getElementById("scale").innerHTML += '';

    if (!TRND) {
        document.getElementById("TRN").innerHTML += '<button title="CHANGE NOTES LOOK TO NUMERIC" style="width: 4em;" onclick="TURN()">NUM</button>';
    } else {
        document.getElementById("TRN").innerHTML += '<button title="CHANGE NOTES LOOK TO LITERAL" style="width: 4em;" onclick="TURN()">LIT</button>';
    }
}

function TOTALRESCALE(STP) {
    if (STP) {
        SCALE.push(SCALE.shift());
    } else {
        SCALE.unshift(SCALE.pop());
    }
    REDRAW();
}

function HIGHLIGHT(N0, N1, N2, N3, N4) {

    let STP = NOTE.indexOf(N0);

    if (N1!=undefined) {
        for (i=0; i<document.getElementById("notes").getElementsByTagName("circle").length; i++) {
            document.getElementsByTagName("circle")[i].setAttribute("fill", "rgba(255, 255, 255, 0.1)");
        }
    }
    for (i=0; i<document.getElementsByClassName("note_"+NOTE[(STP+N1)%12]).length; i++) {
        document.getElementsByClassName("note_"+NOTE[(STP+N1)%12])[i].setAttribute("fill", "#FFFFFF");
    }
    for (i=0; i<document.getElementsByClassName("note_"+NOTE[(STP+N2)%12]).length; i++) {
        document.getElementsByClassName("note_"+NOTE[(STP+N2)%12])[i].setAttribute("fill", "#FFFFFF");
    }
    for (i=0; i<document.getElementsByClassName("note_"+NOTE[(STP+N3)%12]).length; i++) {
        document.getElementsByClassName("note_"+NOTE[(STP+N3)%12])[i].setAttribute("fill", "#FFFFFF");
    }
    for (i=0; i<STRINGS; i++) {
        if (document.getElementById("notes").contains(document.getElementById("notepin_"+i+""))) {
            document.getElementById("notepin_"+i+"").setAttribute("fill", "black");
        }
    }
    for (i=0; i<document.getElementsByClassName("note_"+N0).length; i++) {
        document.getElementsByClassName("note_"+N0)[i].setAttribute("fill", "red");
    }
    if (N1!=undefined) {
        for (i=0; i<12; i++) {
            if (SCALE[i]) {
                document.getElementById("stp_"+i+"").querySelector(".STEP").style.background = "#181818"
                document.getElementById("stp_"+i+"").querySelector(".STEP").style.color = "#0A0A0A";
            } else {
                document.getElementById("stp_"+i+"").querySelector(".STEP").style.color = "#181818";
            }
        }
    }
    document.getElementById("stp_"+(STP-ROOT+12)%12+"").querySelector(".STEP").style.background = "red";
    if (N1!=undefined) {document.getElementById("stp_"+(N1+STP-ROOT+12)%12+"").querySelector(".STEP").style.background = "white"}
    if (N2!=undefined) {document.getElementById("stp_"+(N2+STP-ROOT+12)%12+"").querySelector(".STEP").style.background = "white"}
    if (N3!=undefined) {document.getElementById("stp_"+(N3+STP-ROOT+12)%12+"").querySelector(".STEP").style.background = "white"}
    if (N4!=undefined) {document.getElementById("stp_"+(N4+STP-ROOT+12)%12+"").querySelector(".STEP").style.background = "white"}
}

function HIGHLIGHTRESET() {
    for (let i=0; i<document.getElementById("notes").getElementsByTagName("circle").length; i++) {
        document.getElementsByTagName("circle")[i].setAttribute("fill", "#FFFFFF");
    }

    for (let i=0; i<STRINGS; i++) {
        if (document.getElementById("notes").contains(document.getElementById("notepin_"+i+""))) {
            document.getElementById("notepin_"+i+"").setAttribute("fill", "black");
        }
    }

    for (i=0; i<12; i++) {
        if (SCALE[i]) {
            document.getElementById("stp_"+i+"").querySelector(".STEP").style.background = "#FFFFFF";
        } else {
            document.getElementById("stp_"+i+"").querySelector(".STEP").style.background = "#0A0A0A";
            document.getElementById("stp_"+i+"").querySelector(".STEP").style.color = "#606060";
        }
    }
}

function REDRAWSTRINGS(STRINGSOFF) {
    document.getElementById("strings").innerHTML = '';
    document.getElementById("btns").innerHTML = '';

    STRINGS = STRINGS+STRINGSOFF;

    if (STRINGS==13) {STRINGS=1}
    if (STRINGS==0) {STRINGS=12}  

    for (let i=0; i<STRINGS; i++) {
        document.getElementById("btns").innerHTML += '<text onmouseover="TUNEHINT()" x="3%" y="'+(GETSTRINGSWIDTH(i)+2)+'%" fill="white" text-anchor="middle" style="user-select: none;" onclick="REDRAW('+(i)+', 1); TUNECOOKIES()">\<</text><text onmouseover="TUNEHINT()" x="4.8%" y="'+(GETSTRINGSWIDTH(i)+2)+'%" fill="white" text-anchor="middle" style="user-select: none;" onclick="REDRAW('+(i)+', -1); TUNECOOKIES()">\></text>';
        document.getElementById("strings").innerHTML += ('<line x1="7.4%" y1="'+GETSTRINGSWIDTH(i)+'%" x2="95.3%" y2="'+GETSTRINGSWIDTH(i)+'%" stroke-width="'+((i+2.5)*0.3)+'" stroke="white"/>');
    } // кнопки настройки струн

    document.getElementById("btns").innerHTML += '<text x="2.5%" y="15%" fill="white" text-anchor="middle" style="user-select: none; font-size: 1.5em;" onclick="FULLOFF(1)">\<</text><text x="5.3%" y="15%" fill="white" text-anchor="middle" style="user-select: none; font-size: 1.5em;" onclick="FULLOFF(-1)">\></text>'
    REDRAW();
    TUNECOOKIES();
} // перерисовка струн

for (let i=0; i<FRETS; i++) {
    document.getElementById("frets").innerHTML += ('<line x1="'+(8+5.8*i-(i*(0.1^(i-1))*0.094))+'%" y1="19%" x2="'+(8+5.8*i-(i*(0.1^(i-1))*0.094))+'%" y2="91%" stroke="white"/>');
} // отрисовка ладов

function TABLE() {
    if (TBLTRN) {
        document.getElementById("tabletrn").innerHTML = 'TABLE&nbsp▼';
    } else {
        document.getElementById("tabletrn").innerHTML = 'LIST&nbsp▲';
    }
    TBLTRN=!TBLTRN;
    REDRAW();
}

function SELECTMODE(umode) {
    for (i=0; i<(((NOTE.indexOf(umode))-ROOT+12)%12); i++) { 
        SCALE.push(SCALE.shift());
    }
    ROOT = NOTE.indexOf(umode);
    REDRAW();
}

let THMCH = false;

function THEME() {
    if (!THMCH) {
        document.getElementsByTagName("body")[0].style.background = "white";
        document.getElementsByTagName("body")[0].style.filter = "invert()";
        document.getElementById("MSG").style.display = "none";
    } else {
        document.getElementsByTagName("body")[0].style.background = "black";
        document.getElementsByTagName("body")[0].style.filter = "none";
        document.getElementById("MSG").style.display = "block";
    }
    THMCH=!THMCH;
}

document.getElementById("stringsquant")
document.getElementById("frets").innerHTML += ('\
    <text class="fretpoints" x="22.1%" y="17%" text-anchor="middle" style="font-size: 0.7em; font-family: Incosalanta; user-select: none;" fill="white">•</text>\
    <text class="fretpoints" x="32.55%" y="17%" text-anchor="middle" style="font-size: 0.7em; font-family: Incosalanta; user-select: none;" fill="white">•</text>\
    <text class="fretpoints" x="63.3%" y="17%" text-anchor="middle" style="font-size: 0.7em; font-family: Incosalanta; user-select: none;" fill="white">••</text>\
    <text class="fretpoints" x="73.6%" y="17%" text-anchor="middle" style="font-size: 0.7em; font-family: Incosalanta; user-select: none;" fill="white">•</text>\
    <text class="fretpoints" x="79.6%" y="17%" text-anchor="middle" style="font-size: 0.7em; font-family: Incosalanta; user-select: none;" fill="white">•</text>\
    <text class="fretpoints" x="94.6%" y="17%" text-anchor="middle" style="font-size: 0.7em; font-family: Incosalanta; user-select: none;" fill="white">••</text>\
    <text class="fretpoints" x="22.1%" y="96%" text-anchor="middle" style="font-size: 0.7em; font-family: Incosalanta; user-select: none;" fill="white">•</text>\
    <text class="fretpoints" x="32.55%" y="96%" text-anchor="middle" style="font-size: 0.7em; font-family: Incosalanta; user-select: none;" fill="white">•</text>\
    <text class="fretpoints" x="63.3%" y="96%" text-anchor="middle" style="font-size: 0.7em; font-family: Incosalanta; user-select: none;" fill="white">••</text>\
    <text class="fretpoints" x="73.6%" y="96%" text-anchor="middle" style="font-size: 0.7em; font-family: Incosalanta; user-select: none;" fill="white">•</text>\
    <text class="fretpoints" x="79.6%" y="96%" text-anchor="middle" style="font-size: 0.7em; font-family: Incosalanta; user-select: none;" fill="white">•</text>\
    <text class="fretpoints" x="94.6%" y="96%" text-anchor="middle" style="font-size: 0.7em; font-family: Incosalanta; user-select: none;" fill="white">••</text>');
document.getElementById("frets").innerHTML += ('<line x1="7.8%" y1="18%" x2="7.8%" y2="92%" stroke="white"/>'); // нулевой лад

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

if (getCookie("TUNE")!=undefined) {
    TUNEIN(getCookie("TUNE"));
} else {
    REDRAWSTRINGS(0);
}

let HNTLCH = false;

function HINTLOOK() {
    HNTLCH=!HNTLCH;
    if (HNTLCH) {
        document.getElementById("hintlook").innerHTML = '▲';
        document.getElementById("printhint").style.display = 'block';
    } else {
        document.getElementById("hintlook").innerHTML = '▼';
        document.getElementById("printhint").style.display = 'none';
    }
}

function REMODE(way) {
    let step = 0;
    if (way==1) {
        SCALE.push(SCALE.shift());
    } else {
        SCALE.unshift(SCALE.pop());
    }
    ROOT = (ROOT+way+12)%12;
    function STEPPER() {
        if (!SCALE[0]) {
            if (way==1) {
                SCALE.push(SCALE.shift());
            } else {
                SCALE.unshift(SCALE.pop());
            }
            ROOT = (ROOT+way+12)%12;
            STEPPER();
        }
    }
    STEPPER();
    REDRAW();
}

function GETSTRINGSWIDTH(i) {
    return (17.5+(50/STRINGS*(i+0.5)*1.5));
} // возвращает толщину грифа

function GETHLSTRING(i) {
    return '<div onmouseout="HIGHLIGHTRESET()" onmouseover="HIGHLIGHT(\''+NOTE[(i+ROOT)%12]+'\', ';
} // фрагмент тега аккорда

function MAILCOPY() {if (confirm('Скопировать "flagrantior@mail.com" в буфер?')) {navigator.clipboard.writeText('flagrantior@mail.com')}} // копировать email в буфер?

function ALTER() {
    if (alter=='b') {alter = '#'; NOTE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']}
        else {alter = 'b'; NOTE = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']}

    if (NNAM[0]=='C') {NNAM = NOTE}
    document.getElementById("rootslist").querySelectorAll("option")[1].innerHTML = NOTE[1];
    document.getElementById("rootslist").querySelectorAll("option")[3].innerHTML = NOTE[3];
    document.getElementById("rootslist").querySelectorAll("option")[6].innerHTML = NOTE[6];
    document.getElementById("rootslist").querySelectorAll("option")[8].innerHTML = NOTE[8];
    document.getElementById("rootslist").querySelectorAll("option")[10].innerHTML = NOTE[10];
    document.getElementById("alter").innerHTML = alter;
    REDRAW();
} // альтерация

function TUNEHINT() {
    document.getElementById("tune").style.animation = "scale 1s ease-in-out";
}






// class Sound {
//     constructor(context) {this.context = context}

//     setup() {
//         this.oscillator = this.context.createOscillator();
//         this.gainNode = this.context.createGain();
//         this.oscillator.connect(this.gainNode);
//         this.gainNode.connect(this.context.destination);
//         this.oscillator.type = "triangle";
//     }

//     play(value) {
//         this.setup();
//         this.oscillator.frequency.value = value;
//         this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
//         this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.02);
//         this.oscillator.start(this.context.currentTime);
//         this.stop(this.context.currentTime);
//     }

//     stop() {
//         this.gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 1.1);
//         this.oscillator.stop(this.context.currentTime + 1.1);
//     }
// }

// let context = new (window.AudioContext || window.webkitAudioContext)();

// function PLAY(N0, CHORD) {
//     // N0 = Number(N0);
//     // let sound = new Sound(context);
//     // sound.play(FREQ[N0]);
//     // for (i=0; i<CHORD.length; i++) {
//     // let sound = new Sound(context);
//     // let j = i;
//     // setTimeout(() => sound.play(FREQ[N0+CHORD[j]]), 75*(i+1));
//     // }
//     // sound.stop();
// }

// let FREQ = [130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185, 196, 207.65, 220, 233.08, 246.94, 261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392, 415.3, 440, 466.16, 493.88];
// // let FREQ = [130.81, 139.59, 140.59, 147.83, 156.56, 157.56, 165.81, 175.61, 185, 186, 196, 208.65, 208.65, 220, 234.08, 235.08, 247.94, 262.63, 278.18, 279.18, 294.66, 312.13, 313.13, 330.63, 350.23, 370.99, 370.99, 392, 416.3, 416.3, 440, 467.16, 468.16, 494.88, 524.25, 555.37, 556.37, 588.33, 623.25, 624.25, 660.25, 699.46, 740.99, 741.99, 784.99, 831.61, 831.61, 880, 933.33, 933.33, 988.77, 1047.5, 1109.73, 1110.73, 1175.66, 1245.51, 1246.51, 1319.51, 1397.91, 1480.98, 1481.98, 1568.98, 1662.22, 1663.22, 1760, 1864.66, 1865.66, 1975.53]


function TUNECOOKIES() {
    let TUNECOOKIE = '';
    for (let i=STRINGS-1; i>-1; i--) {
        TUNECOOKIE += NOTE[((OFST[i]+24+TOFS[i]))%12];
    }
    document.cookie = "TUNE="+TUNECOOKIE;
}