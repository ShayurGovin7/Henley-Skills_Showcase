# Holographic showcase of skills and achievements

An interactive alternative to a list-style CV. A 3D hologram built from a single photo
stands on a projector base while skills orbit around it. Select any skill to see its
rating, the story behind it, the achievements that earned it and what comes next.

The hologram is not a video. The photo is turned into roughly 110,000 glowing points,
each placed in 3D using a depth map, and drawn by custom shaders with scanlines,
flicker, signal glitches and a materialise effect when the page loads.

## Quick start

You need [Node.js](https://nodejs.org) 20 or newer (22 recommended).

```bash
npm install
npm run dev
```

Open the address it prints, usually http://localhost:5173. Leave it running while you
edit: the page refreshes each time you save a file.

## Edit your content

All personal content lives in two files.

| What you want to change | File |
| --- | --- |
| Name, role, side project, intro line, browser tab title | `src/data/profile.ts` |
| Skills, ratings, stories, achievements, next steps | `src/data/skills.ts` |
| Colours and fonts | the top of `src/index.css` |
| The photo used for the hologram | see "Use a different photo" below |

### Skills

Each skill in `src/data/skills.ts` looks like this:

```ts
{
  id: 'data-engineering',          // unique, lowercase with dashes
  name: 'Data engineering',        // label on the orbit
  branch: 'Craft',                 // 'Craft', 'Builder', 'People' or 'Next branch'
  rating: 70,                      // 0 to 100
  headline: 'One sentence under the skill name.',
  story: [
    'First paragraph.',
    'Second paragraph.',
  ],
  evidence: [                      // shown under "Achievements"
    'An achievement',
    'Another achievement',
  ],
  nextLevel: 'What you will do to raise the rating.',
},
```

- **Change a rating:** edit the number.
- **Add a skill:** copy a whole `{ ... },` block, paste it before the final `]`, and change every field. Give it a new `id`.
- **Remove a skill:** delete its whole `{ ... },` block.
- **Mark a skill as still developing:** add `locked: true,` and it shows in amber.

Between 4 and 12 skills fits the orbit best.

### Use a different photo

```bash
pip install "rembg[cpu]" pillow numpy scipy
python scripts/prepare_hologram.py path/to/photo.jpg
```

This removes the background and writes `me-cutout.png` and `me-depth.png` into
`src/assets/hologram/`. A well-lit head-and-shoulders photo works best.


## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the site locally with live reload |
| `npm run build` | Builds the production site into `dist/` |
| `npm run preview` | Serves the built `dist/` folder locally to check it |
| `npm run build:single` | Builds one self-contained `dist-single/index.html` you can share as a file |

## How it works

| Part | Tool |
| --- | --- |
| Language | TypeScript |
| UI | React and Vite |
| 3D | Three.js, React Three Fiber and drei |
| Hologram look | Custom GLSL shaders and postprocessing (bloom, chromatic aberration, noise, vignette) |
| Animation | Framer Motion |
| Styling | Tailwind CSS and plain CSS tokens |
| Photo processing | Python with rembg, NumPy, SciPy and Pillow |

| File | Role |
| --- | --- |
| `scripts/prepare_hologram.py` | Cuts out the photo and builds its depth map |
| `src/lib/buildPoints.ts` | Turns each visible pixel into a 3D point |
| `src/shaders/hologram.ts` | Scanlines, flicker, glitches and the materialise effect |
| `src/components/Scene.tsx` | Camera, effects and layout for desktop and phone |
| `src/components/SkillOrbit.tsx` | The orbiting skill buttons |
| `src/components/SkillPanel.tsx` | The story and achievements panel |


## Accessibility

- Every skill is a real button you can reach with the keyboard, and the skill list offers a plain alternative to the orbit.
- In the story panel, `Esc` closes it and the arrow keys move between skills.
- Visitors who have "reduce motion" switched on see a still hologram with no glitches.
- On phones the story opens as a bottom sheet and the hologram uses fewer points.

## Credits

Built by Shayur Govin with Claude (Anthropic) as an AI coding partner. Uses React,
Three.js, React Three Fiber, drei, postprocessing, Framer Motion, Tailwind CSS and rembg.

Released under the MIT licence.
