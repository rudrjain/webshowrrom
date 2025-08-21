import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { applyMaterialOverrides } from '../utils/materialOverrides.js';
import { setObjectScale } from '../utils/sceneTools.js';
import { setObjectPosition } from '../utils/sceneTools.js';
import { setObjectVisibility } from '../utils/sceneTools.js';



async function loadJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function loadShowroom(scene, onLoaded) {
  let materialOverrides = {};
  try {
    materialOverrides = await loadJSON('/materials.json');
    console.log('[DEBUG] Loaded material overrides:', Object.keys(materialOverrides));
  } catch (e) {
    console.warn('Could not load materials.json:', e);
  }

  const loader = new GLTFLoader();
  loader.load(
    '/3dmodels/showroom_1.glb',
    (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          const matName = child.material.name || child.name || `material_${child.id}`;
          const overrides = materialOverrides[matName];
          if (overrides) {
            applyMaterialOverrides(child, overrides);
            console.log(`[DEBUG] Applied overrides for: ${matName}`, overrides);
          } else {
            console.log(`[DEBUG] No override found for: ${matName}`);
          }
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(gltf.scene);
      setObjectScale(scene, "final_full_store_67", [1, 1, 0.99]);
      setObjectPosition(scene, "final_full_store_41", [0, 0, - 0.21]);
      setObjectVisibility(scene, "final_full_store_737", false);
setObjectVisibility(scene, "final_full_store_735", false);
setObjectVisibility(scene, "final_full_store_733", false);
setObjectVisibility(scene, "final_full_store_732", false);
setObjectVisibility(scene, "final_full_store_734", false);
setObjectVisibility(scene, "final_full_store_731", false);
      if (onLoaded) onLoaded(gltf.scene);
    },
    undefined,
    (err) => {
      console.error('Error loading GLB:', err);
    }
  );
}
