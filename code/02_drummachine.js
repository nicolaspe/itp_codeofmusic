/* drum machine
 * assignment #02
 * the code of music
 * NYU's ITP, fall 2018
 * nicolás escarpentier
 */

// === INITIALIZATION ===
// audio variables
let ppqn = 0;   // pulses per quarter note
let beat = 0;   // = quarter note
let sign = 4;   // time signature over 4ths
let audio_grid = [];
let audio_sampl = [];
let audio_files = ["../media/samps/k_Evil808.wav",
                  "../media/samps/k_Pitchy808.wav",
                  "../media/samps/k_Saturate808.wav",
                  "../media/samps/k_Bow808.wav",
                  "../media/samps/Ride_04.wav",
                  "../media/samps/Stabs_02.wav"];


// tone.js stuff
Tone.Transport.bpm.value = 140;
Tone.Transport.timeSignature = [4,4];
Tone.Transport.scheduleRepeat(beat_clock, "8i");

// graphics variables
let blocks, block_size, block_spacing;
let char_pos;
let hue = 259;



// === PRELOAD ===
function preload(){

}



// === SETUP
function setup(){
  createCanvas(window.innerWidth, window.innerHeight);

  // variables init
  blocks = createVector(6, 16);
  block_size = 40;
  block_spacing = 20;

  // modes setup
  colorMode(HSB, 360, 100, 100);
  rectMode(CENTER);
  ellipseMode(CENTER);
  textFont("Monaco");

  // audio init
  for ( let i = 0; i < blocks.y; i++ ) {
    audio_grid[i] = [];
  }
  // go over every beat
  for ( let i = 0; i < blocks.y; i++ ) {
    // and check every instrument on that beat
    for ( let j = 0; j < blocks.x; j++ ) {
      if ( random(100) < 30 ) { audio_grid[i][j] = true; }
      else { audio_grid[i][j] = false }
    }
  }

  // go over every instrument to instantiate it
  for ( let j = 0; j < blocks.x; j++ ) {
    audio_sampl[j] = new Tone.Player( audio_files[j] );
    audio_sampl[j].toMaster();
  }

  Tone.Transport.start();
}



// === LOOP
function draw(){
  background(hue, 10, 100);
  hue += 0.05;

  draw_beat();
  draw_grid();
}



// === MUSIC
// function that replicates MIDI's beat clock
function beat_clock(){
  ppqn++;
  if (ppqn >= 24){
    ppqn = 0;
    beat = ( ++beat )%16;

    // check for this beat on every isntrument
    for ( let j = 0; j < blocks.x; j++ ) {
      if ( audio_grid[beat][j] && audio_sampl[j].loaded ) {
        audio_sampl[j].start();
      }
    }
  }

}




// === GRAPHICS
function draw_grid() {
  let total_blocks = blocks.x*blocks.y;
  let pos_x0 = (width  -(block_size + block_spacing)*blocks.y +block_spacing*2)/2;
  // let pos_y0 = (height -(block_size + block_spacing)*blocks.x)/2;
  let pos_y0 = 80;

  for (let i = 0; i < blocks.y; i++) {
    for (let j = 0; j < blocks.x; j++) {
      // calc coordinates
      let x = pos_x0 + i *(block_size + block_spacing);
      let y = pos_y0 + j *(block_size + block_spacing);
      let dy = Math.sin( ( frameCount/10 -2*i -2*j ) /3 ) *1.5;
      if ( i == beat ){ dy = -5; }
      // translation & draw
      push();
      translate(x, y+dy);
      let sat = 0;
      if ( audio_grid[i][j] ) { sat = 50; }
      draw_block(sat);
      pop();
    }
  }
}

function draw_block(sat) {
  noStroke();
  fill( hue+180, 0, 70 );
  rect(4, 4, block_size, block_size);
  rect(2, 2, block_size, block_size);
  fill( hue+180, sat, 100 );
  rect(0, 0, block_size, block_size);
}

function draw_beat() {
  text(beat, 20, 20);

  let pos_x0 = (width  -(block_size + block_spacing)*blocks.y +block_spacing*2)/2;
  let x = pos_x0 + beat *(block_size + block_spacing);
  let blocks_hei = (block_size + block_spacing)*blocks.x -block_spacing*1.5;
  // translation & draw
  push();
  translate(x, 80);
  noStroke();
  fill(hue, 40, 100);
  rect(0, blocks_hei/2, block_size*1.4, blocks_hei);
  pop();

}
