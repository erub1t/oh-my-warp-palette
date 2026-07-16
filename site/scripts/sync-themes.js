import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const sourceDir = path.join(repoRoot, 'themes');
const targetDir = path.join(__dirname, '../public/themes');

fs.mkdirSync(targetDir, { recursive: true });

const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.yaml'));
for (const file of files) {
  fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
}

console.log(`Synced ${files.length} themes to ${targetDir}`);
