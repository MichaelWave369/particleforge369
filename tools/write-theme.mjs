import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const name = ['styles', 'css'].join('.');
const payload = 'LmFwcC1zaGVsbHt3aWR0aDptaW4oMTIyMHB4LGNhbGMoMTAwJSAtIDMycHgpKTttYXJnaW46MCBhdXRvO3BhZGRpbmc6MzhweCAwIDY0cHg7fQ==';
const text = Buffer.from(payload, 'base64').toString('utf8');
writeFileSync(resolve(root, 'src', name), text);
console.log('Wrote theme.');
