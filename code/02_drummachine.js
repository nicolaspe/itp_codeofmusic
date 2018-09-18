
let kick = new Tone.Player("../media/loops/135_Pads.wav")
kick.toMaster();

Tone.Transport.scheduleRepeat(playBeat, "0.5s");
Tone.Transport.start();
Tone.Transport.bpm.value = 120;

// === PRELOAD ===
function preload(){

}

// === SETUP ===
function setup(){

}

// === LOOP ===
function draw(){

}
