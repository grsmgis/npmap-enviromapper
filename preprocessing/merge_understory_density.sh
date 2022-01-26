#!/bin/bash

counter=0
i="tmp/cat_understory_density_class_light_1.tif"
echo $i;
name=$(echo "density_"$counter"")
cp $i sublayers/$name.tif
counter=$(( counter+1 ))

i="tmp/cat_understory_density_class_medium_1.tif"
echo $i;
name=$(echo "density_"$counter"")
cp $i sublayers/$name.tif
counter=$(( counter+1 ))

i="tmp/cat_understory_density_class_heavy_1.tif"
echo $i;
name=$(echo "density_"$counter"")
cp $i sublayers/$name.tif
counter=$(( counter+1 ))

rm tmp/cat_understory_density_class_*.tif