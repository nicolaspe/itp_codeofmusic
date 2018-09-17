/* jumping sampler
 * assignment #01
 * the code of music
 * NYU's ITP, fall 2018
 * nicolás escarpentier
 */

// === INITIALIZATION ===
// audio variables
let samps = [];
let loops = []
let samp_files = ["../media/samps/Alien_FX.wav",
                  "../media/samps/Bells_01.wav",
                  "../media/samps/Bounce_01.wav",
                  "../media/samps/Chords_9.wav",
                  "../media/samps/Chords_11.wav",
                  "../media/samps/Drizzy_01.wav",
                  "../media/samps/Fan_01.wav",
                  "../media/samps/Fan_034.wav",
                  "../media/samps/k_Bow808.wav",
                  "../media/samps/k_Evil808.wav",
                  "../media/samps/k_Pitchy808.wav",
                  "../media/samps/k_Saturate808.wav",
                  "../media/samps/Lick_5.wav",
                  "../media/samps/Maxo_01.wav",
                  "../media/samps/Piano_01.wav",
                  "../media/samps/Piano_02.wav",
                  "../media/samps/Pierre_03.wav",
                  "../media/samps/Ride_04.wav",
                  "../media/samps/Stabs_02.wav",
                  "../media/samps/ZayLead_02.wav"];
let loop_files = ["../media/loops/108_The_Code-F.wav",
                  "../media/loops/134_Allure.wav",
                  "../media/loops/135_Pads.wav",
                  "../media/loops/140_Ten_Years_From_Now-F.wav",
                  "../media/loops/145_JazzyPad.wav",
                  "../media/loops/150_Raindrops-A.wav"];
let amplitude = new p5.Amplitude()

// graphics variables
let blocks, block_size, block_spacing;
let char_pos;
let hue = 259;



// === PRELOAD ===
function preload(){
  shuffle(samp_files, true);
  for (let i = 0; i < samp_files.length; i++) {
    samps[i] = loadSound(samp_files[i]);
  }
  shuffle(loop_files, true);
  for (let i = 0; i < loop_files.length; i++) {
    loops[i] = loadSound(loop_files[i]);
  }
}



// === SETUP ===
function setup() {
  createCanvas(720, 480);

  // variables init
  blocks = createVector(4, 5);
  block_size = 50;
  block_spacing = 40;

  char_pos = createVector(2, 1);

  // modes setup
  colorMode(HSB, 360, 100, 100);
  rectMode(CENTER);
  ellipseMode(CENTER);

  // start loop
  loops[0].loop();
}



// === LOOP ===
function draw() {
  background(hue, 10, 100);

  draw_grid();
  draw_char();
}



// === GRAPHICS ===
function draw_grid(){
  let total_blocks = blocks.x*blocks.y;

  for (let i = 0; i < blocks.y; i++) {
    for (let j = 0; j < blocks.x; j++) {
      // calc coordinates
      let x = 180 + i *(block_size + block_spacing);
      let y = 120 + j *(block_size + block_spacing);
      let dy = Math.sin((frameCount/10-2*i-2*j)/3)*2;
      // translation & draw
      push();
      translate(x, y+dy);
      draw_block();
      pop();
    }
  }
}

function draw_block(){
  noStroke();
  fill(0, 0, 70);
  rect(4, 4, block_size, block_size);
  rect(2, 2, block_size, block_size);
  fill(0, 0, 100);
  rect(0, 0, block_size, block_size);
}

function draw_char(){
  let i = char_pos.x;
  let j = char_pos.y;
  let x = 180 + i *(block_size + block_spacing);
  let y = 120 + j *(block_size + block_spacing);
  let dy = Math.sin((frameCount/10-2*i-2*j)/3)*2;
  // translation & draw
  push();
  translate(x, y+dy);
  noStroke();
  fill(44, 40, 80);
  ellipse(1, 1, 20, 20);
  fill(44, 40, 100);
  ellipse(0, 0, 20, 20);
  pop();
}


// === INTERACTION ===
function keyPressed(){
  let new_pos = char_pos.copy();
  // move character
  switch(key){
    case 'w':
      new_pos.y = constrain(char_pos.y-1, 0, blocks.x-1);
      break;
    case 'a':
      new_pos.x = constrain(char_pos.x-1, 0, blocks.y-1);
      break;
    case 's':
      new_pos.y = constrain(char_pos.y+1, 0, blocks.x-1);
      break;
    case 'd':
      new_pos.x = constrain(char_pos.x+1, 0, blocks.y-1);
      break;
    case' ': // change loop!
      change_loop();
      break;
    default:
      false;
	}
  // replicate for arrow keys
  switch(keyCode){
    case UP_ARROW:
      new_pos.y = constrain(char_pos.y-1, 0, blocks.x-1);
      break;
    case LEFT_ARROW:
      new_pos.x = constrain(char_pos.x-1, 0, blocks.y-1);
      break;
    case DOWN_ARROW:
      new_pos.y = constrain(char_pos.y+1, 0, blocks.x-1);
      break;
    case RIGHT_ARROW:
      new_pos.x = constrain(char_pos.x+1, 0, blocks.y-1);
      break;
    default:
      false;
  }
  // play sound if it moved
  if(new_pos.x != char_pos.x || new_pos.y != char_pos.y){
    let ind = new_pos.x + new_pos.y * blocks.y;
    samps[ind].play();
    // update character position
    char_pos = new_pos.copy();
  }
}


function change_loop(){
  // stop all the loops
  for (let i = 0; i < loops.length; i++) {
    loops[i].stop();
  }
  // get a random one and play it
  let ind = floor(random(loops.length));
  hue = floor(random(220, 350));
  loops[ind].loop();
}
