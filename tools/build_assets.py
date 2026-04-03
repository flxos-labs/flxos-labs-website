#!/usr/bin/env python3
"""
Build script: minify CSS/JS (simple minifiers), write hashed outputs to assets/build,
and update HTML references to use the new hashed filenames.

This is intentionally conservative: it creates ./assets/build and replaces a small
set of known filenames in HTML. Run from repo root: python3 tools/build_assets.py
"""
import hashlib
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BUILD_DIR = ROOT / 'assets' / 'build'
BUILD_DIR.mkdir(parents=True, exist_ok=True)

CSS_FILES = [ROOT / 'assets' / 'css' / 'styles.css', ROOT / 'assets' / 'css' / 'about.css']
JS_FILES = [ROOT / 'assets' / 'js' / 'script.js', ROOT / 'assets' / 'js' / 'docs.js']
EXCLUDED_HTML_DIRS = {'.git', 'node_modules', '.venv', 'venv', '__pycache__'}
HTML_GLOBS = [
    path for path in ROOT.rglob('*.html')
    if not any(part in EXCLUDED_HTML_DIRS for part in path.parts)
    and ('assets', 'build') not in zip(path.parts, path.parts[1:])
]


def minify_css(text: str) -> str:
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)  # remove comments
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s*([{}:;,])\s*", r"\1", text)
    return text.strip()


def minify_js(text: str) -> str:
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)  # remove block comments
    text = re.sub(r"//.*?$", "", text, flags=re.M)  # remove line comments
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def write_hashed(content: bytes, name: str, ext: str) -> str:
    h = hashlib.sha256(content).hexdigest()[:8]
    out_name = f"{name}.{h}.min.{ext}"
    out_path = BUILD_DIR / out_name
    out_path.write_bytes(content)
    return f"/assets/build/{out_name}"


replacements = {}

for f in CSS_FILES:
    if not f.exists():
        continue
    text = f.read_text(encoding='utf-8')
    m = minify_css(text).encode('utf-8')
    new_url = write_hashed(m, f.stem, 'css')
    replacements[f'/assets/css/{f.name}'] = new_url

for f in JS_FILES:
    if not f.exists():
        continue
    text = f.read_text(encoding='utf-8')
    m = minify_js(text).encode('utf-8')
    new_url = write_hashed(m, f.stem, 'js')
    replacements[f'/assets/js/{f.name}'] = new_url

# Update HTML files replacing occurrences of the original asset paths
for html in HTML_GLOBS:
    text = html.read_text(encoding='utf-8')
    updated = text
    for old, new in replacements.items():
        updated = updated.replace(old, new)
    if updated != text:
        html.write_text(updated, encoding='utf-8')
        print(f"Updated {html.relative_to(ROOT)}")

print("Build complete. Wrote:")
for k, v in replacements.items():
    print(f"  {k} -> {v}")
