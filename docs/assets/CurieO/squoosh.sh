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
    magick $i -colors 256 ${i%.*}.png
done
