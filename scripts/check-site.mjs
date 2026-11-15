import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (path) => readFileSync(join(root, path), 'utf8');
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

for (const file of [
  'data/artists.json',
  'data/events.json',
  'data/merchandise.json',
  'data/gallery.json',
  'data/featured-artist.json',
  'data/label-info.json'
]) {
  const data = JSON.parse(read(file));
  expect(data && typeof data === 'object', `${file} did not parse to an object`);
}

const artists = JSON.parse(read('data/artists.json')).artists;
expect(artists.length === 7, `expected 7 artists, found ${artists.length}`);
for (const artist of artists) {
  expect(existsSync(join(root, artist.image)), `missing image for ${artist.name}: ${artist.image}`);
  expect(artist.bio && artist.name, `artist record missing name or bio: ${artist.id}`);
}

const html = read('index.html');
for (const id of ['hero', 'featured-artist', 'about', 'artists', 'releases', 'events', 'merch', 'gallery', 'bookings', 'contact', 'mobile-menu', 'artist-dialog', 'lightbox', 'tone-transcript']) {
  expect(html.includes(`id="${id}"`), `index.html is missing #${id}`);
}
expect(!html.includes('href="#"'), 'index.html still has a placeholder href');
expect(!html.includes('admin/index.html'), 'public page links to the editor');
expect(html.includes('<main id="main">'), 'missing main landmark');
expect(html.includes('class="featured-content'), 'featured copy missing');
const visualEnd = html.indexOf('</div>\n      <div class="featured-content');
expect(visualEnd > 0, 'featured copy is not a sibling of the portrait');

const css = readdirSync(join(root, 'css'), { recursive: true })
  .filter((name) => String(name).endsWith('.css'))
  .map((name) => read(join('css', name)))
  .join('\n');
expect(!/gold|#d4af37|#ffd700|#00eaff/i.test(css), 'off-palette colour found in CSS');
expect(css.includes('#FF0000') || css.includes('var(--red)'), 'brand red missing');
expect(css.includes('prefers-reduced-motion'), 'reduced-motion styles missing');

const admin = read('admin/index.html');
expect(admin.includes('data-admin-local'), 'public editor lock missing');
expect(admin.includes('noindex'), 'editor is indexable');

const jsFiles = [];
function walk(dir) {
  for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
    const rel = join(dir, entry.name);
    if (entry.isDirectory()) walk(rel);
    else if (entry.name.endsWith('.js')) jsFiles.push(rel);
  }
}
walk('js');
for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', join(root, file)], { encoding: 'utf8' });
  expect(result.status === 0, `${file} failed syntax check\n${result.stderr}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Site check passed (${artists.length} artists, ${jsFiles.length} scripts).`);
