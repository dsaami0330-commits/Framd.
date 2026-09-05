# Framd. — portfolio site

Static site. No build step, no frameworks, no dependencies to install.
Open `index.html` in a browser and it runs.

## Files

```
index.html     structure
style.css      all styling
script.js      the WORKS list + playback logic
videos/        web-ready .mp4 files (H.264)
posters/       auto-generated still frames
encode.sh      the ffmpeg script that produced videos/ and posters/
```

## Adding a video

Two steps.

**1. Convert it.** Source files must become H.264 MP4 — HEVC `.mov` files
straight off the camera do not play in Chrome or Firefox. Run:

```bash
ffmpeg -i "SOURCE.mov" -c:v libx264 -crf 24 -preset slow -profile:v high -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "videos/name.mp4"
```

Then pull a poster frame from it:

```bash
ffmpeg -ss 1 -i "videos/name.mp4" -frames:v 1 -q:v 3 "posters/name.jpg"
```

**2. List it.** Add an entry to the `WORKS` array at the top of `script.js`:

```js
{
  type: 'short',              // 'short' = 9:16 grid, 'long' = 16:9 rows
  file: 'name.mp4',
  poster: 'name.jpg',
  title: 'Video Title',
  tags: 'Short Form · Client',
  dur: '0:45'                 // display only
}
```

Nothing else needs touching. Long-form rows appear automatically once the
first `type: 'long'` entry exists.

## How playback is kept fast

- The page loads **poster images only**. No video downloads on arrival.
- Short-form tiles attach their source and start a silent loop only when
  scrolled into view, and pause when they leave.
- Clicking anything opens a full player with sound and controls.
- `saveData` and `prefers-reduced-motion` visitors get still posters instead
  of auto-playing previews.
- Every file is encoded with `+faststart`, so playback begins before the
  file finishes downloading.

## Pricing section

Tiers are plain HTML in `index.html` under `<section id="pricing">` — edit the
numbers and bullet points directly. The Short Form / Long Form switch is driven
by `.switch__btn` elements whose `data-panel` matches a panel id.

Deliberately NOT on the page: the per-video tool/COGS figures from the source
pricing files. Those reveal your margin to anyone reading the site — keep them
in the internal model only.

## Fonts

Headings use **Clash Display**, body uses **General Sans**, both loaded from
Fontshare (free for commercial use). They are pulled from a CDN, so the page
needs an internet connection to render them — offline it falls back to the
system sans and looks noticeably plainer.

Note: requesting `satoshi` from the Fontshare API silently returns General Sans
instead. Ask for `general-sans` explicitly, or the CSS will reference a font
family that never loads.

## Compression results

| Video | Original | Web version |
|---|---|---|
| Kolton | 80 MB | 16 MB |
| Football History | 62 MB | 11 MB |
| Eric 01 | 61 MB | 14 MB |
| Eric 03 | 150 MB | 36 MB |
| Portfolio Cut | 61 MB | 8.2 MB |
| Feature 01 (long-form) | 650 MB | 176 MB |

Originals were never modified — everything in `videos/` is a copy.

## Publishing

Drag the whole folder onto [netlify.com/drop](https://app.netlify.com/drop),
or push it to a GitHub repo and enable Pages. No configuration required.
