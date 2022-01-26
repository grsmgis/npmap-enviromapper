#!/bin/bash

counter=0
for i in `ls -a tmp/soil_drainage_class_*1.tif`; do 
    echo $i;
    name=$(echo "soil_"$counter"_1")
    cp $i sublayers/$name.tif
    counter=$(( counter+1 ))
done;

counter=0
for i in `ls -a tmp/soil_drainage_class_*2.tif`; do 
    echo $i;
    name=$(echo "soil_"$counter"_2")
    cp $i sublayers/$name.tif
    counter=$(( counter+1 ))
done;

rm tmp/soil_drainage_class_*.tif