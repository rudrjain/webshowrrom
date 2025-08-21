import * as THREE from 'three';

console.log("TeleportSystem module loaded");

export class TeleportSystem {
  /**
   * @param {THREE.Scene} scene
   * @param {THREE.Camera} camera
   * @param {OrbitControls} controls
   * @param {Array} teleportPoints
   * @param {THREE.Renderer} renderer
   * @param {function} onTeleport
   */
  constructor(scene, camera, controls, teleportPoints, renderer, onTeleport) {
    console.log("TeleportSystem constructor called");
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.teleportPoints = teleportPoints;
    this.renderer = renderer;
    this.onTeleport = onTeleport;
    this.pads = [];
    this._createPads();

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this._pointerDownHandler = (e) => this._onPointerDown(e);
    window.addEventListener('pointerdown', this._pointerDownHandler);
  }

  dispose() {
    window.removeEventListener('pointerdown', this._pointerDownHandler);
    this.pads.forEach(p => this.scene.remove(p.mesh));
    this.pads = [];
  }

  _createPads() {
    console.log("Creating pads for points:", this.teleportPoints);
    this.teleportPoints.forEach(point => {
      console.log(`Pad point: ${JSON.stringify(point)}`);
      const geom = new THREE.BoxGeometry(8, 0.6, 8);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xff2222, // Bright red
        metalness: 0.1,
        roughness: 0.5,
        emissive: 0x550000
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(point.markerPosition[0], point.markerPosition[1], point.markerPosition[2]);
      mesh.name = `teleport_${point.name}`;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
      this.pads.push({ mesh, point });
      console.log(`Placed teleporter "${point.name}" at (${mesh.position.x}, ${mesh.position.y}, ${mesh.position.z})`);
    });
  }

  _onPointerDown(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.pads.map(p => p.mesh));
    if (intersects.length > 0) {
      const { point } = this.pads.find(p => p.mesh === intersects[0].object);
      this.teleportTo(point.cameraPosition, point.rotation);
      if (typeof this.onTeleport === 'function') this.onTeleport(point);
      console.log(`Teleported to "${point.name}"`);
    }
  }

  teleportTo(position, rotation) {
    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();

    const rot = rotation.map(THREE.MathUtils.degToRad);
    const euler = new THREE.Euler(rot[0], rot[1], rot[2], 'XYZ');
    const dir = new THREE.Vector3(0, 0, -1).applyEuler(euler);
    const newTarget = new THREE.Vector3().fromArray(position).addScaledVector(dir, 10);

    const duration = 1.2;
    let elapsed = 0;
    const start = performance.now();
    const animate = (now) => {
      elapsed = (now - start) / 1000;
      const t = Math.min(elapsed / duration, 1);
      this.camera.position.lerpVectors(startPos, new THREE.Vector3().fromArray(position), t);
      this.controls.target.lerpVectors(startTarget, newTarget, t);
      this.controls.update();
      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }
}
