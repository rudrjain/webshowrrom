import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

export class TeleportEditor {
  constructor(scene, camera, renderer, teleportPads, THREE) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.teleportPads = teleportPads;
    this.THREE = THREE;
    this.controls = [];
    this.enabled = false;
  }

  enable() {
    if (this.enabled) return;
    this.enabled = true;

    this.teleportPads.forEach((pad) => {
      const mesh = pad.mesh;
      const tc = new TransformControls(this.camera, this.renderer.domElement);
      tc.setMode('translate');
      tc.attach(mesh);

      this.scene.add(tc); // skip instanceof check if THREE is valid
      this.controls.push(tc);

      tc.addEventListener('mouseDown', () => {
        console.log(`Editing ${pad.name}`);
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'g') {
        console.log('Teleport Marker Positions:');
        this.teleportPads.forEach((pad) => {
          const p = pad.mesh.position;
          console.log(`${pad.name}: [${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}]`);
        });
      }
    });
  }

  disable() {
    this.controls.forEach((tc) => {
      this.scene.remove(tc);
      tc.dispose?.();
    });
    this.controls = [];
    this.enabled = false;
  }
}
