import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';


export function addShowroomLights(scene, renderer) {
  // 1. Ambient: soft base light for the whole scene
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  // 2. Hemisphere: soft sky and ground light, like studio ceiling
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xb0bec5, 0.4);
  hemiLight.position.set(0, 8, 0);
  scene.add(hemiLight);

  // 3. Directional: simulates sun or main spot
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
dirLight.position.set(5, 10, 6);
dirLight.castShadow = true;
scene.add(dirLight);

// Add 3 more directional lights from other sides:
const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.7);
dirLight2.position.set(-5, 10, -6);
scene.add(dirLight2);

const dirLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight3.position.set(0, 10, 10);
// scene.add(dirLight3);

const dirLight4 = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight4.position.set(0, 10, -10);
// scene.add(dirLight4);

  // 4. Fill light: gives side highlight, balances contrast
  const fillLight = new THREE.PointLight(0xffffff, 0.4, 20);
  fillLight.position.set(-5, 4, -5);
  scene.add(fillLight);

//   5. Cubemap for environment reflections (not background)
  const loader = new THREE.CubeTextureLoader();
  const envMap = loader.load([
    '/cubemap/posx.png',
    '/cubemap/negx.png',
    '/cubemap/posy.png',
    '/cubemap/negy.png',
    '/cubemap/posz.png',
    '/cubemap/negz.png',
  ], () => {
    scene.environment = envMap;
    console.log('Set custom envMap:', scene.environment);
  });

  const hdrLoader = new RGBELoader();
hdrLoader.setDataType(THREE.FloatType); // Most HDRs from Polyhaven are fine with this

hdrLoader.load('/canary_wharf_2k.hdr', function(hdrMap) {
  hdrMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = hdrMap;      // Set ONLY as background
  // Do NOT set: scene.environment = hdrMap;
});

// new RGBELoader()
//     .setDataType(THREE.FloatType)
//     .load(
//       'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/equirectangular/royal_esplanade_1k.hdr',
//       (hdrMap) => {
//         hdrMap.mapping = THREE.EquirectangularReflectionMapping;
//         scene.environment = hdrMap;
//         // scene.background = hdrMap; // Uncomment if you want HDRI as background
//         console.log('Set Royal Esplanade HDRI as environment:', scene.environment);
//       }
//     );
}
