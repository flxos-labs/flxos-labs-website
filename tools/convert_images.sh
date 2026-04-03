#!/usr/bin/env bash
set -euo pipefail

# Simple ImageMagick-based converter: generates WebP and AVIF at 3 widths
# Output goes to assets/images/optimized

widths=(480 800 1600)
src_dirs=("assets/images/screenshots" "assets/images/hardware" "assets/images")
out_dir="assets/images/optimized"

mkdir -p "$out_dir"

find "${src_dirs[@]}" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0 | while IFS= read -r -d '' f; do
  filename=$(basename "$f")
  name="${filename%.*}"
  for w in "${widths[@]}"; do
    out_webp="$out_dir/${name}-${w}.webp"
    out_avif="$out_dir/${name}-${w}.avif"
    if [ ! -f "$out_webp" ]; then
      magick "$f" -strip -resize "${w}x" -quality 80 "$out_webp"
    fi
    if [ ! -f "$out_avif" ]; then
      magick "$f" -strip -resize "${w}x" -quality 60 "$out_avif"
    fi
  done
done

echo "Converted images to ${out_dir}" 
