#!/bin/bash

for i in `ls sublayers/*.asc`; do
    name=$(basename -- "$i")
    filenameonly="${name%.*}"
    num="${filenameonly: -1}"

    ## NEW 
    # ./asc_to_colored_tif $i color_ramp_pink_${num}.txt ${i%.*}.tif
    echo "Converting $i with color_ramp_pink_${num}.txt to ${i%.*}.tif"
    filename="$i"
    color="color_ramp_pink_${num}.txt"
    output="${i%.*}.tif"
    gdal_translate -a_srs EPSG:4326 $filename $filename.tif
    gdaldem color-relief -co NUM_THREADS=ALL_CPUS -alpha $filename.tif $color $filename_$color.tif
    gdal_translate -outsize 3128 1192 -of GTiff -of GTiff -a_nodata 0 $filename_$color.tif $output
    rm $filename_$color.tif
    rm $filename.tif
done;
