#! /bin/bash
./download_environment_layers.sh
find . -name "*.geojson" -exec python3 ./extract_continuous.py {} \;

./convert_all_to_tiff.sh

./extract_subcategory.sh layers/cat_type_disturbance.geojson cat_type_disturbance FCSUBTYPE
./merge_disturbance_subcategory.sh

./extract_subcategory_understory_density.sh layers/cat_understory_density_class.geojson cat_understory_density_class
./merge_understory_density.sh

./extract_subcategory.sh layers/cat_geology.geojson geology GLG_NAME_1
./merge_geology_subcategory.sh

./extract_subcategory.sh layers/cat_soil_drainage_class.geojson soil_drainage_class DrainClass
./merge_soil_subcategory.sh

./extract_subcategory.sh layers/cat_vegetation.geojson vegetation VitalName 
./merge_vegetation.sh