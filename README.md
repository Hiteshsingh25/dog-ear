# Dog-Ear Book Club — subscription landing page template

Next.js 15 (App Router, React 19, TypeScript) port of a Webflow + Barba + Slater
marketing site pattern: a fluid em-based token system, eleven colour-blocked
sections, two 120-frame canvas image sequences (one autoplaying, one scrubbed
by scroll), and a `data-*` module registry that replaces Barba's lifecycle.

Everything branded here is original placeholder material: the name, mark,
copy, the 45 fictional books and their procedurally drawn covers, and both
image sequences (rendered from code, no footage). Swap them for your own.

```bash
npm install
npm run dev        # http://localhost:3130
npm run build && npm start
```

## Where things live

| Path | What |
|---|---|
| `src/app/globals.css` | **The token system.** One fluid root font size (`--size-font`), palette, type scale, grid, easings, button tokens. Breakpoints redefine the three inputs, not the layout. |
| `src/styles/site.css` | Every component class, all `em`. Section clipping (`.is--inner-clip` / `.is--outer-clip`), the elastic hover states, ears, pop-up, sliders, accordion. |
| `src/app/layout.tsx` | Server layout: fonts via `next/font/local`, the persistent `TransitionProvider` (overlay + `navigate()`). |
| `src/app/template.tsx` | Re-mounts per route. One `useGSAP` boots Lenis, calls `mountAll(root)`, plays the intro/enter animation; cleanup tears all of it down. |
| `src/modules/registry.ts` | The module list + `mountAll`. Each module = `{ name, selector, init(el) → teardown }`. |
| `src/modules/sequence.ts` | Canvas sequence engine (binary-split preloading, module-scope bitmap cache, DPR ≤ 2, static fallback). Used by `heroSequence` (autoplay) and `boxSequence` (scrub + lerp). |
| `src/modules/*.ts` | button, backgroundAnimation, callOut, handwrittenText, footerParallax, popUp, booksSlider, exclusiveSlider, accordion, badge, benefits, momentumHover, gift, taglineCurve, formValidate, genreInteraction, plopIn, emojiRain, checkContrast, menu, intro. |
| `src/components/sections/*` | The eleven sections as server components with `data-*` hooks. |
| `src/data/site.ts` | All copy. `src/data/books.json` — the fictional catalogue + cover params. |
| `scripts/` | Asset pipeline (below). |

## Asset pipeline (all procedural)

```bash
npm run covers          # 45 SVG covers → public/covers/*.webp   (headless Chromium)
npm run frames          # hero (120) + box (120 desktop + 120 mobile) + product still
npm run frames -- box --count 12   # quick preview
npm run snap -- http://localhost:3130 1440 900 0 1200 2600   # QA screenshots → .snaps/
node scripts/interact.mjs          # slider / genre hover / accordion / menu / route QA
```

- `scripts/lib/cover-svg.mjs` — cover generator (bg, ink, accent, motif, layout, face).
- `scripts/scenes/hero-books.js` — three floating hardcovers on a seamless 5 s loop.
- `scripts/scenes/box.js` — the mailer tumbles in, settles, opens, camera pushes into the lid.
- Rendering uses the Chromium in Playwright's cache via `playwright-core` from the
  sibling `infracorp` project (`scripts/lib/chromium.mjs`); set `CHROMIUM_PATH` otherwise.

## Conventions worth keeping

- Nothing uses `rem`; almost nothing uses `px`. Resize 320 → 3840 and only the root changes.
- Buttons are tokens (`--button-*`, `--button-alt-*`); a variant overrides properties, not rules.
- `data-check-contrast` samples the ground behind a card and flips text colour — one card component for every colour.
- Every animated heading keeps real text in the DOM; SplitText runs on the client only.
- Reduced motion: sequences draw a static frame, sliders and reveals render their final state.
- Lenis + GSAP share one ticker (`src/lib/lenis.ts`); `html { scroll-behavior: initial }` on purpose.

## Env

`NEWSLETTER_WEBHOOK_URL` — optional; `/api/subscribe` forwards `{ email }` there.
