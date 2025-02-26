#!/bin/bash

mkdir -p squoosh

for i in *.pdf
do
    pdftocairo $i -scale-to-x -1 -scale-to-y 1000 -png -singlefile - > ./squoosh/${i%.*}.png
done

for i in *.jpg *.jpeg *.png
do
    magick $i -resize x1000 ./squoosh/${i%.*}.png
done

for i in ./squoosh/*.png
do
     magick $i -channel RGB -separate -colors 256 -combine -depth 8 ${i%.*}.png
done

for f in {0..5}; do
   for l in {0..9}; do
      for s in {0..4}; do
         outfile="out_${f}_${l}_${s}.png"
         magick $i -define png:compression-filter=$f -define png:compression-level=$l -define png:compression-strategy=$s "$outfile"
         size=$(du "$outfile")
         echo filter:$f, level:$l, strategy:$s, size:$size
      done
   done
done

# magick mogrify -filter Triangle -define filter:support=2 -unsharp 0.25x0.08+8.3+0.045 -dither None -posterize 20 -quality 50 -define png:compression-filter=5 -define png:compression-level=9 -define png:compression-strategy=1 -define png:exclude-chunk=all -interlace none -colorspace sRGB ./squoosh/*.png
