# GOAT RECORDS — Hardening test report

This report covers the post-refactor hardening pass. It is not a production certification. The site was compared with the pre-refactor `main` commit `eeb7df5` for behavior and appearance. Implementation differences were ignored unless they changed what a visitor sees or how content is maintained.

Checked in headless Chrome on Linux against `http://127.0.0.1:8080/`, with the pre-refactor page on port `8090` for the featured-section comparison. There is no automated unit-test suite in the repository.

## Automated / static checks

These were read from the source or executed in Node without a browser.

| Check | Result |
| --- | --- |
| No framework, bundler, backend, or database added | Pass. Pages are HTML, CSS, and ES modules. |
| `window.GOAT` is the only assigned global | Pass. `js/app.js` and `admin/js/admin.js` only. No `window.renderer` or `window.goatData`. |
| No `innerHTML` in site or admin scripts | Pass. Text is set with `textContent`. |
| Event `date` is the stored field | Pass. `day` and `month` are gone from `data/events.json`. The admin save deletes them if an older object still has them. |
| Featured artist is selected only by `artistId` | Pass. `artists.json` no longer stores a `featured` boolean. The admin no longer rewrites one. |
| Artist renderer has no hardcoded names, images, bios, or URLs | Pass. Those values are read from the artist object. |
| Location is one contact string | Pass. `locationPrimary` and `locationRegion` were removed. The contact block derives the two lines from `contact.location`. |
| Unused `.luda-wide` rules | Removed after confirming no HTML or JS still uses that class. |
| JSON files parse | Pass after the data edits. |
| Image files that nothing in `data/` references | Reported below. Not deleted. |

## Browser checks

Chrome, six widths, after the fade-in observer had time to run. Horizontal overflow is `scrollWidth - clientWidth`.

| Width | Overflow | Nav | Roster | Events | Merch | Gallery |
| --- | --- | --- | --- | --- | --- | --- |
| 1440 | 0 | Desktop links | 7 cards | 6 rows | 4 | 9 |
| 1280 | 0 | Desktop links | 7 | 6 | 4 | 9 |
| 1024 | 0 | Desktop links | 7 | 6 | 4 | 9 |
| 768 | 0 | Hamburger | 7 | 6 | 4 | 9, two masonry columns |
| 390 | 0 | Hamburger | 7 | 6 | 4 | 9 |
| 360 | 0 | Hamburger | 7 | 6 | 4 | 9 |

Before `html { overflow-x: hidden }`, 390 and 360 reported 1px and 2px of overflow. The only elements past the viewport were the ticker phrase spans, which the ticker already clips. The same ticker overflow exists on pre-refactor `main`. The document no longer grows a horizontal scrollbar.

Other browser results:

- Featured showcase at 1440 uses the stylesheet's two columns. The photo is on the left. The name, genres, biography, stats, and buttons are on the right. Pre-refactor `main` nested the copy inside the photo because `.featured-inner` was left unclosed, so the text covered the portrait. That nesting was not restored.
- LUDA G's biography includes the sentence that was only in the old HTML: "From local open mics to packed venues — every bar he drops is built to last."
- Contact lines derived from `contact.location` are "Paarl, South Africa" and "Western Cape". The footer uses the full location string.
- Event days and months match the dates: 04 Apr 2026, 12 Apr 2026, 25 Apr 2026, 09 May 2026, 22 May 2026, 14 Jun 2026. DÆMON B2B SET uses the sold-out button.
- At 390 the footer copyright wraps, and "Crafted with dominance." sits clear of the fixed music button.
- At 768 the mobile menu opens, the links are opaque, and Escape closes it and returns focus to the button.
- Gallery: click opens the lightbox, Escape closes it, Enter on a focused item opens it, and a click on the backdrop closes it.
- Console on a full load: no page errors and no failed responses from this site.
- Public global visible to the page is `window.GOAT` only.

### Featured artist swap

`data/featured-artist.json` was changed from `luda-g` to `kay-medusa`, the page was reloaded with the cache disabled, then the file was restored.

| Surface | After the swap |
| --- | --- |
| Showcase name | KAY_MEDUSA |
| Image | `images/KAY_MEDUSA.jpeg` |
| Biography | Kay's biography, not LUDA G's |
| Genres | Hip-Hop, Rap, and the location pill |
| Socials | IG, TW, YT (the networks present on that artist) |
| Wide roster card | KAY_MEDUSA |
| Rest of the roster | LUDA G remains as a normal card |
| 360px overflow | 0. The single-token name stays inside the column |

The file on disk is `luda-g` again.

### Events with bad data

The events file was replaced in the browser only. The section stayed up, and the other sections still rendered.

| Case | Result |
| --- | --- |
| Available event with a valid date | Day and month derived (`01` / `Aug 2026`) |
| Sold-out event | Outline button |
| Several tags | All rendered |
| Tags omitted | Row still rendered |
| Invalid date plus legacy `day` / `month` | Fallback text used (`09` / `Legacy`) |
| `null` entry | Skipped |
| Title that is not a string | Shown as "Untitled event" |
| Empty `events` array | "No dates announced yet." The rest of the page stayed |

### Images

| Case | Result |
| --- | --- |
| Valid artist image | Displayed |
| Missing file | Image removed, initials left in place |
| Empty `image` | Initials, no request for a bad URL |
| `javascript:` URL | Not applied to `src` |
| Gallery empty `image` | Gradient placeholder |
| Gallery real image | Displayed |
| Gallery missing file and unsafe URL | Placeholder, no script URL |

One broken image did not remove the other cards.

### Admin

Loaded at `/admin/` in Chrome. Edits were checked in the export textarea. Nothing was written to `/data`.

| Action | Result |
| --- | --- |
| Artists load | 7 |
| Create then delete an artist | Both worked in the session |
| Featured select set to `geo-flame` | Export `artistId` changed. No `featured` booleans were written |
| Event edit and save | Export has `date` and does not reintroduce `day` or `month` |
| Merchandise list | 4 |
| Gallery list | 9 |
| Label form | Name and `info@goatrecords.co.za` filled from JSON |

## Manual checks

A person should still do these. They were not treated as certified.

- Listen to the music button and confirm the tone is acceptable.
- Submit the booking and newsletter forms and confirm the on-page message. They do not send mail.
- Tab from the skip link through the desktop nav, a roster card, the lightbox, and both forms.
- Repeat the 390px footer and menu check in Safari and Firefox.
- Open the admin export, replace the files under `data/`, and reload the public page.

## Not tested

- Real form delivery. There is no mail service.
- Payment or checkout. Merch buttons do not charge anyone.
- A full accessibility audit, screen reader pass, or contrast measurement.
- Deployment to GitHub Pages, Netlify, or any host.
- Firefox, Safari, or a physical phone. This pass used Chrome only.
- Authenticated admin access. The admin page has no login.

## Regression checklist

Compared with pre-refactor `main` for what a visitor can do and see.

| Area | Result |
| --- | --- |
| Navigation and section anchors | Same labels and targets |
| Hero, glitch title, canvas | Present |
| Featured artist | Same artist, stats, and socials. Layout now matches the two-column stylesheet instead of the nested-photo bug |
| Artist roster | Same seven artists. Wide card follows `artistId` |
| Events | Same six dates, venues, tags, and sold-out state. Display comes from `date` |
| Merchandise | Same four products and prices. `merch.css` is linked, so the grid rules apply |
| Gallery | Same nine records. Lightbox opens, Escape closes, backdrop click closes |
| Bookings and newsletter | Still browser-only confirmation |
| Contact and footer | Same addresses, phone, hours, and location lines |
| Mobile navigation | Hamburger at 768px and below. Escape closes it |
| Music button | Still fixed at the bottom right. Footer text no longer sits underneath it on a narrow screen |
| Breakpoints | 900, 768, and 500, as in the stylesheet |

Known appearance differences that were kept on purpose:

- The featured copy is beside the photo, which is what `featured-artist.css` describes. The old page painted that copy on top of the photo.
- The featured location pill uses the city from the artist record (`Paarl`). The old HTML hardcoded `Paarl , 7646`, which is not in the JSON.
- The newsletter script still asks for `@` and `.`. The field is `type="email"`. The old script only checked for `@`.

## Duplicate images

These files are in `images/` and are not referenced by the current JSON. They were not deleted.

- `Dj_Les.jpg` (the roster uses `DJ_LES.jpeg`)
- `kay_medusa.jpg` (the roster uses `KAY_MEDUSA.jpeg`)
- `YOUNG_OG_CPT.jpg` (the roster uses `YOUNG_OG_CPT.jpeg`)
- `LUDA_G.jpeg` (the roster uses `luda g poster pic.jpg`)
- `KAITLYN_FILANDER.jpeg`
- `KATTIE.jpeg`

## Remaining debt

- The admin Label tab does not edit phone, location, hours, or socials. Those stay in `label-info.json`.
- New events saved in the admin default to `available`. Sold-out status is preserved when you edit an existing sold-out row, but the form has no status control.
- Booking and newsletter submissions are not delivered.
- Sold-out event buttons are still links to `#bookings`, matching the old page.
- First-paint sentences in `index.html` repeat the JSON until the files load. They are the fallback if JavaScript is slow, not a second source the renderer keeps.
- The duplicate image files above are still in the folder.
