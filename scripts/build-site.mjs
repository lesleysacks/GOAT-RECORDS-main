import { cpSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
const check = spawnSync(process.execPath, [join(root, 'scripts/check-site.mjs')], { stdio: 'inherit' });
if (check.status !== 0) process.exit(check.status ?? 1);

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const entry of ['index.html', 'favicon.svg', 'robots.txt', 'css', 'js', 'data', 'images']) {
  cpSync(join(root, entry), join(dist, entry), { recursive: true });
}

if (existsSync(join(dist, 'admin'))) {
  console.error('Production build included the editor.');
  process.exit(1);
}

console.log('Production build wrote dist/ without the editor.');
