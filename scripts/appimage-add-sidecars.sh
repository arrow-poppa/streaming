#!/usr/bin/env bash
# Adds the bundled ffmpeg, ffprobe and yt-dlp to an already built AppImage.
#
# linuxdeploy rewrites the rpath of every ELF in usr/bin, and patchelf fails on
# the static ffmpeg builds ("maximum file size exceeded"), so the AppImage is
# bundled without sidecars and they are copied in here, untouched, next to the
# main binary where the shell plugin's sidecar lookup expects them.
#
# Usage: appimage-add-sidecars.sh <AppImage> <rust target triple>
set -euo pipefail

appimage="$(realpath "$1")"
target="$2"
root="$(cd "$(dirname "$0")/.." && pwd)"
bins="$root/src-tauri/binaries"

case "$target" in
  x86_64-*) arch=x86_64 ;;
  aarch64-*) arch=aarch64 ;;
  *) echo "unsupported target: $target" >&2; exit 1 ;;
esac

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

curl -fsSL -o "$work/appimagetool" \
  "https://github.com/AppImage/appimagetool/releases/download/continuous/appimagetool-$arch.AppImage"
chmod +x "$work/appimagetool" "$appimage"

(cd "$work" && APPIMAGE_EXTRACT_AND_RUN=1 "$appimage" --appimage-extract >/dev/null)

for name in ffmpeg ffprobe yt-dlp; do
  src="$bins/$name-$target"
  if [ ! -s "$src" ]; then
    echo "missing sidecar: $src" >&2
    exit 1
  fi
  install -m 755 "$src" "$work/squashfs-root/usr/bin/$name"
done

ARCH="$arch" APPIMAGE_EXTRACT_AND_RUN=1 "$work/appimagetool" --no-appstream \
  "$work/squashfs-root" "$work/out.AppImage" >/dev/null
mv -f "$work/out.AppImage" "$appimage"
echo "added ffmpeg, ffprobe and yt-dlp to $(basename "$appimage")"
