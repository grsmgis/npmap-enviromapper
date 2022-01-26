#!/bin/bash

freshBuild() {
	echo "Building new Docker Image from scratch..."
	docker build --no-cache -t npsbenv . 
}

build() {
	echo "Building new Docker Image from modified Dockerfile..."
	docker build -t npsbenv .
}

run() {
	echo "Running Docker Image with interactive shell..."
	if [[ ! -d $volume ]]; then 
		echo "$volume does not exist, please mkdir this before running" 
		exit 1
	fi
	docker run --rm -it $envstring --mount type=bind,source=$volume,target=/app/data npsbenv
}

#########################
# The command line help #
#########################
display_help() {
	echo "Usage: $0 [option...] {build|freshBuild|run}" >&2
	echo
	echo "	-a, --atlas                run then upload results to on prem atlas"
	echo "	-u, --upload               run then upload results to mapbox user using the key"
	echo "	-d, --dump                 run then dump the results to a disk"
	echo "	-v, --volume               area where data resides and will dump to"
	echo "	-c, --config		   conifguration file to defaults to all"
	echo
	exit 1
}

make_dump=false
volume="$(pwd)"
user="Null"
token="Null"
configFile="Null"
flagged=false
envstring=""
################################
# Check if parameters options  #
# are given on the commandline #
################################
while :
do
	case "$1" in
		-u | --upload)
			if [ $# -gt 2 ]; then
				user="$2"   # You may want to check validity of $2
				token="$3"
			else 
				echo "Upload Flag Error: ./npsdocker -u USERNAME MAPBOX_ACCESS_TOKEN run"
				display_help
				exit 1
			fi
			envstring="$envstring --env MB_USER_ENV=$user --env MB_TOKEN_ENV=$token"
			flagged=true
			shift 3
			;;
		-h | --help)
			display_help  # Call your function
			exit 0
			;;
		-d | --dump)
			make_dump=true
			envstring="$envstring --env DUMP_ENV=true"
			flagged=true
			shift 1
			;;
		-v | --volume)
			volume="$2"
			flagged=true
			shift 2
			;;
		-c | --config)
			envstring="$envstring --env CONFIG_ENV=true"
			flagged=true
			shift 1
			;;
		-a | --atlas)
			envstring="$envstring --env ATLAS_UPL_ENV=true"
			flagged=true
			shift 1
			;;
		--) # End of all options
			shift
			break
			;;
		-*)
			echo "Error: Unknown option: $1" >&2
			display_help
			## or call function display_help
			exit 1 
			;;
		*)  # No more options
			break
			;;
	esac
done

###################### 
# Check if parameter #
# is set to execute  #
######################
case "$1" in
	build)
		if $flagged; then 
			echo "Usage: Pass no flags to build function."
			exit 1;
		fi
		build # calling function build()
		;;
	freshBuild)
		if $flagged; then 
			echo "Usage: Pass no flags to freshBuild function."
			exit 1;
		fi
		freshBuild # calling function freshBuild()
		;;
	run)
		run # calling function run()
		;;
	*)
		#    echo "Usage: $0 {start|stop|restart}" >&2
		display_help
		exit 1
		;;
esac
