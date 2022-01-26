#!/bin/bash

for color in {1..2}; do
    j=0
    cp tmp/vegetation_cove_"$color".tif sublayers/vegetation_"$j"_"$color".tif
    j=$(( j + 1 ));

    # Skipping dead

    cp tmp/vegetation_grass_"$color".tif sublayers/vegetation_"$j"_"$color".tif
    j=$(( j + 1 ));

    #/usr/bin/python $(which gdal_merge.py) -n 0 -a_nodata 0 -o sublayers/vegetation_"$j"_"$color".tif tmp/vegetation_ericaceous_*"$color".tif
    #j=$(( j + 1 ));

    cp tmp/vegetation_heath_"$color".tif sublayers/vegetation_"$j"_"$color".tif
    j=$(( j + 1 ));

    cp tmp/vegetation_hemlock_"$color".tif sublayers/vegetation_"$j"_"$color".tif
    j=$(( j + 1 ));

    cp tmp/vegetation_high_hardwood_"$color".tif sublayers/vegetation_"$j"_"$color".tif
    j=$(( j + 1 ));

    cp tmp/vegetation_montane_alluv__"$color".tif sublayers/vegetation_"$j"_"$color".tif
    j=$(( j + 1 ));

    cp tmp/vegetation_oak_"$color".tif sublayers/vegetation_"$j"_"$color".tif
    j=$(( j + 1 ));

    cp tmp/vegetation_pine_oak_"$color".tif sublayers/vegetation_"$j"_"$color".tif
    j=$(( j + 1 ));

    # Skipping rock

    cp tmp/vegetation_spruce_fir_"$color".tif sublayers/vegetation_"$j"_"$color".tif
    j=$(( j + 1 ));

    cp tmp/vegetation_successional_"$color".tif sublayers/vegetation_"$j"_"$color".tif
    j=$(( j + 1 ));

    # skipping water
done

rm tmp/vegetation_*.tif