/* One-time: the canvas export ships photographs as lossless PNG (up to 8.8 MB).
   Re-encode everything to WebP at a sane ceiling. Source of truth stays in
   design-export/; this writes the versions the site actually imports. */
import { readdir, mkdir, stat } from 'node:fs/promises';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const SRC = 'design-export/editorial/img';
const OUT = 'src/assets/img';

// widest the image is ever displayed at, x2 for retina
const WIDTHS = { 'hero-drawing-room': 2560, 'kitchen-garden': 2240, 'dining-skylight': 2240 };
const DEFAULT_WIDTH = 1920;

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => !f.startsWith('.'));
let before = 0, after = 0;

for (const file of files) {
  const { name, ext } = parse(file);
  if (name === 'carousel-skylight') continue; // byte-identical to dining-skylight
  const inPath = join(SRC, file);
  before += (await stat(inPath)).size;

  const animated = ext.toLowerCase() === '.gif';
  const img = sharp(inPath, { animated });
  const { width } = await img.metadata();
  const target = Math.min(width, WIDTHS[name] ?? DEFAULT_WIDTH);

  const outPath = join(OUT, `${name}.webp`);
  await img
    .resize({ width: target, withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
    .toFile(outPath);

  const size = (await stat(outPath)).size;
  after += size;
  console.log(
    `${file.padEnd(28)} ${(before && 0, ((await stat(inPath)).size / 1048576).toFixed(2)).padStart(6)} MB -> ${(size / 1048576).toFixed(2)} MB`
  );
}
console.log(`\ntotal ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);
