# Ch. Nouman Iftikhar — Personal Brand Site

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E)

A highly premium, ultra-fast static website for Ch. Nouman Iftikhar — Founder & CEO of MGC Developments and CEO of Mian Group of Chakwal. The site showcases his 30-year legacy, ventures, media appearances, and the groundbreaking 1% Payment Plan.

**Live Demo:** *(Add your deployed Vercel link here)*

## 🚀 Technical Architecture

This project is built for pure speed and elegance without any heavy dependencies.
- **Zero build step:** No frameworks, no bundlers, no npm required.
- **Vanilla JS:** All interactivity (IntersectionObservers, Lightboxes, Count-ups) is written in pure JavaScript.
- **Static Hosting:** Open `index.html` in a browser and it instantly works. Ready to deploy anywhere.

### Project Structure
```text
index.html                # The main page
gallery.html              # The masonry gallery page
css/styles.css            # All styling (design tokens at the top)
js/main.js                # Nav, menu, reveals, count-ups, lightbox, form
assets/img/               # Photos, luxury renders, logos, favicons
assets/video/             # Embedded MP4 films
assets/docs/              # Downloadable brochures
scripts/fetch-assets.sh   # (Optional) Fetches placeholders locally
```

## ✨ Features & Upgrades

This repository includes custom high-end upgrades engineered for luxury and performance:
- **Masonry Image Gallery:** A `gallery.html` subpage featuring a staggered-reveal masonry grid.
- **Custom Lightbox:** A pure Vanilla JS modal lightbox with background blur, arrow navigation, keyboard support (Esc, Left, Right), and click-to-advance features.
- **Executive Contact & Footer:** Premium interactive contact cards and a deep-dark structured footer with circular SVG social nodes.
- **Interactive Legacy Timeline:** Horizontal scrolling legacy timeline equipped with sleek SVG arrow buttons.
- **Performance Animations:** Smooth fade-ups, number count-ups, and scroll-responsive navigation bars.
- **Luxury Aesthetic:** Uses a deep obsidian and graphite palette accented by a premium golden `#CD9862`.

## 🌐 How to Deploy (Vercel)

This site is perfectly configured to be deployed on **Vercel** for free.

### The Drag-and-Drop Method (Fastest)
1. Go to [Vercel Drop](https://vercel.com/new/drop).
2. Drag the entire `nouman-site` folder directly into your browser.
3. Your site is live!

### The GitHub Method (Recommended)
1. Push this repository to GitHub.
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
3. Import this repository. No build commands are needed.
4. Click **Deploy**.

## ⚙️ Pre-Launch Checklist

Before driving real traffic, complete the following steps:
1. **Connect the Contact Form:** Create a free form at [Formspree](https://formspree.io), set the recipient email to `ceo@mgcdevelopments.com`, and replace `YOUR_FORM_ID` in `index.html`.
2. **Update Social Links:** Replace the generic Facebook, Instagram, and LinkedIn URLs in the footer with the exact profile links.
3. **Set the Canonical URL:** Update `https://chnoumaniftikhar.com/` in the `<head>` of `index.html` to your final live domain for SEO.
4. **Connect your Custom Domain:** Add your domain in the Vercel dashboard and update your DNS records.

## 🎨 Theming

Everything is controlled via CSS variables at the very top of `css/styles.css`. 
Change the primary `var(--rose)` color (currently set to `#CD9862`), and every button, hover effect, timeline line, and accent will instantly harmonize across the entire site.
