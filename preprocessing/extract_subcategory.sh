#!/bin/bash

if [ "$#" -ne 3 ]; then
    echo "Usage:\t ./run.sh <geojson file> <layer name> <variable name>"
    exit
fi

if [ ! -d tmp ]; then
    mkdir tmp
fi

numeric_check='FCSUBTYPE'

layer=$2
variable_name=$3
counter=0
cat $1 | grep $variable_name | dos2unix | sort | uniq | grep -oh ': "*.*"*' | sed -n 's/: "*\([^"]*\)"*,/\1/p' |
while read -r line;
do
    echo "Processing ${variable_name} == ${line}" 
    if [[ "$line" == *"$numeric_check"* ]]; then
        line=${line//[!0-9]/}
    fi
    # line=$(echo $line | dos2unix)
    # echo $line
    gdal_rasterize -co NUM_THREADS=ALL_CPUS -ot Byte -a_nodata 0 -ts 3128 1192 -burn 196 -burn 28 -burn 142 -where "$variable_name='$line'" $1 tmp/temp.tif
    line=$(echo $line | sed 's/ /_/g' | sed -E -e 's/[;\,-/]/_/g' | sed 's/__/_/g' | sed 's/[)(]//g' | tr '[:upper:]' '[:lower:]')
    line="${line//./}"
    ## gdal_translate -co NUM_THREADS=ALL_CPUS -outsize 12512 0 -a_srs EPSG:4326 -of GTiff tmp/temp.tif tmp/"$layer"_"$line"_1.tif
    # gdaldem color-relief -co NUM_THREADS=ALL_CPUS  -alpha tmp/"$layer"_"$line"_1.tif ./color_ramp_orange.txt tmp/"$layer"_"$line"_1.tif
    gdaldem color-relief -co NUM_THREADS=ALL_CPUS  -alpha tmp/temp.tif ./color_ramp_pink.txt tmp/"$layer"_"$line"_1.tif
    #gdal_translate -a_srs EPSG:4326 tmp/temp.tif tmp/"$layer"_"$line"_1.tif
    counter=$(( counter+1 ))
done;

counter=0
cat $1 | grep $variable_name | dos2unix | sort | uniq | grep -oh ': "*.*"*' | sed -n 's/: "*\([^"]*\)"*,/\1/p' |
while read -r line;
do
    echo "Processing ${variable_name} == ${line}" 
    if [[ "$line" == *"$numeric_check"* ]]; then
        line=${line//[!0-9]/}
    fi
    # line=$(echo $line | dos2unix)
    #echo $line
    gdal_rasterize -co NUM_THREADS=ALL_CPUS -ot Byte -a_nodata 0 -ts 3128 1192 -burn 253 -burn 142 -burn 31 -where "$variable_name='$line'" $1 tmp/temp.tif
    line=$(echo $line | sed 's/ /_/g' | sed -E -e 's/[;\,-/]/_/g' | sed 's/__/_/g' | sed 's/[)(]//g' | tr '[:upper:]' '[:lower:]')
    line="${line//./}"
    # try removing the -a_srs?????
    #gdal_translate -co NUM_THREADS=ALL_CPUS -outsize 12512 0 -a_srs EPSG:4326 -of GTiff tmp/temp.tif tmp/"$layer"_"$line"_2.tif
    #gdaldem color-relief -co NUM_THREADS=ALL_CPUS -alpha tmp/"$layer"_"$line"_2.tif ./color_ramp_pink.txt tmp/"$layer"_"$line"_2.tif
    gdaldem color-relief -co NUM_THREADS=ALL_CPUS  -alpha tmp/temp.tif ./color_ramp_orange.txt tmp/"$layer"_"$line"_2.tif
    counter=$(( counter+1 ))
done;
