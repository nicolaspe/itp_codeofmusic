/* space sequencer
 * nicolás escarpentier
*/

// global threejs variables
let container, renderer, camera, scene;
let p_light;
let instruments, steps, seq_radius, total_steps;
let colors = [ 0xdd88dd, 0x8899dd, 0x9966cc, 0xbb88ff ];
let mouse, raycaster;

// Tonejs variables
let ppqn, beat;
let scale, scale_base, scale_modes;
let synths;

// DOM variables
let bpm, timesig, subdiv, bars, baseNote, bases, octave;
let label_bpm, label_timesig, label_subdiv, label_bars, label_oct;

window.addEventListener('load', init);


// === INITIALIZATION
function init(){
	container = document.querySelector('#sketch');
	let wid = window.innerWidth;
	let hei = window.innerHeight *.7;

	// THREE INITIALIZATION
	renderer = new THREE.WebGLRenderer({ });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(wid, hei);
	container.appendChild(renderer.domElement);

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xeeeeee );

	camera = new THREE.PerspectiveCamera(60, wid/hei, 0.1, 5000);
	// camera.position.set( 300, 200, 300 );
  // camera.lookAt( 10, 0, 0 );

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.update();

  mouse     = new THREE.Vector2();
  raycaster = new THREE.Raycaster();

	// Initialize (Web)VR
  renderer.vr.enabled = true;
	vrButton = WEBVR.createButton( renderer );
	document.getElementById('vr_button').appendChild( vrButton );
	window.addEventListener('vrdisplaypresentchange', onWindowResize, true);

  // TONE INITIALIZATION
  bpm = 120;
  timesig = 4;
  bars = 4;
  beat = 0;
  baseNote = 9;
  octave = 4;
  refreshScale();

  Tone.Transport.bpm = bpm;
  Tone.Transport.scheduleRepeat(beatStep, "4n");

  // events and more inits
	window.addEventListener('resize', onWindowResize, true );
  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('click', onMouseMove, false);
  window.addEventListener('keypress', onKeyPress, true );

  domInit();
	createEnvironment();
  createSounds();
  Tone.Transport.start();
	animate();
}
function domInit() {
  bases = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  modes = ["major", "minor"];

  label_bpm = document.querySelector('#bpm');
  label_timesig = document.querySelector('#timesig');
  label_bars = document.querySelector('#bars');
  label_scale = document.querySelector('#scale');
  label_mode = document.querySelector('#mode');
  label_oct = document.querySelector('#octave');
}



// === EVENTS & DOM
function onWindowResize(){
  let wid = window.innerWidth;
  let hei = window.innerHeight;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(wid, hei);
	camera.aspect = wid/hei;
  camera.updateProjectionMatrix();
}
function onMouseMove( event ) {
  // mouse position in normalized coordinates
  mouse.x =  (event.clientX / window.innerWidth) *2 -1;
  mouse.y = -(event.clientY / (window.innerHeight*.7))*2 +1;
}
function onClick(){
  inters = raycasting();

  if( inters.length > 0 ) {
    if( !inters[0].object.play ) {
      let step_id = inters[0].object.step_id;
    } else {
      let step_id = inters[0].object.step_id;
    }
  }
}
function onKeyPress( event ) {
  inters = raycasting();

  if( inters.length > 0 ) {
    let id = inters[0].object.global_id;
    let key = parseInt( event.keyCode );
    switch (key) {
      case 49: // 1
        setNote(id, 0);
        break;
      case 50: // 2
        setNote(id, 1);
        break;
      case 51: // 3
        setNote(id, 2);
        break;
      case 52: // 4
        setNote(id, 3);
        break;
      case 53: // 5
        setNote(id, 4);
        break;
      case 54: // 6
        setNote(id, 5);
        break;
      case 55: // 7
        setNote(id, 6);
        break;
      case 56: // 8
        setNote(id, 7);
        break;
      case 48: // 0
        steps[id].note = [];
        steps[id].play = false;
        steps[id].position.y = 20;
        steps[id].material.color.set( 0x222222 );
        steps[id].material.opacity = 0.5;
        break;
      default:
        break;
    }
  }
}
function setNote(id, scale_id){
  steps[id].note[0] = scale_id;
  steps[id].play = true;
  // steps[id].position.y = 20 + scale_id * 2;
  steps[id].material.color.set( 0xffbb77 );
  steps[id].material.opacity = 1.0;
}

function bpmChange( num ) {
  bpm = Math.min(  Math.max(bpm + num, 60), 240 );
  Tone.Transport.bpm.value = bpm;
  label_bpm.textContent = bpm;
}
function bpmUp1() { bpmChange(1);   }
function bpmUp5() { bpmChange(5);   }
function bpmUpX() { bpmChange(10);  }
function bpmDown1() { bpmChange(-1);  }
function bpmDown5() { bpmChange(-5);  }
function bpmDownX() { bpmChange(-10); }

function timesigUp() {
  timesig = Math.min(++timesig, 7);
  Tone.Transport.timeSignature = timesig;
  label_timesig.textContent = timesig;
}
function timesigDown() {
  timesig = Math.max(--timesig, 2);
  Tone.Transport.timeSignature = bpm;
  label_timesig.textContent = timesig;
}
function barsUp() {
  bars = Math.min(++bars, 8);
  label_bars.textContent = bars;
}
function barsDown() {
  bars = Math.max(--bars, 2);
  label_bars.textContent = bars;
}
function scaleUp() {
	baseNote = (++baseNote) % 12;
	label_scale.textContent = bases[baseNote];
	refreshScale();
}
function scaleDown() {
	--baseNote;
	if( baseNote<0 ) { baseNote = 11; }
	label_scale.textContent = bases[baseNote];
	refreshScale();
}
function modeUp() {
	// get current mode & index
	let currMode = label_mode.textContent;
	let mode_id = modes.indexOf(currMode);
	// mode +1
	mode_id = (++mode_id) % modes.length;
	// refresh label and pointer
	mode = modes[mode_id];
	label_mode.textContent = mode;
}
function modeDown(){
	// get current mode & index
	let currMode = label_mode.textContent;
	let mode_id = modes.indexOf(currMode);
	// mode +1
	--mode_id;
	if( mode_id<0 ) { mode_id = modes.length-1; }
	// refresh label and pointer
	mode = modes[mode_id];
	label_mode.textContent = mode;
}
function octUp() {
	octave = Math.min(++octave, 7);
  label_oct.textContent = octave;
	refreshScale();
}
function octDown() {
	octave = Math.max(--octave, 1);
	label_oct.textContent = octave;
	refreshScale();
}
function refreshScale() {
	scale_base = 12 + baseNote + (12 * octave);
	console.log("base note: ", scale_base);
}



// === ANIMATION
function animate() {
  renderer.setAnimationLoop( render );
}
function render(){
  raycasting();

  renderer.render( scene, camera );
}
function raycasting(){
	// set raycaster
	mouse.x = 0;
	mouse.y = 0;
  raycaster.setFromCamera( mouse, camera );
  // get intersecting elements
  let intersects = raycaster.intersectObjects( steps );
  // return all elements scale
  for (let i = 0; i < steps.length; i++) {
    steps[i].scale.set(1.0, 1.0, 1.0);
  }
  // "highlight" by scaling intersected elements
  for (let i = 0; i < intersects.length; i++) {
    intersects[i].object.scale.set(1.2, 1.2, 1.2);
  }
  return intersects;
}

// function updateLight(){
//   let angle = 0.5 * (2*Math.PI)/total_steps - 0.5*Math.PI;
//   angle += beat * (2*Math.PI)/total_steps;
//   let pos_x = seq_radius * Math.cos( angle );
//   let pos_z = seq_radius * Math.sin( angle );
//   p_light.position.set(pos_x, 0, pos_z);
// }



// === ENVIRONMENT
function createEnvironment(){
	// SKYDOME
  let sky_geo = new THREE.SphereGeometry(1000, 36, 24);
  let sky_mat = new THREE.MeshBasicMaterial({
    color: 0xbb88ff,
    wireframe: true,
    side: THREE.BackSide
  });
  var skydome = new THREE.Mesh(sky_geo, sky_mat);
  scene.add(skydome);

  // LIGHTS!
	let d_light = new THREE.DirectionalLight(0xffffff, 1.2);
	scene.add(d_light);

	p_light = new THREE.PointLight(0xffffff, 1, 800, 2);
	p_light.position.set(0, 100, 0);
	scene.add(p_light);


  // CREATE INSTRUMENTS
	let global_id = 0;
	instruments = [];
	steps = [];
  for (let j = 0; j < 4; j++) {
    // base
    let cyl_geo = new THREE.CylinderGeometry(130, 130, 8, 40, 1);
    let cyl_mat = new THREE.MeshLambertMaterial({
      color: colors[j]
  	});
    let ref_cyl = new THREE.Mesh( cyl_geo, cyl_mat );
    ref_cyl.position.set( 0, -20, 0 );
    scene.add(ref_cyl);

    // sound spheres
		let instr_steps = [];
    seq_radius = 100;
    total_steps = bars * timesig;
    let angle = -0.5 * (2*Math.PI)/total_steps - 0.5*Math.PI;

    for( let i = 0; i < total_steps; i++ ) {
      let sph_geo = new THREE.SphereGeometry(6, 12, 12);
      let sph_mat = new THREE.MeshLambertMaterial({
        opacity: 0.5,
        transparent: true,
        color: 0x222222,
        emissive: 0x222222
      });
      let step = new THREE.Mesh( sph_geo, sph_mat );
      step.step_id = i;
			step.instrument = j;
			step.octave = j-2;
			step.global_id = global_id++;
      step.note = [];
      step.play = false;
      step.visible = true;

      angle += (2*Math.PI)/total_steps;
      let pos_x = seq_radius * Math.cos( angle );
      let pos_z = seq_radius * Math.sin( angle );
      step.position.set( pos_x, 20, pos_z );

      ref_cyl.add(step);
      steps.push(step);
			instr_steps.push(step);
  	}
		instruments.push( instr_steps );

		let ref_x = 400 * Math.sin( Math.PI/2 *j );
		let ref_z = 400 * Math.cos( Math.PI/2 *j );
    let rot_x = Math.PI/3 * -Math.cos( Math.PI/2 *j );
    let rot_z = Math.PI/3 * Math.sin( Math.PI/2 *j );
		ref_cyl.position.set( ref_x, -20, ref_z );
    ref_cyl.rotation.set( rot_x, 0, rot_z );
  }
}


// === SOUND
function beatStep() {
  beat = ++beat % total_steps;

	for (let i = 0; i < instruments.length; i++) {
		for (let j = 0; j < instruments[i].length; j++) {
			if( j==beat ){
				instruments[i][j].position.y = 35;
			} else {
				instruments[i][j].position.y = 20;
			}
		}
  }

  for (let i = 0; i < instruments.length; i++) {
    if( instruments[i][beat].play ){
      let scale_pos = instruments[i][beat].note[0];
			let oct = instruments[i][beat].octave;
      let midiNote = scale_base + scale_modes[mode][ scale_pos ] + (12*oct);
      let freq = Tone.Frequency( midiNote, "midi" );
      synths[i].triggerAttackRelease( freq, "8n" );
    }
  }
}
function createSounds() {
  scale_modes = {
    "major": [0, 2, 4, 5, 7, 9, 11, 12],
    "minor": [0, 2, 3, 5, 7, 8, 10, 12]
  };
  mode = "minor";

  synths = [];

  let synth_1 = new Tone.PolySynth({
    polyphony  : 7 ,
    volume  : 0 ,
    detune  : 0 ,
    voice  : Tone.FMSynth
    }
  ).toMaster();
  synths.push(synth_1);

	let synth_sq = new Tone.PolySynth( 5, Tone.MonoSynth ).toMaster();
	synth_sq.set({
			"filter": {
				"Q": 0.2
			},
			"envelope": {
				"attack": 0.5,
				"decay": 0.1,
				"sustain": 0.85,
				"release": 1,
			},
			"filterEnvelope": {
				"attack": 0.2,
				"decay": 0.01,
				"sustain": 0.7,
				"release": 0.8,
				"baseFrequency": "A2",
				"octaves": 3,
				"exponent": 2,
			}
	});
  synths.push(synth_sq);

  let synth_fm = new Tone.PolySynth( 5, Tone.FMSynth ).toMaster();
	synth_fm.set({
		"harmonicity": 6,
		"modulationIndex": 8,
		"envelope": {
			"attack": 0.01,
			"decay": 0.2,
			"sustain": 0.95,
			"release": 0.2
		},
		"modulation": {
			"type": "sawtooth"
		},
		"modulationEnvelope": {
			"envelope": {
				"attack": 0.01,
				"decay": 0.01,
				"sustain": 0.8,
				"release": 0.5
			}
		}
	});
  synths.push(synth_fm);

  let synth_xm = new Tone.PolySynth( 5, Tone.FMSynth ).toMaster();
	synth_xm.set({
		"harmonicity": 3.5,
		"modulationIndex": 5.5,
		"envelope": {
			"attack": 0.01,
			"decay": 0.,
			"sustain": 0.95,
			"release": 0.2
		},
		"modulation": {
			"type": "sawtooth"
		},
		"modulationEnvelope": {
			"envelope": {
				"attack": 0.01,
				"decay": 0.01,
				"sustain": 0.5,
				"release": 0.5
			}
		}
	});
  synths.push(synth_xm);
}
