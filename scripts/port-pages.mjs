/* Convert design-export/pages/*.html into .astro pages on the Page layout. */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, parse } from 'node:path';

const SRC = 'design-export/pages';
const OUT = 'src/pages';

const files = (await readdir(SRC)).filter((f) => f.endsWith('.html'));
for (const file of files) {
  const html = await readFile(join(SRC, file), 'utf8');
  const slug = parse(file).name;

  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1].trim() ?? 'Fettle';
  const lede = html.match(/<p class="lede">([\s\S]*?)<\/p>/)?.[1].replace(/<[^>]*>/g, '').trim();

  let main = html.match(/<main>([\s\S]*?)<\/main>/)?.[1] ?? '';
  main = main.replace(/^\n/, '').replace(/\s+$/, '');
  // .html links between pages become clean routes
  main = main.replace(/href="([a-z-]+)\.html([^"]*)"/g, 'href="/$1$2"');
  main = main.replace(/href="\.\.\/Fettle Home\.html([^"]*)"/g, 'href="/$1"');
  // void elements must be self-closed for the Astro compiler
  main = main.replace(/<(input|img|br|hr|meta|source)\b([^>]*?)(?<!\/)>/g, '<$1$2 />');

  const frontmatter = [
    '---',
    "import Page from '../layouts/Page.astro';",
    '---',
    '',
    `<Page title=${JSON.stringify(title)}${lede ? ` description=${JSON.stringify(lede)}` : ''}>`,
    main,
    '</Page>',
    '',
  ].join('\n');

  await writeFile(join(OUT, `${slug}.astro`), frontmatter);
  console.log(`${file.padEnd(22)} -> src/pages/${slug}.astro`);
}
