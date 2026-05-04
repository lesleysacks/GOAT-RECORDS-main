# GOAT RECORDS — Website Documentation

**Last Updated:** May 4, 2026

---

## 🎵 Quick Start

### Accessing the Admin Dashboard
1. Open `admin/index.html` in your browser
2. Use the tabs to manage:
   - **Artists** - Add/edit artist information and images
   - **Events** - Manage tour dates and bookings
   - **Merchandise** - Edit products and prices
   - **Gallery** - Manage gallery items
   - **Featured Artist** - Select which artist to feature
   - **Label Info** - Update contact information
   - **Import/Export** - Backup and restore all data

### Making Content Changes
All website content is managed through JSON files in the `/data/` folder. Changes made in the admin dashboard automatically update these files. No HTML editing required!

---

## 📁 Project Structure

```
GOAT-RECORDS-main/
├── index.html                 # Main website (AUTO-POPULATED from JSON)
├── admin/
│   └── index.html            # Admin Dashboard (EDIT CONTENT HERE!)
├── css/
│   ├── variables.css         # Color, typography, spacing
│   ├── main.css              # Global styles & resets
│   ├── responsive.css        # All media queries
│   ├── components/           # Reusable UI components
│   │   ├── hero.css
│   │   ├── cards.css
│   │   ├── forms.css
│   │   └── navigation.css
│   └── sections/             # Section-specific styles
│       ├── featured-artist.css
│       ├── about.css
│       ├── artists.css
│       ├── events.css
│       ├── gallery.css
│       ├── bookings.css
│       ├── newsletter.css
│       ├── contact.css
│       ├── footer.css
│       └── music-player.css
├── js/
│   ├── main.js               # Main entry point
│   ├── content-loader.js     # Loads JSON data (AUTO-RUN)
│   ├── renderer.js           # Renders dynamic content from JSON
│   ├── canvas/
│   │   └── hero-canvas.js    # Hero section animation
│   ├── ui/
│   │   ├── navigation.js     # Mobile menu & sticky nav
│   │   ├── gallery.js        # Gallery grid
│   │   ├── lightbox.js       # Image lightbox
│   │   ├── music-player.js   # Ambient sound toggle
│   │   └── scroll-animations.js
│   └── forms/
│       ├── booking-form.js   # Event booking form
│       └── newsletter.js     # Newsletter signup
├── data/                     # JSON DATA FILES (edited via admin dashboard)
│   ├── artists.json          # Artist roster
│   ├── events.json           # Tour dates & events
│   ├── merchandise.json      # Merch products
│   ├── gallery.json          # Gallery items
│   ├── featured-artist.json  # Featured artist selection
│   └── label-info.json       # Label info & contact
└── images/
    ├── luda g poster pic.jpg
    ├── DJ_LES.jpeg
    ├── KAY_MEDUSA.jpeg
    ├── Geo_flame.jpg
    ├── YOUNG_OG_CPT.jpeg
    ├── ENERGY.jpg
    ├── MIDNIGHT FREQUENCIES.jpg
    ├── KAITLYN_FILANDER.jpeg
    └── KATTIE.jpeg
```

---

## 🎯 How to Edit Content

### **Method 1: Use the Admin Dashboard (RECOMMENDED)**
1. Open `admin/index.html` 
2. Use intuitive forms to add/edit/delete content
3. Changes save to JSON files automatically
4. Export/import backup files for safekeeping

### **Method 2: Edit JSON Files Directly (Advanced)**
1. Open files in `/data/` folder with a text editor
2. Edit JSON data directly
3. Refresh website to see changes
4. **Be careful with JSON syntax!** Invalid JSON will break the site.

---

## 📊 Content Types & JSON Schema

### **Artists** (`data/artists.json`)
```json
{
  "id": "artist-id",
  "name": "Artist Name",
  "status": "Signed" | "Upcoming",
  "genres": ["Genre1", "Genre2"],
  "location": "City, Country",
  "image": "images/filename.jpg",
  "bio": "Full biography text",
  "shortBio": "Short bio for card display",
  "featured": true | false
}
```

### **Events** (`data/events.json`)
```json
{
  "id": "event-id",
  "title": "Event Title",
  "date": "2026-04-04",
  "day": "04",
  "month": "Apr 2026",
  "venue": "Venue Name",
  "location": "City, Country",
  "tags": ["Tag1", "Tag2"],
  "status": "available" | "sold-out"
}
```

### **Merchandise** (`data/merchandise.json`)
```json
{
  "id": "merch-id",
  "name": "Product Name",
  "description": "Product description",
  "price": 750,
  "currency": "ZAR",
  "new": true | false
}
```

---

## 🚀 Performance Optimization

### Current Performance Status
- ✅ All images fixed and paths corrected
- ✅ Accessibility (WCAG 2.1 AA compliant)
- ✅ Mobile responsive (375px to 1440px+)
- ✅ Web Audio memory leak fixed
- ✅ Content separated from presentation (JSON-based)

### Further Optimization Opportunities

**1. CSS Optimization**
```bash
# Minify CSS files (use any minifier)
npx cssnano input.css -o output.min.css

# Or use an online tool: https://cssnano.co/
```

**2. Image Optimization**
- Use WebP format with fallbacks
- Compress PNG/JPG: https://tinypng.com
- Add `loading="lazy"` attribute to below-fold images

**3. JavaScript Bundling**
```bash
# Install esbuild
npm install esbuild --save-dev

# Bundle all JS files
npx esbuild js/main.js --bundle --outfile=js/bundle.min.js
```

**4. CSS Concatenation**
Combine multiple CSS files into one for faster loading:
```html
<!-- Instead of 15 separate files -->
<link rel="stylesheet" href="css/styles.min.css">
```

**5. Lazy Loading**
```html
<!-- Add to images for below-fold loading -->
<img src="image.jpg" loading="lazy" alt="Description">
```

### Performance Targets
- **Lighthouse Score:** 80+
- **First Contentful Paint (FCP):** <3 seconds
- **Largest Contentful Paint (LCP):** <2.5 seconds
- **Cumulative Layout Shift (CLS):** <0.1

---

## 🛠️ Development

### Scripts Overview

| Script | Purpose | Dependencies |
|--------|---------|--------------|
| `content-loader.js` | Loads JSON data on page start | None |
| `renderer.js` | Renders content from JSON into HTML | content-loader.js |
| `navigation.js` | Mobile menu & sticky nav | None |
| `gallery.js` | Gallery grid generation | lightbox.js |
| `lightbox.js` | Image lightbox modal | None |
| `music-player.js` | Ambient sound toggle (Web Audio) | None |
| `hero-canvas.js` | Canvas animation | None |
| `booking-form.js` | Booking form submission | None |
| `newsletter.js` | Newsletter signup | None |
| `main.js` | Initialization & utilities | All |

### Adding New Features

1. **New Artist:** Add in admin dashboard (no coding needed!)
2. **New Product:** Edit in admin → Merch tab
3. **Custom CSS:** Add to appropriate CSS file in `/css/sections/`
4. **Custom JS:** Create module in `/js/ui/` or `/js/forms/`

---

## 🔒 Backup & Restore

### Export All Data
1. Open admin dashboard
2. Go to "Import/Export" tab
3. Click "Download All Data (JSON)"
4. Save file safely

### Restore From Backup
1. Open admin dashboard
2. Go to "Import/Export" tab
3. Click "Upload Data (JSON)"
4. Select your backup file
5. Data restores automatically

---

## 🌐 Deployment

### Option 1: Static Hosting (Recommended for Simple Sites)
- **Vercel:** https://vercel.com
- **Netlify:** https://netlify.com
- **GitHub Pages:** https://pages.github.com

### Option 2: Server/VPS
1. Upload all files to server
2. Set permissions: `chmod 755 data/` (so server can write JSON)
3. Add `.htaccess` for CORS if needed
4. Test all features work

### Deploy Checklist
- [ ] All images optimized
- [ ] CSS minified (optional but recommended)
- [ ] JS minified (optional but recommended)
- [ ] Admin dashboard password-protected (optional)
- [ ] Backup data/files regularly

---

## 📱 Mobile Responsiveness

Tested breakpoints:
- **Mobile:** 375px
- **Tablet:** 768px
- **Desktop:** 1024px+
- **Large Desktop:** 1440px+

All media queries centralized in `css/responsive.css` for easy management.

---

## ♿ Accessibility

**WCAG 2.1 AA Compliance:**
- ✅ Proper alt text on all images
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Color contrast ratio >4.5:1
- ✅ Mobile menu with proper semantics
- ✅ Form labels associated with inputs

### Screen Reader Support
- Test with: NVDA (Windows), JAWS, VoiceOver (Mac)
- All interactive elements keyboard accessible
- Semantic HTML used throughout

---

## 🐛 Troubleshooting

### Images Not Loading
1. Check image path in admin dashboard
2. Ensure file exists in `/images/` folder
3. Verify filename spelling and case (case-sensitive on servers!)
4. Use `images/filename.ext` format

### Content Not Updating
1. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. Hard refresh: Ctrl+F5 or Cmd+Shift+R
3. Check browser console for errors (F12)
4. Verify JSON files are valid (use https://jsonlint.com/)

### Music Player Not Working
1. Check browser console for audio errors
2. Ensure browser allows Web Audio API
3. Try different browser (Chrome, Firefox, Safari)
4. Check system volume is not muted

### Admin Dashboard Blank
1. Ensure data/JSON files exist
2. Check browser console (F12) for errors
3. Verify you're accessing `/admin/index.html` (not /admin/)
4. Try different browser

---

## 📈 Future Enhancements

### Phase 2 (Backend Integration)
- [ ] Backend server for form submissions
- [ ] Email notifications for bookings/newsletter
- [ ] Admin dashboard with user authentication
- [ ] Database for scaling beyond JSON files
- [ ] Image upload & storage
- [ ] Analytics tracking

### Phase 3 (Advanced Features)
- [ ] Artist login area
- [ ] Streaming integration (Spotify, SoundCloud)
- [ ] Ticket sales integration
- [ ] Email marketing automation
- [ ] SEO optimization & blog
- [ ] Social media feed integration

---

## 📞 Support

**Critical Issues:** Check `/data/*.json` files are present and valid

**Custom Development:** Modify CSS in `/css/sections/` or create new JS modules in `/js/`

---

## 📄 License

GOAT RECORDS Website — © 2026. All Rights Reserved.

---

## ✅ What's Fixed & Improved

### Critical Fixes ✔️
- [x] Fixed 5 missing artist images (DJ-LES, GEO FLAME, YOUNG OG CPT, YOUNG OG, BLXCKOUT)
- [x] Fixed broken image paths (`assets/img/` → `images/`)
- [x] Added descriptive alt text to all images
- [x] Replaced inline onclick handlers with proper event listeners
- [x] Added ARIA labels for accessibility

### Content Management ✔️
- [x] Extracted all hardcoded content to JSON files
- [x] Created admin dashboard for easy editing (no coding needed!)
- [x] Implemented content-loader to auto-populate website
- [x] Added renderer to dynamically display JSON data
- [x] Export/import functionality for data backup

### Code Quality ✔️
- [x] Fixed Web Audio memory leak in music player
- [x] Improved JavaScript organization (modules)
- [x] Added proper cleanup on page unload
- [x] Removed hardcoded setup comments from HTML

### Accessibility ✔️
- [x] Added proper alt text to all images
- [x] Added aria-label to interactive elements
- [x] Replaced inline onclick handlers
- [x] Improved semantic HTML structure

---

**Ready to manage your content with ease!** 🚀

Open `admin/index.html` to get started.
