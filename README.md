# Barbershop POC

A modern, 3D, interactive barbershop website (work in progress). The layout takes its cues from a friendly neighborhood barbershop site: big bold hero, simple service list, reviews, locations and mixtapes. Everything else is original: video loops, scroll animation, an interactive 3D barber pole and a 3-step booking flow.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

## What's in it

- **Video hero** that plays a looping clip behind a split-letter headline animation.
- **Interactive 3D barber pole** (three.js). Drag, swipe or use the arrow keys to spin it. It loads lazily and pauses when it's offscreen.
- **Scroll animation** (GSAP ScrollTrigger + Lenis smooth scroll): a scroll-speed marquee, staggered reveals, counters, and a video card that grows to full screen.
- **Service list with hover photo previews** that follow the cursor on desktop.
- **"Inside the shop" gallery**: scrolling down slides a strip of shop photos sideways, with parallax inside each frame. On phones it becomes a swipeable strip.
- **Location cards** reveal a shop photo from the pointer position on hover.
- **3-step booking dialog**: service, then shop, then time. It's front-end only for now.
- Respects `prefers-reduced-motion`, keyboard focus, and mobile layouts down to 360px.

## Placeholder content

The brand name "Fresh Cut Co.", prices, shop addresses, reviews and mixtapes are placeholders in `src/data.js` and `index.html`. The reviews are samples written for layout and must be replaced with real ones before launch.

The "Every cut is a craft" video (`reel.mp4`) is a slideshow of the shop photos made by `bash tools/make-reel.sh`; edit the `SHOTS` list there to change photos or crops. The other videos in `public/videos/` are rendered 3D loops, made by `npm run videos` (`tools/render-videos.mjs`, which needs ffmpeg). Swap in real shop footage by replacing `pole.mp4`, `scissors.mp4` and `strands.mp4` and their `.jpg` posters. Use short 1280x720 H.264 clips with no audio, 2 MB or less each.

## Design tooling

This repo includes the [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) skill (MIT, v2.15.0) at `.claude/skills/ui-ux-pro-max/`. Claude Code picks it up automatically when working in this repo and uses it for design-system choices (palette, typography, layout patterns), UX/accessibility checks, and Three.js guidance.

Only the core skill is vendored. It is local data plus a standard-library Python search script, with no network calls or package installs. The upstream repo's extra skills (brand, logo, slides, banners) were left out on purpose.

Try it from the repo root (Python 3 required):

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "barbershop grooming booking premium" --design-system -p "Barbershop"
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "3d hero performance mobile" --stack threejs
```

### Photos

Shop photos are free [Unsplash](https://unsplash.com) images (Unsplash License; paid Unsplash+ photos are not used), saved in `public/photos/` (resized for the web) and listed with photographer credits in `src/data.js`. Replace them with photos of the real shop when you have them.
