// Renders the site's placeholder video loops (public/videos/*.mp4 + posters) from tools/clip.js.
// Usage: npm run videos   (needs ffmpeg and Playwright's Chromium)
import { createServer } from 'vite';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// Use the project's Playwright if installed, else a globally available one.
const { chromium } = require('playwright');
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';

const CLIPS = [
  { name: 'pole', seconds: 6, w: 1280, h: 720 },
  { name: 'scissors', seconds: 6, w: 1280, h: 720 },
  { name: 'strands', seconds: 8, w: 1280, h: 720, crf: '31' },
];
const FPS = +process.env.FPS || 30;
const ONLY = process.env.ONLY;
const server = await createServer({ server: { port: 5199 }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const c of CLIPS.filter(c => !ONLY || c.name === ONLY)) {
  const dir = `.frames/${c.name}`; rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  const page = await browser.newPage({ viewport: { width: c.w, height: c.h } });
  await page.goto(`http://localhost:5199/tools/clip.html?scene=${c.name}&w=${c.w}&h=${c.h}`);
  await page.waitForFunction('window.clipReady === true', null, { timeout: 60000 });
  const frames = c.seconds * FPS;
  for (let i = 0; i < frames; i++) {
    await page.evaluate(([t, L]) => window.renderFrame(t, L), [i / FPS, c.seconds]);
    await page.screenshot({ path: `${dir}/${String(i).padStart(4, '0')}.png`, timeout: 120000 });
  }
  await page.close();
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', `${dir}/%04d.png`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', c.crf || '24', '-preset', 'slow', '-movflags', '+faststart', '-an', `public/videos/${c.name}.mp4`]);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', `${dir}/0000.png`, '-q:v', '4', `public/videos/${c.name}.jpg`]);
  console.log('rendered', c.name);
}
await browser.close();
await server.close();
