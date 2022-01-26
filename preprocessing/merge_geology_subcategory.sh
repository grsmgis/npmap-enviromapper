#!/bin/bash

for color in {1..2}; do
    j=0
    mv tmp/geology_amphibolite_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    python3 $(which gdal_merge.py) -n 0 -a_nodata 0 -o sublayers/geology_"$j"_"$color".tif tmp/geology_anakeesta_*"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_biotite_augen_gneiss_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_blockhouse_shale_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    python3 $(which gdal_merge.py) -n 0 -a_nodata 0 -o sublayers/geology_"$j"_"$color".tif tmp/geology_cades_sandstone_*"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_cochran_formation_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    python3 $(which gdal_merge.py) -n 0 -a_nodata 0 -o sublayers/geology_"$j"_"$color".tif tmp/geology_copperhill_formation_*"$color".tif
    j=$(( j + 1 ));
    python3 $(which gdal_merge.py) -n 0 -a_nodata 0 -o sublayers/geology_"$j"_"$color".tif tmp/geology_elkmont_sandstone_*"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_helenmode_formation_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_hesse_quartzite_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_hornblende_biotite_gneiss_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_jonesboro_limestone_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    python3 $(which gdal_merge.py) -n 0 -a_nodata 0 -o sublayers/geology_"$j"_"$color".tif tmp/geology_licklog_formation_*"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_longarm_quartzite_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_metadiorite_and_metadiabase_and_altered_rocks_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_metcalf_phyllite_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_migmatitic_biotite_gneiss_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_monzogranite_gneiss_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_murray_shale_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_nebo_quartzite_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_nichols_shale_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    python3 $(which gdal_merge.py) -n 0 -a_nodata 0 -o sublayers/geology_"$j"_"$color".tif tmp/geology_pigeon_siltstone_*"$color".tif
    j=$(( j + 1 ));
    python3 $(which gdal_merge.py) -n 0 -a_nodata 0 -o sublayers/geology_"$j"_"$color".tif tmp/geology_rich_butt_sandstone_*"$color".tif
    j=$(( j + 1 ));
    python3 $(which gdal_merge.py) -n 0 -a_nodata 0 -o sublayers/geology_"$j"_"$color".tif tmp/geology_roaring_fork_sandstone_*"$color".tif
    j=$(( j + 1 ));
    python3 $(which gdal_merge.py) -n 0 -a_nodata 0 -o sublayers/geology_"$j"_"$color".tif tmp/geology_shady_dolomite_*"$color".tif
    j=$(( j + 1 ));
    python3 $(which gdal_merge.py) -n 0 -a_nodata 0 -o sublayers/geology_"$j"_"$color".tif tmp/geology_shields_formation_*"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_tellico_formation_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    python3 $(which gdal_merge.py) -n 0 -a_nodata 0 -o sublayers/geology_"$j"_"$color".tif tmp/geology_thunderhead_sandstone_*"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_ultramafic_rock_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_upper_part_of_chilhowee_group_undifferentiated_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_wading_branch_formation_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    mv tmp/geology_wehutty_formation_"$color".tif sublayers/geology_"$j"_"$color".tif
    j=$(( j + 1 ));
    python3 $(which gdal_merge.py) -n 0 -a_nodata 0 -o sublayers/geology_"$j"_"$color".tif tmp/geology_wilhite_formation_*"$color".tif
    rm tmp/geology_*"$color".tif
done

