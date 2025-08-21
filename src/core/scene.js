import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf6f7f8); // Subtle showroom bg
  return scene;
}
