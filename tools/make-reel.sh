#!/usr/bin/env bash
# Builds public/videos/reel.mp4 (+ reel.jpg poster): a cinematic slideshow of the shop
# photos with slow zooms/pans and crossfades. Needs ffmpeg. Run from the repo root.
set -euo pipefail

FPS=30
DUR=3.2      # seconds each photo is on screen
FADE=0.8     # crossfade length
W=1280; H=720
OUT=public/videos/reel.mp4
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# photo : crop offset (0..1, how far down to crop a tall photo) : zoom direction (in|out)
SHOTS=(
  "beard:0.15:in"
  "clippers:0.42:out"
  "razor:0.38:in"
  "lather:0.5:out"
  "classic:0.12:in"
  "styling:0.03:out"
)

frames=$(awk "BEGIN{print int($DUR*$FPS)}")
i=0
for shot in "${SHOTS[@]}"; do
  IFS=: read -r name off dir <<<"$shot"
  if [ "$dir" = in ]; then z="1+0.12*on/$frames"; else z="1.12-0.12*on/$frames"; fi
  # crop to 16:9 at the chosen height, upscale for smooth sub-pixel motion, then Ken Burns
  ffmpeg -y -loglevel error -loop 1 -i "public/photos/$name.jpg" -frames:v "$frames" -vf "\
crop=iw:min(ih\,iw*9/16):0:(ih-min(ih\,iw*9/16))*$off,\
scale=2560:1440,\
zoompan=z='$z':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${W}x${H}:fps=$FPS,\
eq=contrast=1.06:saturation=0.92,format=yuv420p" "$TMP/$i.mp4"
  i=$((i+1))
done

# chain crossfades, then fade the last shot back into the first so the loop is seamless
inputs=(); for ((k=0; k<i; k++)); do inputs+=(-i "$TMP/$k.mp4"); done
inputs+=(-i "$TMP/0.mp4")
filter=""; prev="[0:v]"; offset=0
for ((k=1; k<=i; k++)); do
  offset=$(awk "BEGIN{print $offset+$DUR-$FADE}")
  filter+="${prev}[$k:v]xfade=transition=fade:duration=$FADE:offset=$offset[v$k];"
  prev="[v$k]"
done
total=$(awk "BEGIN{print $offset}")   # cut where the first shot fully returns
filter+="${prev}trim=start=0:end=$total,setpts=PTS-STARTPTS[out]"

ffmpeg -y -loglevel error "${inputs[@]}" -filter_complex "$filter" -map "[out]" \
  -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart -an "$OUT"
ffmpeg -y -loglevel error -ss 1 -i "$OUT" -frames:v 1 -q:v 4 public/videos/reel.jpg
echo "wrote $OUT"
