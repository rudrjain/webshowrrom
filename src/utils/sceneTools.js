
import * as THREE from 'three';

/**
 * Safely finds an object in the scene by its name.
 * @param {THREE.Scene} scene
 * @param {string} objectName
 * @returns {THREE.Object3D|null}
 */
export function findObjectByName(scene, objectName) {
  try {
    let found = null;
    scene.traverse(obj => {
      if (obj.name === objectName) found = obj;
    });
    return found;
  } catch (err) {
    console.error(`Error in findObjectByName: ${err}`);
    return null;
  }
}

/**
 * Sets visibility of object by name. Does nothing if object not found.
 * @param {THREE.Scene} scene
 * @param {string} objectName
 * @param {boolean} visible
 */
export function setObjectVisibility(scene, objectName, visible) {
  try {
    const obj = findObjectByName(scene, objectName);
    if (obj) {
      obj.visible = visible;
    } else {
      console.warn(`setObjectVisibility: Object '${objectName}' not found.`);
    }
  } catch (err) {
    console.error(`Error in setObjectVisibility: ${err}`);
  }
}

/**
 * Sets scale of object by name. Accepts Vector3, array, or number.
 * @param {THREE.Scene} scene
 * @param {string} objectName
 * @param {THREE.Vector3|Array|number} scale
 */
export function setObjectScale(scene, objectName, scale) {
  try {
    const obj = findObjectByName(scene, objectName);
    if (!obj) {
      console.warn(`setObjectScale: Object '${objectName}' not found.`);
      return;
    }
    if (scale instanceof THREE.Vector3) {
      obj.scale.copy(scale);
    } else if (Array.isArray(scale)) {
      obj.scale.set(scale[0], scale[1], scale[2]);
    } else if (typeof scale === "number") {
      obj.scale.set(scale, scale, scale);
    } else {
      throw new Error('Invalid scale type');
    }
  } catch (err) {
    console.error(`Error in setObjectScale: ${err}`);
  }
}

export function setObjectPosition(scene, objectName, position) {
  try {
    const obj = findObjectByName(scene, objectName);
    if (!obj) {
      console.warn(`setObjectPosition: Object '${objectName}' not found.`);
      return;
    }
    if (position instanceof THREE.Vector3) {
      obj.position.copy(position);
    } else if (Array.isArray(position)) {
      obj.position.set(position[0], position[1], position[2]);
    } else if (typeof position === "number") {
      obj.position.set(position, position, position);
    } else {
      throw new Error('Invalid position type');
    }
  } catch (err) {
    console.error(`Error in setObjectPosition: ${err}`);
  }
}

/**
 * (You can add more utility methods here following the same pattern)
 */
