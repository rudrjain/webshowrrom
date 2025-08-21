import * as THREE from 'three';
import { createScene } from './core/scene.js';
import { createCamera } from './core/camera.js';
import { createRenderer } from './core/renderer.js';
import { addShowroomLights } from './core/lights.js';
import { loadShowroom } from './loaders/loadShowroom.js';
import { createOrbitControls } from './controls/orbitControls.js';
import { WASDControls } from './controls/wasdControls.js';

import { TeleportSystem } from './teleport/teleportSystem.js';
import teleportPoints from './teleport/teleportPoints.json';

// Postprocessing imports
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { TeleportEditor } from './teleport/TeleportEditor.js';

let renderer, scene, camera, controls, wasdControls, composer;

init();
animate();

function setCameraPositionAndRotation(camera, controls, pos, rotDeg) {
  camera.position.set(pos[0], pos[1], pos[2]);
  const rot = rotDeg.map(THREE.MathUtils.degToRad);
  const euler = new THREE.Euler(rot[0], rot[1], rot[2], 'XYZ');
  const dir = new THREE.Vector3(0, 0, -1);
  dir.applyEuler(euler);
  const target = new THREE.Vector3().copy(camera.position).addScaledVector(dir, 10);
  controls.target.copy(target);
  controls.update();
}

function init() {
  scene = createScene();
  camera = createCamera();
  renderer = createRenderer();
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize);

  addShowroomLights(scene, renderer);
  loadShowroom(scene);

  controls = createOrbitControls(camera, renderer);

  // === CAMERA START AT SPECIFIC POSITION/ROTATION ===
  setCameraPositionAndRotation(
    camera, controls,
    [-207.64, -27.96, 538.56],       // position [x, y, z]
    [-88.37, 82.74, 88.35]           // rotation [x, y, z] in degrees
  );

  // === LIMIT VERTICAL ROTATION: -20 to 40 degrees ===
  controls.minPolarAngle = Math.PI / 2 + THREE.MathUtils.degToRad(-20);
  controls.maxPolarAngle = Math.PI / 2 + THREE.MathUtils.degToRad(40);

  // WASD movement, initially disabled (pass camera and OrbitControls!)
  wasdControls = new WASDControls(camera, controls, false);
  

let teleportSystem;
teleportSystem = new TeleportSystem(scene, camera, controls, teleportPoints, renderer);

const editor = new TeleportEditor(scene, camera, renderer, teleportSystem.pads);
  editor.enable();

// const testMat = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0, roughness: 0.2, emissive: 0x440000 });
// const testGeom = new THREE.BoxGeometry(5, 0.2, 5);  // Large enough!
// const testSphere = new THREE.Mesh(testGeom, testMat);
// testSphere.position.set(-208.17, -70, 538.07); // Use your point, y=10
// scene.add(testSphere);

  // === POSTPROCESSING SETUP ===
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.3,   // strength: more = brighter glow
    0.99,  // radius: larger = softer spread
    0.85   // threshold: lower = more things glow
  ));
  composer.addPass(new ShaderPass(GammaCorrectionShader));

  // Toggle WASD with 'M' key
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyM') {
      wasdControls.enabled = !wasdControls.enabled;
      console.log('WASD movement enabled:', wasdControls.enabled);
    }
  });
}



function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (wasdControls) wasdControls.update();
  composer.render();  // Use composer instead of renderer!
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (composer) composer.setSize(window.innerWidth, window.innerHeight);
}



window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyL') {
    const pos = camera.position;
    const rot = camera.rotation;
    // Degrees for easier reading
    const radToDeg = r => (r * 180 / Math.PI).toFixed(2);
    // One-line log:
    console.log(
      `position: ${pos.x.toFixed(2)},${pos.y.toFixed(2)},${pos.z.toFixed(2)} ` +
      `rotation: ${radToDeg(rot.x)},${radToDeg(rot.y)},${radToDeg(rot.z)}`
    );
  }
});