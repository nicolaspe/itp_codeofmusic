
// global threejs variables
let container, renderer, camera, scene;
let controls, loader;
let scale_octaves, scale_notes, scale_radius, scale_spheres, scale_harm;
let scale_lines, scale_harm_line, harmShift;
let notes_selected;
let synth, harmSynth, notes;
let seq_base, seq_harm, chordArray, harmonicArray, chordSeq, harmonicSeq;
let mouse, raycaster;

window.addEventListener('load', init);


// === INIT
function init(){
	container = document.querySelector('#sketch');
	let wid = window.innerWidth;
	let hei = window.innerHeight;

	// THREE INITIALIZATION
	renderer = new THREE.WebGLRenderer({ });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(wid, hei);
	container.appendChild(renderer.domElement);

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x000000 );

	camera = new THREE.PerspectiveCamera(60, wid/hei, 0.1, 5000);
	camera.position.set( -566, 204, 436 );

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.update();

  // more INITIALIZATION > RAYCASTING variables
  mouse     = new THREE.Vector2();
  raycaster = new THREE.Raycaster();

  // event listeners
  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('click', onClick, false);
  window.addEventListener('resize', onWindowResize, true );
	window.addEventListener('keypress', onKeyPress, true );

  scale_spheres = [];
  createSound();
	createEnvironment();

  Tone.Transport.start();
	animate();
}



// === EVENTS
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
  mouse.y = -(event.clientY / window.innerHeight)*2 +1;
}
function onClick(){
  inters = raycasting();

  if( inters.length > 0 ){
    if ( !inters[0].object.scale_sel ){
      // get the id corresponding to the note and the note
      let note_id = inters[0].object.scale_id;
      let harm_id = note_id + harmShift;
      let note = notes[ note_id ];
      let harmNote = notes[ note_id + harmShift ];
      // change color of sphere
      scale_spheres[note_id].material.color.set( 0xaa7700 );
      scale_harm[ harm_id ].material.color.set( 0xcc0088 );
      // push to the corresponding arrays
      chordArray.push( note_id );
      chordSeq.push( note );
      harmonicArray.push( harm_id );
      harmonicSeq.push( harmNote );
    } else {
      // get the id corresponding to the note and the note
      let note_id = inters[0].object.scale_id;
      let harm_id = note_id + harmShift;
      let note = notes[ note_id ];
      let harmNote = notes[ note_id + harmShift ];
      // change color of sphere
      scale_spheres[note_id].material.color.set( 0xaaaaaa );
      scale_harm[ harm_id ].material.color.set( 0xaaaaaa );
      // remove from the corresponding arrays
      chordArray.splice( chordArray.indexOf(note_id), 1 );
      chordSeq.splice( chordSeq.indexOf(note), 1 );
      harmonicArray.splice( harmonicArray.indexOf( harm_id ), 1 );
      harmonicSeq.splice( harmonicSeq.indexOf( harmNote ), 1 );
    }
    // toggle the boolean
    inters[0].object.scale_sel = !inters[0].object.scale_sel;

    // restart sequences
    createSequences();
    // console.log( inters[0].object.scale_id + ' > ' + inters[0].object.scale_sel );
  }
}
function onKeyPress( event ) {
  let key = parseInt(event.keyCode);
  console.log("change to: " + key);
  switch( key ){
    case 49: // 1
      changeHarmony(1);
      break;
    case 50: //2
      changeHarmony(2);
      break;
    case 51: // 3
      changeHarmony(3);
      break;
    case 52: // 4
      changeHarmony(4);
      break;
    case 53: // 5
      changeHarmony(5);
      break;
    case 54: // 6
      changeHarmony(6);
      break;
    case 55: // 7
      changeHarmony(7);
      break;
    default:
      break;
  }
}

function changeHarmony( shift ){
  // change the harmonic shift
  harmShift = shift;
  // redo entire array and sequence
  harmonicArray = [];
  harmonicSeq = [];
  for (let i = 0; i < chordArray.length; i++) {
    let harm_id = chordArray[i] + harmShift;
    let harmNote = notes[ harm_id ];
    harmonicArray.push( harm_id );
    harmonicSeq.push( harmNote );
  }
  // repaint everything
  for (let i = 0; i < scale_harm.length; i++) {
    if ( harmonicArray.includes( i ) ){
      scale_harm[i].material.color.set(0xcc0088);
    } else {
      scale_harm[i].material.color.set(0xaaaaaa);
    }
  }
  
  // restart sequences
  createSequences();
}


// === ANIMATION
function animate() {
  renderer.setAnimationLoop( render );
}
function render(){
	controls.update();
  raycasting();

  renderer.render( scene, camera );
}

function raycasting(){
	// set raycaster
  raycaster.setFromCamera( mouse, camera );
  // get intersecting elements
  let intersects = raycaster.intersectObjects( scale_spheres );
  // return all elements scale
  for (let i = 0; i < scale_spheres.length; i++) {
    scale_spheres[i].scale.set(1.0, 1.0, 1.0);
  }
  // "highlight" by scaling intersected elements
  for (let i = 0; i < intersects.length; i++) {
    intersects[i].object.scale.set(1.2, 1.2, 1.2);
  }
  return intersects;
}


// ENVIRONMENT
function createEnvironment(){
	// SKYDOME
  let sky_geo = new THREE.SphereGeometry(2000, 36, 24);
  let sky_mat = new THREE.MeshLambertMaterial({
    color: 0x220099,
    side: THREE.BackSide,
  });
  let sky_wire = new THREE.MeshBasicMaterial({
    color: 0x220099,
    side: THREE.DoubleSide,
    wireframe: true
  });
  let skydome = new THREE.Mesh(sky_geo, sky_mat);
  let skywire = new THREE.Mesh(sky_geo, sky_wire);
  scene.add(skydome);
  scene.add(skywire);


	// LIGHTS!
	let d_light = new THREE.DirectionalLight(0xffffff, 1);
	scene.add(d_light);

  let p_light = new THREE.PointLight(0xffffff, 1.5, 2500, 1);
	p_light.position.set(0, 0, 0);
	scene.add(p_light);


  // MUSIC SCALE
  scale_octaves = 4;
  scale_notes = 7;
  scale_radius = 300;

  // color: 0xaa7700
  // color: 0x773300

  let sph_geo = new THREE.SphereGeometry(12, 12, 12);


  // base cylinder
  let lin_geo = new THREE.Geometry();
  let lin_mat = new THREE.LineBasicMaterial({
  	color: 0x777777
  });

  for (let i = 0; i < scale_octaves*scale_notes; i++) {
    let sph_mat = new THREE.MeshLambertMaterial({
      color: 0xaaaaaa
    });
    let sph = new THREE.Mesh( sph_geo, sph_mat );
    sph.scale_id = i;
    sph.scale_sel = false;

    let angle = (i % 7) * (2*Math.PI)/7;
    let pos_x = scale_radius * Math.sin( angle );
    let pos_z = scale_radius * Math.cos( angle );
    let pos_y = i * 20 - 280;

    lin_geo.vertices.push( new THREE.Vector3( pos_x, pos_y, pos_z ) );
    sph.position.set( pos_x, pos_y, pos_z );

    scale_spheres.push( sph );
    scene.add( scale_spheres[i] );
  }
  scale_lines = new THREE.Line( lin_geo, lin_mat );
  scene.add( scale_lines );


  // harmonics
  let lin_harm_geo = new THREE.Geometry();
  let lin_harm_mat = new THREE.LineBasicMaterial({
  	color: 0x777777,
    opacity: 0.25,
    transparent: true
  });

  scale_harm = [];
  for (let i = 0; i < scale_octaves*(scale_notes+1); i++) {
    let harm_mat = new THREE.MeshLambertMaterial({
      color: 0xaaaaaa,
      opacity: 0.25,
      transparent: true
    });
    let harm = new THREE.Mesh( sph_geo, harm_mat );
    harm.scale_id = i;
    harm.scale_sel = false;

    let angle = (i % 7) * (2*Math.PI)/7;
    let pos_x = scale_radius * Math.sin( angle );
    let pos_z = scale_radius * Math.cos( angle );
    let pos_y = i * 20 - 250;

    lin_harm_geo.vertices.push( new THREE.Vector3( pos_x, pos_y, pos_z ) );
    harm.position.set( pos_x, pos_y, pos_z );

    scale_harm.push( harm );
    scene.add( scale_harm[i] );
  }
  scale_harm_lines = new THREE.Line( lin_harm_geo, lin_harm_mat );
  scene.add( scale_harm_lines );

}






// === SOUND
function createSound(){
  Tone.Transport.bpm = 120;

  synth = new Tone.PolySynth({
    polyphony  : 3 ,
    volume  : 0 ,
    detune  : 0 ,
    voice  : Tone.FMSynth
    }
  ).toMaster();

  harmSynth = new Tone.PolySynth({
    polyphony  : 3 ,
    volume  : 0 ,
    detune  : 0 ,
    voice  : Tone.FMSynth
    }
  ).toMaster();

  notes = ["C3", "D3", "E3", "F3", "G3", "A3", "B3",
           "C4", "D4", "E4", "F4", "G4", "A4", "B4",
           "C5", "D5", "E5", "F5", "G5", "A5", "B5",
           "C6", "D6", "E6", "F6", "G6", "A6", "B6",
           "C7", "D7", "E7", "F7", "G7", "A7", "B7"];

  chordArray = [];
  harmonicArray = [];
  chordSeq = [];
  // chordSeq = [notes[0], notes[2], notes[4]];
  harmonicSeq = [];
  harmShift = 4;

  createSequences();
}

function createSequences(){
  if( seq_base != undefined ){
    seq_base.stop();
    seq_harm.stop();
  }

  seq_base = new Tone.Sequence(function(time, note){
    synth.triggerAttackRelease(note, "8n", time);
  }, chordSeq, "4n");

  seq_harm = new Tone.Sequence(function(time, note){
    harmSynth.triggerAttackRelease(note, "8n", time);
  }, harmonicSeq, "4n");

  seq_base.start();
  seq_harm.start();
}
