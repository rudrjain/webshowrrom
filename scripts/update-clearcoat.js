import fs from 'fs';

const inputPath = './materials.json';
const outputPath = './materials_with_clearcoat.json'; // or overwrite inputPath

// Read the file
const json = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

let updated = 0;

for (const key in json) {
  if (key.toLowerCase().includes('floor')) {
    json[key].clearcoat = 1;
    json[key].color ="#ff0000" ;
    updated++;
  }
}

fs.writeFileSync(outputPath, JSON.stringify(json, null, 2));
console.log(`Updated ${updated} materials with 'floor' in name. Output: ${outputPath}`);
