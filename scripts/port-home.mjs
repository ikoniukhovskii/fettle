/* Mechanical port of design-export/editorial/home.jsx into an ES module.
   Kept as a script so the port can be re-run if the canvas is re-exported. */
import { readFile, writeFile } from 'node:fs/promises';

let s = await readFile('design-export/editorial/home.jsx', 'utf8');

/* 1. Drop the canvas mount and the tweaks panel — the panel is a design-time
      tool, and TWEAK_DEFAULTS becomes a frozen constant in production. */
s = s.replace(/\n\s*<TweaksPanel>[\s\S]*?<\/TweaksPanel>\n/, '\n');
s = s.replace(/\nReactDOM\.createRoot\([\s\S]*$/, '\n');
s = s.replace(/const \[t, setTweak\] = useTweaks\(TWEAK_DEFAULTS\);/, 'const t = TWEAK_DEFAULTS;');
s = s.replace(/\/\*EDITMODE-(BEGIN|END)\*\//g, '');

/* 2. SSR-safe browser globals. */
s = s.replace(
  /const reduceMotion =\n\s*window\.matchMedia && window\.matchMedia\('\(prefers-reduced-motion: reduce\)'\)\.matches;/,
  `const isBrowser = typeof window !== 'undefined';\nconst reduceMotion =\n  isBrowser && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;`
);
// the ticker IIFE starts a rAF loop + interval at module scope
s = s.replace(/(const ticker = \(\(\) => \{\n)/, '$1  if (!isBrowser) return { add() {}, remove() {} };\n');

/* 3. Images: string paths -> imported assets (hashed + optimized at build). */
const IMG = {
  'hero-drawing-room.webp': 'heroDrawingRoom',
  'kitchen-garden.webp': 'kitchenGarden',
  'dining-skylight.jpg': 'diningSkylight',
  'living-room.gif': 'livingRoom',
  'before-after-before.jpeg': 'beforeAfterBefore',
  'before-after-after.png': 'beforeAfterAfter',
  'before-after2-before.png': 'beforeAfter2Before',
  'before-after2-after.png': 'beforeAfter2After',
  'carousel-green-living.png': 'carouselGreenLiving',
  'carousel-blue-living.png': 'carouselBlueLiving',
  'carousel-hallway.png': 'carouselHallway',
  'carousel-drawing-room.png': 'carouselDrawingRoom',
  'carousel-kitchen.png': 'carouselKitchen',
  'carousel-skylight.jpg': 'diningSkylight', // byte-identical duplicate
};
for (const [file, ident] of Object.entries(IMG)) {
  s = s.split(`'editorial/img/${file}'`).join(ident);
}

/* 4. Static .html links -> Astro routes. */
s = s.replace(/window\.location\.href = 'pages\/contact\.html';/, "window.location.href = '/contact';");
s = s.replace(/'pages\/([a-z-]+)\.html'/g, "'/$1'");

/* 5. Module preamble + export. */
const imports = [...new Set(Object.values(IMG))]
  .map((ident) => {
    const file = Object.keys(IMG).find((f) => IMG[f] === ident);
    const mod = `${ident}Asset`;
    return (
      `import ${mod} from '../../assets/img/${file.replace(/\.\w+$/, '.webp')}';\n` +
      `const ${ident} = ${mod}.src;`
    );
  })
  .join('\n');

s = `import React from 'react';\n${imports}\n\n${s}`;
s = s.replace(/\nfunction App\(\) \{/, '\nexport default function Home() {');

await writeFile('src/components/home/Home.jsx', s);
console.log('wrote src/components/home/Home.jsx');
