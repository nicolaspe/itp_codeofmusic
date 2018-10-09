/* synth space
 * assignment #04
 * the code of music
 * NYU's ITP, fall 2018
 * nicolás escarpentier
 */

// global threejs variables
let container, renderer, camera, scene;
let controls, loader;

// tone variables
let POLY = 5;
let SIGN = 4;
let synths, synth_sq, synth_fm, synth_xm;
let patterns, tritone, calm, suspense, stasis;


window.addEventListener('load', init);

// === INIT
function init(){

	container = document.querySelector('#sketch');
	// let wid = window.innerWidth;
	// let hei = window.innerHeight;
  let wid = 720;
  let hei = 400;


	// TONEJS INITIALIZATION
	initSound();


	// THREE INITIALIZATION
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(wid, hei);
	container.appendChild(renderer.domElement);

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x000000 );

	camera = new THREE.PerspectiveCamera(60, wid/hei, 0.1, 5000);
	camera.position.set( -10, 0, 0 );

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.update();

	loader = new THREE.TextureLoader();

	// window.addEventListener('resize', onWindowResize, true );
	window.addEventListener('keydown', (event) =>{
		let keyname = event.key.toLowerCase();
		onKeyDown(keyname);
	});
	window.addEventListener('keyup', (event) =>{
		let keyname = event.key.toLowerCase();
		onKeyUp(keyname);
	});

	createEnvironment();
	Tone.Transport.start();
	animate();
}


// === EVENTS
function onWindowResize(){
  // let wid = window.innerWidth;
  // let hei = window.innerHeight;
  let wid = 720;
  let hei = 400;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(wid, hei);
	camera.aspect = wid/hei;
  camera.updateProjectionMatrix();
}


// === ANIMATION
function animate() {
  renderer.setAnimationLoop( render );
}
function render(){
  renderer.render( scene, camera );
}



// ==== INTERACTION
function onKeyDown( keyname ){
	switch( keyname ){
		case 'a':
			synth_sq.triggerAttack("A2");
			break;
		case 's':
			synth_fm.triggerAttack(["A3", "C3", "F3"], "8n");
			break;
		case 'd':
			synth_xm.triggerAttack(["A2", "D2", "F2"], "4n");
			break;
		case 'q':
			tritone.start();
			break;
		case 'w':
			calm.start();
			break;
		case 'e':
			suspense.start();
			break;
		case 'r':
			stasis.start();
			break;
		default:
			break;
	}
}
function onKeyUp( keyname ){
	switch( keyname ){
		case 'a':
			synth_sq.triggerRelease("A2");
			break;
		case 's':
			synth_fm.releaseAll();
			break;
		case 'd':
			synth_xm.releaseAll();
			break;
		case 'p':
			tritone.stop();
			calm.stop();
			suspense.stop();
			stasis.stop();
			break;
		default:
			break;
	}
}



// === SOUND
function initSound(){
	Tone.Transport.bpm = 120;
  Tone.Transport.swing = 0;
  Tone.Transport.timeSignature = SIGN;
  Tone.Transport.loopStart = 0;
  Tone.Transport.PPQ = 192;

	synth_sq = new Tone.PolySynth( POLY, Tone.MonoSynth ).toMaster();
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

	synth_fm = new Tone.PolySynth( POLY, Tone.FMSynth ).toMaster();
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

	synth_xm = new Tone.PolySynth( POLY, Tone.FMSynth ).toMaster();
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
	synths = [synth_sq, synth_fm, synth_xm];


	patterns = [2, 0, 1, 1];
	tritone = new Tone.Sequence( function(time, note) {
		synths[ patterns[0] ].triggerAttackRelease(note, time);
	}, ["E5", "F#5", "G#5", "E5"], "6t" );
	tritone.loop = 0;

	calm = new Tone.Sequence( function(time, note) {
		synths[ patterns[1] ].triggerAttackRelease(note, time);
	}, ["A3", "C#4", "F4", "A4", "F3", "G4"], "4n" );
	calm.loop = 0;

	suspense = new Tone.Sequence( function(time, note) {
		synths[ patterns[2] ].triggerAttackRelease(note, time);
	}, ["G#4", "A4", "E4", "D4", "D5", "E5"], "4t" );
	suspense.loop = 0;

	stasis = new Tone.Sequence( function(time, note) {
		synths[ patterns[3] ].triggerAttackRelease(note, time);
	}, ["A4", "E4", "A4", "A3", "E4", "A4"], "8n" );
	stasis.loop = 0;


}


// === ENVIRONMENT
function createEnvironment(){

	// REFERENCE PLANE
	let plane_geo = new THREE.PlaneGeometry(200, 200, 20, 20);
	let plane_mat = new THREE.MeshBasicMaterial({
		color: 0x555555,
		side: THREE.DoubleSide,
		wireframe: true
	});
	let ref_plane = new THREE.Mesh(plane_geo, plane_mat);
	ref_plane.rotation.x = Math.PI/2;
	ref_plane.position.set(0, -20, 0);
	scene.add(ref_plane);

	// LIGHTS!
	let a_light = new THREE.AmbientLight(0xffffff, 0.05);
	scene.add(a_light);
}
