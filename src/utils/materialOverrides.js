import * as THREE from 'three';

export function applyMaterialOverrides(mesh, overrides) {
  if (!mesh || !mesh.material || !overrides) return;

  let origMat = mesh.material;
  if (!(origMat instanceof THREE.MeshPhysicalMaterial)) {
    mesh.material = new THREE.MeshPhysicalMaterial({
      map: origMat.map,
      normalMap: origMat.normalMap,
      roughnessMap: origMat.roughnessMap,
      metalnessMap: origMat.metalnessMap,
      envMap: origMat.envMap,
      name: origMat.name,
    });
  }
  let material = mesh.material;

  if ('color' in overrides && material.color) {
    material.color.set(overrides.color);
  }
  if ('metalness' in overrides) material.metalness = overrides.metalness;
  if ('roughness' in overrides) material.roughness = overrides.roughness;
  if ('emissive' in overrides && material.emissive) material.emissive.set(overrides.emissive);
  if ('emissiveIntensity' in overrides) material.emissiveIntensity = overrides.emissiveIntensity;
  if ('transparent' in overrides) material.transparent = overrides.transparent;
  if ('opacity' in overrides) material.opacity = overrides.opacity;
  if ('side' in overrides) material.side = overrides.side;
  if ('alphaTest' in overrides) material.alphaTest = overrides.alphaTest;
  if ('envMapIntensity' in overrides) material.envMapIntensity = overrides.envMapIntensity;
  if ('clearcoat' in overrides) material.clearcoat = overrides.clearcoat;
  if ('clearcoatRoughness' in overrides) material.clearcoatRoughness = overrides.clearcoatRoughness;
  if ('transmission' in overrides) material.transmission = overrides.transmission;
  if ('ior' in overrides) material.ior = overrides.ior;
  if ('thickness' in overrides) material.thickness = overrides.thickness;
  if ('sheen' in overrides) material.sheen = !!overrides.sheen;
  if ('sheenColor' in overrides) material.sheenColor = new THREE.Color(overrides.sheenColor);
  if ('sheenRoughness' in overrides) material.sheenRoughness = overrides.sheenRoughness;


  material.needsUpdate = true;
}
