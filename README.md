# James Han — Agricultural Science & Systems

Personal portfolio tailored to agronomic systems modeling and agronomy/geospatial analytics. The site presents selected industry experience, crop-modeling research, practical software projects, a publication, and an irrigation patent.

Live address: https://itsjameshan.github.io/

This is a dependency-free static site. Run `npm start` and open http://localhost:4173; no installation or build step is needed. `npm run check` validates JavaScript syntax. Fonts, artwork, and PDF/Word résumé downloads are served locally.

The page reads as one argument — crop physiology → field and geospatial data → evaluated models → commercial decision tools:

- **Hero:** portrait, statement, role-aware résumé download, and the four-step through-line.
- **Evidence (`#proof`):** the ±7 → ±3-day prediction error (interactive), 30 commercial crop models, CornSoyWater evaluation using five years of field data and a two-year irrigation experiment, and U.S. Patent 11,771,025.
- **Method (`#method`):** four chapters with conceptual figures; on wide screens the figure stays pinned and changes with the chapter in view (`#chapter-physiology`, `#chapter-data`, `#chapter-models`, `#chapter-tools`).
- **Case files (`#work`):** CornSoyWater plus native `<details>` case files (`#project-fieldnet`, `#project-cibo`, `#project-phenology`, `#project-blueberry`) that open from deep links.
- **Experience (`#path`), Role fit & résumés (`#fit`), Contact (`#contact`).**

Every figure carries a caption stating whether it is illustrative, conceptual, or decorative. Decorative animations stop within five seconds and motion is disabled under `prefers-reduced-motion`. The content, menu, and case files remain usable without JavaScript; method figures stay stacked when IntersectionObserver is unavailable. Source Serif is served as WOFF2 with the original TTFs as fallback; `assets/og-card.jpg` is the 1200×630 social preview.

Role-focused links:

- https://itsjameshan.github.io/?role=modeling#fit
- https://itsjameshan.github.io/?role=analytics#fit

The two downloadable résumés are verified snapshots of the October 3, 2026 tailored documents. The public portrait is retained from the previous website. Source Serif 4 is distributed under the SIL Open Font License in `assets/OFL.txt`.

Public source records:

- [CornSoyWater publication](https://doi.org/10.1016/j.agwat.2025.109454)
- [UNL doctoral research](https://digitalcommons.unl.edu/dissertations/AAI10247096/)
- [U.S. Patent 11,771,025](https://patents.google.com/patent/US11771025B2/en)
- [Blueberry application](https://github.com/itsjameshan/blueberry)

Design inspiration: [the Superlinear personal-homepage post](https://www.superlinear.academy/c/share-your-projects/personal-homepage-with-opus-5-5) and its [live homepage](https://www.lizheng.ai/en).
