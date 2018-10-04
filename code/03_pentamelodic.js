/* melodic
 * assignment #03
 * the code of music
 * NYU's ITP, fall 2018
 * nicolás escarpentier
 */


// === INITIALIZATION ===
// audio variables
let ppqn = 0;   // pulses per quarter note
let beat = 0;   // = quarter note
let sign = 4;   // time signature over 4ths

let arpeggios = [];
let sched_ids = [];
let speed_sl  = [];
let arp_index = [];
let pentaton  = [
  ["A2", "C3", "D3", "E3", "G3"],
  ["C3", "D3", "E3", "G3", "A3"],
  ["D4", "E4", "G4", "A4", "C5"],
  ["E4", "G4", "A4", "C5", "D5"],
  ["G5", "A5", "C6", "D6", "E6"]
];
let play_func;
let synty;


// graphics & interaction variables
let block_size = 60;
let hue = 259;
let hover = [];
let activ = [];


// function that replicates MIDI's beat clock
function beat_clock(){
  ppqn++;
  if (ppqn >= 24){
    ppqn = 0;
    ++beat;
  }
}


function setup( ){
  createCanvas( 720, 360 );

  // modes setup
  colorMode(HSB, 360, 100, 100);
  rectMode(CENTER);
  ellipseMode(CENTER);
  textFont("Monaco");

  // Tone
  // to access timing in Tone.Transport
  // '1i' : each tick = ppqn
  // '4n' : quarter note
  // '8t' : eigth-note triplet
  Tone.Transport.bpm = 120;
  Tone.Transport.swing = 0;
  Tone.Transport.timeSignature = sign;
  Tone.Transport.loopStart = 0;
  Tone.Transport.PPQ = 192;
  Tone.Transport.scheduleRepeat(beat_clock, "8i");

  synty = new Tone.Synth().toMaster();

  for ( let i=0; i<5; i++ ) {
    arpeggios[i] = [];
    sched_ids[i] = 0;
    arp_index[i] = 0;
    activ[i] = false;
    hover[i] = false;
  }
  play_func = [
    play_arp_0,
    play_arp_1,
    play_arp_2,
    play_arp_3,
    play_arp_4
  ];

  Tone.Transport.start();
}


function draw() {
  background(hue, 20, 100);

  update_sliders();
  detect_mouse();
  draw_grid();
}


// === INTERACTION & SOUND
function update_sliders(){
  for ( let i=0; i<5; i++ ) {
    for ( let j=0; j<3; j++ ) {
      let slider_id = 'arp_' + i + j;
      let note_ind = document.getElementById(slider_id).value
      arpeggios[i][j] = pentaton[i][ note_ind ];
    }
    speed_sl[i] = document.getElementById("speed_" + i).value;
  }
}

function detect_mouse() {
  // base notes
  for ( let i=0; i<5; i++ ) {
    let pos_x = i*width/5 + width/10; // center of the corresponding fifth
    let pos_y = 2* height/4;

    let d = dist(mouseX, mouseY, pos_x, pos_y)

    if( d < block_size * 0.8 ) { hover[i] = true; }
    else { hover[i] = false; }
  }
}
function mousePressed() {
  for ( let i=0; i<5; i++ ) {
    if ( hover[i] ){
      // if inactive, activate and play!
      if ( !activ[i] ){
        activ[i] = true;
        let timing = speed_sl[i] *8;
        let interval = '' + timing + 'i';
        sched_ids[i] = Tone.Transport.scheduleRepeat(play_func[i], interval);
      } else {
        activ[i] = false;
        Tone.Transport.clear( sched_ids[i] );
      }
    }
  }
}

function play_arp_0(){
  let note = arpeggios[0][ arp_index[0] ];
  let dur = speed_sl[0] *4;
  synty.triggerAttackRelease(note, dur+'i');

  arp_index[0]++;
  if( arp_index[0] > 2 ) { arp_index[0] = 0; }
}
function play_arp_1(){
  let note = arpeggios[1][ arp_index[1] ];
  let dur = speed_sl[1] *4;
  synty.triggerAttackRelease(note, dur+'i');

  arp_index[1]++;
  if( arp_index[1] > 2 ) { arp_index[1] = 0; }
}
function play_arp_2(){
  let note = arpeggios[2][ arp_index[2] ];
  let dur = speed_sl[2] *4;
  synty.triggerAttackRelease(note, dur+'i');

  arp_index[2]++;
  if( arp_index[2] > 2 ) { arp_index[2] = 0; }
}
function play_arp_3(){
  let note = arpeggios[3][ arp_index[3] ];
  let dur = speed_sl[3] *4;
  synty.triggerAttackRelease(note, dur+'i');

  arp_index[3]++;
  if( arp_index[3] > 2 ) { arp_index[3] = 0; }
}
function play_arp_4(){
  let note = arpeggios[4][ arp_index[4] ];
  let dur = speed_sl[4] *4;
  synty.triggerAttackRelease(note, dur+'i');

  arp_index[4]++;
  if( arp_index[4] > 2 ) { arp_index[4
  ] = 0; }
}


// === GRAPHICS
function draw_grid() {
  // base notes
  for ( let i=0; i<5; i++ ) {
    let pos_x = i*width/5 + width/10; // center of the corresponding fifth
    let pos_y = 2* height/4;
    let dy = Math.sin( ( frameCount/10 -2*i ) /3 ) *2;

    push();
    translate(pos_x, pos_y +dy);
    if ( activ[i] ) { draw_block(80); }
    else if ( hover[i] ) { draw_block(30); }
    else { draw_block(0); }
    pop();
  }
  // text
  for ( let i=0; i<5; i++ ) {
    let pos_x = i*width/5 + width/10; // center of the corresponding fifth
    let pos_y = 10* height/15;

    push();
    translate(pos_x, pos_y);
    fill(hue, 50, 50);
    textSize(14);
    text(i+1, -2, 0);
    pop();
  }

}
function draw_block(sat) {
  noStroke();
  fill( hue-120, 0, 70 );
  ellipse(4, 4, block_size, block_size);
  ellipse(2, 2, block_size, block_size);
  fill( hue-120, sat, 100 );
  ellipse(0, 0, block_size, block_size);
}
