#!/usr/bin/env bash
# Downloads every asset for the site into assets/ with the filenames index.html expects.
# Run from the project root on your own machine:  bash scripts/fetch-assets.sh
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/img assets/video assets/docs

get () { # get <url> <destination>
  if [ -s "$2" ]; then echo "  exists  $2"; return; fi
  echo "  fetch   $2"
  curl -fsSL --retry 3 -o "$2" "$1"
}

echo "Portraits"
get "https://mgcdevelopments.com/wp-content/uploads/2026/05/NOUMAN-CH-CEO.png"                 assets/img/nouman-portrait.png
get "https://mgcdevelopments.com/wp-content/uploads/2026/06/Sir-Nouman.-1621x599.jpg.jpeg"     assets/img/nouman-editorial.jpg

echo "Logos"
get "https://mgcdevelopments.com/wp-content/uploads/2026/05/logo.png"                          assets/img/logo-mgc.png
get "https://miangroup.com.pk/cdn/shop/files/Green_Png_351a8d3f-6389-4c70-ae8f-ea98731ff9c4.png?v=1762147095" assets/img/logo-mian-group.png

echo "Renders"
get "https://mgcdevelopments.com/wp-content/uploads/2026/05/JEWEL-HERO-BANNER.jpeg"            assets/img/mgc-jewel-hero.jpg
get "https://mgcdevelopments.com/wp-content/uploads/2026/05/Jewel-2880-x-1236.jpg-scaled.jpeg" assets/img/mgc-jewel-wide.jpg
get "https://mgcdevelopments.com/wp-content/uploads/2026/05/exterior-1-2500x1400.jpg.jpeg"     assets/img/mgc-jewel-exterior.jpg
get "https://mgcdevelopments.com/wp-content/uploads/2026/05/interior-1-2500x1400.jpg.jpeg"     assets/img/mgc-jewel-interior.jpg
get "https://mgcdevelopments.com/wp-content/uploads/2026/06/top-banner-2880-x-1236-scaled.jpg" assets/img/mgc-divine.jpg
get "https://mgcdevelopments.com/wp-content/uploads/2026/06/top-banner-2880-x-1236-2-scaled.jpg" assets/img/picasso-by-mgc.jpg
get "https://mgcdevelopments.com/wp-content/uploads/2026/06/exterior-1-2500x1400-4.jpg"        assets/img/liberty-terraces.jpg
get "https://mgcdevelopments.com/wp-content/uploads/2026/06/exterior-2-2500x1400-4.jpg"        assets/img/mgc-5.jpg
get "https://mgcdevelopments.com/wp-content/uploads/2026/06/exterior-3-2500x1400-4.jpg"        assets/img/holiday-inn-suites.jpg
get "https://mgcdevelopments.com/wp-content/uploads/2026/06/Realtors-banner.jpg-scaled.jpeg"   assets/img/realtors-event.jpg
get "https://mgcdevelopments.com/wp-content/uploads/2026/06/interior-4-2500x1400-1.jpg"        assets/img/gala-interior.jpg
get "https://mgcdevelopments.com/wp-content/uploads/2026/06/top-banner-1360x647-1.jpg"         assets/img/group-legacy.jpg

echo "Interview thumbnails"
get "https://img.youtube.com/vi/aRfMuhxzMTU/maxresdefault.jpg"                                 assets/img/interview-shaista-lodhi.jpg
get "https://img.youtube.com/vi/YNsTejDmzFs/maxresdefault.jpg"                                 assets/img/interview-high-rise-living.jpg

echo "Video"
get "https://mgcdevelopments.com/wp-content/uploads/2026/06/download.mp4"                      assets/video/one-percent-plan.mp4
get "https://mgcdevelopments.com/wp-content/uploads/2026/05/YTDown_YouTube_Media_MMTDuTYkbck_002_720p.mp4" assets/video/mgc-brand-film.mp4

echo "Documents"
get "https://mgcdevelopments.com/wp-content/uploads/2026/06/Jewel-Brouchure.pdf"               assets/docs/mgc-jewel-brochure.pdf

echo
echo "Done. Optional but recommended — shrink the renders before deploying (needs ImageMagick):"
echo '  for f in assets/img/*.jpg; do magick "$f" -resize "1920x1920>" -quality 82 "$f"; done'
