/* synth space
 * assignment #04
 * the code of music
 * NYU's ITP, fall 2018
 * nicolás escarpentier
 */

// global threejs variables
let container, renderer, camera, scene;
let controls, loader;
let sphere1, sphere2;

window.addEventListener('load', init);

function init(){
	container = document.querySelector('#sketch');
	// let wid = window.innerWidth;
	// let hei = window.innerHeight;
  let wid = 720;
  let hei = 400;

	// THREE INITIALIZATION
	renderer = new THREE.WebGLRenderer({ });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(wid, hei);
	container.appendChild(renderer.domElement);

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x110055 );

	camera = new THREE.PerspectiveCamera(60, wid/hei, 0.1, 5000);
	camera.position.set( -10, 0, 0 );

	// controls = new THREE.OrbitControls( camera, renderer.domElement );
	// controls.update();

	loader = new THREE.TextureLoader();

	window.addEventListener('resize', onWindowResize, true );

	createEnvironment();
	animate();
}


// EVENTS
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


// ANIMATION
function animate() {
  renderer.setAnimationLoop( render );
}
function render(){
  renderer.render( scene, camera );
}


// ENVIRONMENT
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
