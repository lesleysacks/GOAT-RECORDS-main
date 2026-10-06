# GOAT RECORDS

Static website for GOAT RECORDS. The pages are HTML, CSS, and vanilla JavaScript. Content lives in JSON. There is no framework, build step, backend, or database.

The visual design is unchanged. The refactor separates structure, presentation, behavior, and content so the site can be updated without editing a large HTML file or copying the same card markup.

## Project structure

```
index.html                  Page structure and section anchors
admin/index.html            Browser editor (session only)
admin/css/admin.css
admin/js/                   Editor modules
css/variables.css           Design tokens
css/main.css                Reset, type, buttons, motion
css/components/             Navigation, hero, cards, forms
css/sections/               One file per page section
css/responsive.css          Shared breakpoints
js/app.js                   Public entry point
js/config.js                File names, social labels, date helper
js/dom.js                   DOM helpers and URL checks
js/data/loader.js           Loads each JSON file independently
js/data/store.js            In-memory content for the open page
js/components/              Roster, events, merch, gallery, chrome
js/ui/                      Navigation, lightbox, scroll, music
js/forms/                   Booking and newsletter (browser only)
js/canvas/hero-canvas.js    Hero light beams
data/                       Content files
images/                     Artist and artwork files
```

Open the site through a local server. `fetch` and ES modules do not work from a `file://` URL.

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`. The admin editor is `http://localhost:8080/admin/`.

## How content works

`js/app.js` loads every file in `data/`, keeps it on `window.GOAT.data`, and renders into the empty targets in `index.html`:

- `[data-render="featured-artist"]`
- `[data-render="artists"]`
- `[data-render="events"]`
- `[data-render="merchandise"]`
- `[data-render="gallery"]`

Brand, hero, navigation labels, about copy, contact, and footer text are filled from `data/site-config.json` and `data/label-info.json`. Section ids (`#about`, `#artists`, `#events`, and the rest) stay where they are so existing links keep working.

One missing or broken JSON file does not blank the rest of the page. That section shows a short message and the others still render.

Text from JSON is written with `textContent`. Image addresses are checked before they are applied. A missing image falls back to initials or a gradient block.

## Customization

| What you want to change | Edit |
| --- | --- |
| Brand name, logo text, tagline, copyright year | `data/site-config.json` → `brand` |
| Hero eyebrow, title, subtitle, buttons | `data/site-config.json` → `hero` |
| Ticker phrases | `data/site-config.json` → `ticker` |
| Navigation labels and the Book Now button | `data/site-config.json` → `navigation` |
| Section headings | `data/site-config.json` → `sections` |
| Newsletter wording | `data/site-config.json` → `newsletter` |
| Colors | `data/site-config.json` → `theme`, or the tokens in `css/variables.css` |
| Fonts | `css/variables.css` (`--font-display`, `--font-body`, `--font-cond`) and the Google Fonts link in `index.html` |
| Artists | `data/artists.json` |
| Who is featured | `data/featured-artist.json` (`artistId` must match an artist `id`) |
| Events | `data/events.json` |
| Merch | `data/merchandise.json` |
| Gallery | `data/gallery.json` |
| About copy, stats, booking blurbs | `data/label-info.json` |
| Email, phone, location, office hours, socials | `data/label-info.json` → `contact`, `officeHours`, `socials` |
| Layout, spacing, animation | The CSS file for that section. Do not put CSS rules in JSON. |

Theme values are hex colors. On load they are applied to `--color-primary`, `--color-bg`, `--color-surface`, and `--color-text`. The older names (`--red`, `--black`, `--gray-dark`) point at those tokens, so existing CSS follows the config.

### Add an artist

Add an object to the `artists` array in `data/artists.json`. Do not add a card to `index.html`.

```json
{
  "id": "new-artist",
  "name": "NEW ARTIST",
  "status": "Signed",
  "genres": ["Hip-Hop"],
  "location": "Paarl, SA",
  "image": "images/new-artist.jpg",
  "bio": "Full biography.",
  "shortBio": "Short line used on the roster card.",
  "socials": { "instagram": "https://instagram.com/example" },
  "featured": false
}
```

`status` is `Signed` or `Upcoming`. `image` is a path under `images/` or a full `http` URL. Leave `image` empty to show initials on a dark gradient. Put the file in `images/` with the same spelling and capitalization the JSON uses.

### Choose the featured artist

Set `artistId` in `data/featured-artist.json` to an `id` from `artists.json`. The showcase and the wide roster card both use that id. The component does not assume the featured artist is LUDA G. Optional `stats` on the artist object (`tracksReleased`, `monthlyListeners`, `yearsActive`) appear in the showcase. Optional `featured_rank` such as `"★ #1 Lead Artist"` sets the badge.

### Add an event

Add an object to `events` in `data/events.json`. `date` is the canonical value (`YYYY-MM-DD`). The day and month on the page are derived from it. `day` and `month` are only a fallback if `date` is missing.

```json
{
  "id": "event-7",
  "title": "SHOW NAME",
  "date": "2026-07-01",
  "venue": "Venue Name",
  "location": "City, Country",
  "tags": ["Live Show"],
  "type": "Showcase",
  "status": "available",
  "buttonText": "Get Tickets"
}
```

`status` of `sold-out` uses the outline button. Anything else uses the red button. `buttonText` is the label.

### Add merchandise

Add an object to `merchandise` in `data/merchandise.json`. There is no cart and no payment.

```json
{
  "id": "merch-5",
  "name": "Product Name",
  "description": "Short description",
  "price": 500,
  "currency": "ZAR",
  "new": false,
  "symbol": "G",
  "type": "TEE",
  "gradient": "linear-gradient(135deg,#1a1a1a,#2a2a2a)",
  "image": ""
}
```

A long `symbol` (more than three characters) uses the smaller type size. A real image path replaces the symbol. An empty `image` keeps the gradient mark.

### Add gallery content

Add an object to `gallery` in `data/gallery.json`.

```json
{
  "id": "gallery-10",
  "label": "STAGE",
  "description": "Live stage performance",
  "height": 280,
  "gradient": "linear-gradient(135deg,#1a0000,#330000,#000)",
  "image": ""
}
```

If `image` is empty or the file fails to load, the gradient block is used. `height` only affects that fallback.

## Admin editor

Open `admin/index.html` through the same local server. It can edit artists, events, merchandise, gallery items, the featured artist, and the main label fields, and it can import or export a JSON backup.

Those edits exist only in the current browser tab. Refreshing the admin page loads the files from `data/` again and drops unsaved work. The editor cannot write files to disk, to GitHub, or to a host. To publish:

1. Export or copy the JSON from the Import/Export tab.
2. Split the collections back into the matching files in `data/` (`artists`, `events`, `merchandise`, `gallery`, `featuredArtist`, `label`).
3. Redeploy the static folder.

There is no login. Do not treat the admin page as private just because it lives in a folder.

The booking form and newsletter form only confirm input in the browser. They do not send email or store addresses.

## Development

- Keep page structure in HTML, appearance in CSS, behavior in `js/`, and copy in `data/`.
- Add a module only when it has one clear job. `js/app.js` is the only public script tag.
- After rendering new `.fade-in` nodes, scroll reveal picks them up automatically.
- Prefer `prefers-reduced-motion` for new animation. The hero canvas draws a single frame when that setting is on.

## Static hosting

Any static host works (GitHub Pages, Netlify, S3, a plain web server). Upload the folder as-is. Do not add a build command. The host must serve the site over HTTP so modules and JSON can load. It does not need write access to `data/`.
