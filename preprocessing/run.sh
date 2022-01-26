#!/bin/bash

# This script (in the near future) will include the list of tasks needed from start
# to finish to run the whole preprocessing steps for Enviromapper

./extract_subcategory.sh layers/cat_type_disturbance.geojson cat_type_disturbance FCSUBTYPE
./merge_disturbance_subcategory.sh

#./extract_subcategory.sh layers/cat_soil_drainage_class.geojson cat_soil_drainage_class DrainClass
# merge?

#./extract_subcategory.sh layers/cat_avg_yearly_rainfall.geojson cat_avg_yearly_rainfall RANGE
# merge?

./extract_subcategory_understory_density.sh layers/cat_understory_density_class.geojson cat_understory_density_class
./merge_understory_density.sh

./extract_subcategory.sh layers/cat_geology.geojson geology GLG_NAME_1
# merge?
