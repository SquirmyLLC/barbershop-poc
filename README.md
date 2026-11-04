# Barbershop POC

A modern, 3D, interactive barbershop website (work in progress).

## Design tooling

This repo includes the [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) skill (MIT, v2.15.0) at `.claude/skills/ui-ux-pro-max/`. Claude Code picks it up automatically when working in this repo and uses it for design-system choices (palette, typography, layout patterns), UX/accessibility checks, and Three.js guidance.

Only the core skill is vendored. It is local data plus a standard-library Python search script, with no network calls or package installs. The upstream repo's extra skills (brand, logo, slides, banners) were left out on purpose.

Try it from the repo root (Python 3 required):

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "barbershop grooming booking premium" --design-system -p "Barbershop"
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "3d hero performance mobile" --stack threejs
```
