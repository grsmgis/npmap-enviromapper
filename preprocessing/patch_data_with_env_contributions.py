#!/usr/bin/env python3

"""Data patcher

Usage:
    patch_data_with_env_contributions.py <data_file> <env_stats_file> <irma_mappings_file>

"""
import sys
import json
from docopt import docopt

short_to_long_name = {
        "con_avg_yearly_rainfall": "cat_avg_yearly_rainfall",
        "geology": "cat_geology",
        "soil": "cat_soil_drainage_class",
        "dist": "cat_type_disturbance",
        "density": "cat_understory_density_class",
        "vegetation": "cat_vegetation",
        "cat_years_since_fire": "cat_years_since_fire",
        "con_aspect": "con_aspect",
        "con_solar_rad": "con_direct_solar_radiation",
        "con_elevation": "con_elevation",
        "con_slope": "con_slope"
    }

if __name__ == '__main__':
    arguments = docopt(__doc__)
    with open(arguments['<data_file>']) as fp:
        print('data:', arguments['<data_file>'])
        data = json.load(fp)
    with open(arguments['<irma_mappings_file>']) as fp:
        print('irma:', arguments['<irma_mappings_file>'])
        irma_mappings = json.load(fp)
    with open(arguments['<env_stats_file>']) as fp:
        print('env:', arguments['<env_stats_file>'])
        temp = fp.readlines()
        temp = [i.strip().split() for i in temp]
        
        env_stats = {}
        for i in temp:
            if i[0] in env_stats:
                env_stats[i[0]].append([i[1], i[2]])
            else:
                env_stats[i[0]] = [[i[1], i[2]]]

    for k, v in data.items():
        print(k, v)
        if k in short_to_long_name and short_to_long_name[k] in env_stats:
            _long = short_to_long_name[k]
            data[k]['related-species'] = []
            for i, species in enumerate(env_stats[_long]):
                print(i)
                latin = env_stats[_long][i][0]
                contrib = env_stats[_long][i][1]
                id = irma_mappings[latin]['id']
                image = "http://via.placeholder.com/150x150"
                common = irma_mappings[latin]['common']
                data[k]['related-species'].append([latin, id, common, contrib, image])

    with open(arguments['<data_file>'], 'w') as fp:
        json.dump(data, fp, indent=4, separators=(',', ': '))
