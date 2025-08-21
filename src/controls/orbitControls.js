import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createOrbitControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false; // Optional: Lock to only rotation and zoom
  controls.minDistance = 3;
  controls.maxDistance = 24;
  controls.target.set(0, 1.5, 0);
  return controls;
}
