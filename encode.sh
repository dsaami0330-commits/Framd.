#!/bin/bash
P="/Users/khizerhussain/MacBook HQ/Visual Dept Website"
encode () {
  src="$1"; slug="$2"
  ffmpeg -y -v error -i "$src" \
    -c:v libx264 -crf 24 -preset slow -profile:v high -level 4.1 -pix_fmt yuv420p \
    -vf "scale=1080:1920:flags=lanczos" -r 30 \
    -c:a aac -b:a 128k -ac 2 \
    -movflags +faststart \
    "$P/videos/$slug.mp4"
  ffmpeg -y -v error -ss 1 -i "$P/videos/$slug.mp4" -frames:v 1 -q:v 3 "$P/posters/$slug.jpg"
  echo "done: $slug"
}
encode "/Volumes/khizz SD/CLIENTS /KOLTON.mov" "kolton"
encode "/Volumes/khizz SD/CLIENTS /Football History.mov" "football-history"
encode "/Users/khizerhussain/MacBook HQ/Drifted Marketing/Prospects/Gettysburg Museum/ERIC 1.mov" "eric-1"
encode "/Users/khizerhussain/MacBook HQ/Drifted Marketing/Prospects/Gettysburg Museum/ERIC 3.mov" "eric-3"
echo "ALL DONE"
