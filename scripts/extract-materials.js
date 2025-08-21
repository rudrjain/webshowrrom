globalThis.self = globalThis;
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GLB_PATH = './public/3dmodels/showroom_1.glb';
const OUTPUT_PATH = './materials.json';

async function extractMaterials() {
    // Read as Node Buffer
    const nodeBuffer = await fs.readFile(resolve(__dirname, '..', GLB_PATH));
    // Convert to ArrayBuffer
    const arrayBuffer = nodeBuffer.buffer.slice(
        nodeBuffer.byteOffset,
        nodeBuffer.byteOffset + nodeBuffer.byteLength
    );

    const loader = new GLTFLoader();

    // Polyfill for Node
    globalThis.Blob = (await import('buffer')).Blob;
    globalThis.URL = (await import('url')).URL;

    loader.parse(
        arrayBuffer,
        '',
        (gltf) => {
            const materials = {};
            gltf.scene.traverse((child) => {
                if (child.material) {
                    let mat = child.material;
                    let name = mat.name || child.name || `material_${child.id}`;
                    materials[name] = {
                        type: mat.type,
                        color: mat.color ? '#' + mat.color.getHexString() : undefined,
                        metalness: mat.metalness,
                        roughness: mat.roughness,
                        emissive: mat.emissive ? '#' + mat.emissive.getHexString() : undefined,
                        emissiveIntensity: mat.emissiveIntensity,
                        transparent: mat.transparent,
                        opacity: mat.opacity,
                        side: mat.side,
                        alphaTest: mat.alphaTest,
                        envMapIntensity: mat.envMapIntensity,
                        clearcoat: mat.clearcoat,
                        clearcoatRoughness: mat.clearcoatRoughness,
                        transmission: mat.transmission,
                        ior: mat.ior,
                        thickness: mat.thickness,
                    };
                }
            });
            fs.writeFile(OUTPUT_PATH, JSON.stringify(materials, null, 2));
            console.log('Material properties extracted to:', OUTPUT_PATH);
        },
        (err) => {
            console.error('Error parsing GLB:', err);
        }
    );
}

extractMaterials();
