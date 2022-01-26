#!/bin/bash

mapbox_user="${MB_USER_ENV}"
access_token="${MB_TOKEN_ENV}"
atlas_usr="atlas-user"

dataset_prefix="GRSM"
gdal_cmd="gdal_translate -of GTiff -a_nodata 0"
tile_cmd="gdal2mbtiles --min-resolution 10 --max-resolution 16 --no-fill-borders"
post_cmd="gdaladdo -r nearest"
upload_cmd="mapbox --access-token $access_token upload"
geotiff_dir="./sublayers"
outgeos_dir="./sublayers/out"
outtile_dir="./mbtiles"
uploadcmnds="./uploadcommands.sh"
ids_file="/app/npmap-species/atbirecords/ATBI_ids.txt"
ext="tif"
ext_mb="mbtiles"
on_prem_upload='scp -i ~/.ssh/to_mbgov_rsa.pem -o "ProxyCommand ssh -i ~/.ssh/to_mbproxy_rsa.pem preston.provins@52.204.73.74 -W %h:%p"'
on_prem_dest="preston.provins@10.112.30.103:/data/preston.provins-data-dump"
atlas_mv='ssh -i ~/.ssh/to_mbgov_rsa.pem -o "ProxyCommand ssh -i ~/.ssh/to_mbproxy_rsa.pem preston.provins@52.204.73.74 -W %h:%p" sudo mv /data/preston.provins-data-dump/* /data/atlas-server/mbtiles/'
perms="chmod 755"

mkdir -p $geotiff_dir/out
mkdir -p $outtile_dir

tile_func(){
        sp=${1%.tif}
        echo "Creating MBTile for $geotiff_dir/$sp\.$ext"
        $tile_cmd $geotiff_dir/$sp\.$ext $outtile_dir/$atlas_usr\.$sp\.$ext_mb # >> $uploadcmnds
        # echo "Adding overlays" 
        # $post_cmd $outtile_dir/$atlas_usr\.$sp\.$ext_mb "2 4 8 16" # >> $uploadcmnds
        echo "Setting perms"
        $perms $outtile_dir/$atlas_usr\.$sp\.$ext_mb # >> $uploadcmnds
        # $on_prem_upload $outtile_dir/$atlas_usr\.$sp\.$ext_mb $on_prem_dest
        scp -i ~/.ssh/to_mbgov_rsa.pem $outtile_dir/$atlas_usr\.$sp\.$ext_mb preston.provins@52.204.73.74:~/
}

while read line; do
        for sp in $line; do
                tile_func $sp &
        done
done <<< $(find ${geotiff_dir} -name "*.tif" -printf '%f\n')

wait
# chmod +x $uploadcmnds
# ./$uploadcmnds