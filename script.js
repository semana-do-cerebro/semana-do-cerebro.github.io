import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';

import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

var altura = window.screen.height;

var windowHW = 300;


var renderer = new THREE.WebGLRenderer ({ alpha: true } );
renderer.setSize(windowHW, windowHW);
const modelDiv = document.getElementById('modelDiv');
modelDiv.appendChild(renderer.domElement);

var scene = new THREE.Scene();
scene.background = null;


const camera = new THREE.PerspectiveCamera(30, windowHW / windowHW, 0.1, 1000);

const loader = new GLTFLoader();
const fileName = './human_brain/scene.gltf';
let model;

loader.load(fileName, function(gltf) {
  model = gltf.scene;
  scene.add(model);
  addLight();
  adjustModelAndCamera();
  scene.add(camera);
  animate();
}, undefined, function(e) {
  console.error(e);
});


function addLight() {
  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(0, 0, 10);
  camera.add(light);
}


function adjustModelAndCamera() {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());

  model.position.x += (model.position.x - center.x);
  model.position.y += (model.position.y - center.y);
  model.position.z += (model.position.z - center.z);

  camera.near = size / 100;
  camera.far = size * 100;
  camera.updateProjectionMatrix();

  camera.position.copy(center);
  camera.position.x += size / 0.2;
  camera.position.y += size / 2;
  camera.position.z += size / 100;
  camera.lookAt(center);
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;
controls.autoRotate = true;
controls.enableDamping = false;
controls.dampingFactor = 0.2;
controls.autoRotateSpeed = 1;
controls.minPolarAngle = Math.PI / 2;
controls.maxPolarAngle = -Math.PI / 2;
controls.maxDistance = 2;



function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);

}

animate();


