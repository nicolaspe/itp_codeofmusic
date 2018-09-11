let sound;
let amplitude = new p5.Amplitude()

function preload(){
  sound = loadSound("sounds/wine.wav");
}

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
  // sound.play();
}

function draw() {
  background(255, 255, 255, 120);
  let rot = map(sound.currentTime(), 0., sound.duration(), 0., TWO_PI);
  let r_size = map(amplitude.getLevel(), 0., 1., 50., 500.);

  fill(180, 0, 250);
  noStroke();

  push();
  translate(width/2, height/2);
  rotate(rot);
  rect(0, 0, r_size, r_size);
  pop();
}

function keyPressed(){
  switch(key){
    case 'a':
      sound.play();
      break;
    default:
      false;
	}

}
