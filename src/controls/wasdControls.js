import * as THREE from 'three';

export class WASDControls {
  constructor(camera, controls, enabled = true) {
    this.camera = camera;
    this.controls = controls; // Pass OrbitControls instance!
    this.enabled = enabled;

    this.moveSpeed = 0.85;
    this.keys = { forward: false, backward: false, left: false, right: false, up: false, down: false };

    this._onKeyDown = (e) => this.onKeyDown(e);
    this._onKeyUp = (e) => this.onKeyUp(e);

    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
  }

  onKeyDown(event) {
    if (!this.enabled) return;
    switch (event.code) {
      case 'KeyW': this.keys.forward = true; break;
      case 'KeyS': this.keys.backward = true; break;
      case 'KeyA': this.keys.left = true; break;
      case 'KeyD': this.keys.right = true; break;
      case 'KeyQ': this.keys.down = true; break;
      case 'KeyE': this.keys.up = true; break;
      default: break;
    }
  }

  onKeyUp(event) {
    switch (event.code) {
      case 'KeyW': this.keys.forward = false; break;
      case 'KeyS': this.keys.backward = false; break;
      case 'KeyA': this.keys.left = false; break;
      case 'KeyD': this.keys.right = false; break;
      case 'KeyQ': this.keys.down = false; break;
      case 'KeyE': this.keys.up = false; break;
      default: break;
    }
  }

  update() {
  if (!this.enabled) return;
  if (!this.controls) return;

  // Forward (XZ only)
  const forward = new THREE.Vector3();
  this.camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();

  // Right (XZ only)
  const right = new THREE.Vector3();
  right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

  let move = new THREE.Vector3();

  if (this.keys.forward) move.add(forward);
  if (this.keys.backward) move.sub(forward);
  if (this.keys.right) move.add(right);
  if (this.keys.left) move.sub(right);

  // Optional: up/down
  if (this.keys.up) move.y += 1;
  if (this.keys.down) move.y -= 1;

  if (move.lengthSq() === 0) return;

  move.normalize().multiplyScalar(this.moveSpeed);

  // Move camera and target
  this.camera.position.add(move);
  this.controls.target.add(move);
}

}
