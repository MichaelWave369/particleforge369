import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const lt = String.fromCharCode(60);
const gt = String.fromCharCode(62);

const lines = [
  `${lt}!doctype html${gt}`,
  `${lt}html lang="en"${gt}`,
  `  ${lt}head${gt}`,
  `    ${lt}meta charset="UTF-8" /${gt}`,
  `    ${lt}meta name="viewport" content="width=device-width, initial-scale=1.0" /${gt}`,
  `    ${lt}meta name="description" content="ParticleForge369: a claim-safe particle simulation and receipt lab." /${gt}`,
  `    ${lt}title${gt}ParticleForge369${lt}/title${gt}`,
  `  ${lt}/head${gt}`,
  `  ${lt}body${gt}`,
  `    ${lt}div id="root"${gt}${lt}/div${gt}`,
  `    ${lt}script type="module" src="/src/bootstrap.jsx"${gt}${lt}/script${gt}`,
  `  ${lt}/body${gt}`,
  `${lt}/html${gt}`,
  ''
];

writeFileSync(resolve(root, 'index.html'), lines.join('\n'));
console.log('Wrote index.html for Vite.');
