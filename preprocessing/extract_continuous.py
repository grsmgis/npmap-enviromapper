#!/usr/bin/env python3

"""ExtractContinuous

Usage:
    extract_continuous.py <data_file>
"""

from docopt import docopt
import sys
import numpy as np
import glob
import os
import json

if __name__ == '__main__':
    arguments = docopt(__doc__)

    if os.path.exists('sublayers') == False:
        os.mkdir('sublayers')

    with open(arguments['<data_file>']) as fp:
        data = json.load(fp)
        
    range_info = {}
    for inp_filename in glob.glob('layers/con*'):
        print('Working on', inp_filename)
        out_prefix = 'sublayers/' + os.path.basename(inp_filename).replace(".asc", "")

        _min = 999999
        _max = -99999
        fill_value = -9999
        with open(inp_filename) as fp:
            lines = fp.readlines()
            lines = [l.strip().split(" ") for l in lines]
            for vals in lines[6:]:
                temp = [float(val) for val in vals]
                temp = np.array(temp, dtype=np.float)
                temp[temp==fill_value] = np.nan
                temp_max = np.nanmax(temp)
                temp_min = np.nanmin(temp)
                if temp_max > _max:
                    _max = temp_max
                if temp_min < _min:
                    _min = temp_min

        print("Min: %s, Max: %s" % (_min, _max))
        rng = (_max - _min) / 3.0
        ranges = [[_min, _min + rng], [_min + rng, _min + rng * 2], [_min + rng * 2, _max]]
        ranges = [[round(x[0], 1), round(x[1], 1)] for x in ranges]
        range_info[os.path.basename(inp_filename).replace(".asc", "")] = str(ranges)
        print("Ranges:", ranges)

        for j, rng in enumerate(ranges):
            inp = open(inp_filename)
            layer_name = os.path.basename(inp_filename).replace('.asc', '')
            out = open(out_prefix + "_" + str(j) + ".asc", 'w')
            for i in range(6):
                out.write(inp.readline())
            for line in inp:
                a = [float(l) for l in line.strip().split()]
                a = [-9999 if l < rng[0] or l > rng[1] else l for l in a]
                a = [str(l) for l in a]
                a = ' '.join(a)
                out.write(a + '\n')

            # patch the data file
            if layer_name in data:
                data[layer_name]['ranges'] = ranges

            out.close()
            inp.close()

    for inp_filename in glob.glob('layers/cat_avg_yearly_rainfall.asc'):
        print('Working on', inp_filename)
        out_prefix = 'sublayers/' + os.path.basename(inp_filename).replace(".asc", "")

        _min = 999999
        _max = -99999
        fill_value = -9999
        with open(inp_filename) as fp:
            lines = fp.readlines()
            lines = [l.strip().split(" ") for l in lines]
            for vals in lines[6:]:
                temp = [float(val) for val in vals]
                temp = np.array(temp, dtype=np.float)
                temp[temp==fill_value] = np.nan
                temp_max = np.nanmax(temp)
                temp_min = np.nanmin(temp)
                if temp_max > _max:
                    _max = temp_max
                if temp_min < _min:
                    _min = temp_min

        print("Min: %s, Max: %s" % (_min, _max))
        rng = (_max - _min) / 3.0
        ranges = [[_min, _min + rng], [_min + rng, _min + rng * 2], [_min + rng * 2, _max]]
        ranges = [[round(x[0], 1), round(x[1], 1)] for x in ranges]
        range_info[os.path.basename(inp_filename).replace(".asc", "")] = str(ranges)
        print("Ranges:", ranges)

        for j, rng in enumerate(ranges):
            inp = open(inp_filename)
            layer_name = os.path.basename(inp_filename).replace('.asc', '')
            out = open(out_prefix + "_" + str(j) + ".asc", 'w')
            for i in range(6):
                out.write(inp.readline())
            for line in inp:
                a = [float(l) for l in line.strip().split()]
                a = [-9999 if l < rng[0] or l > rng[1] else l for l in a]
                a = [str(l) for l in a]
                a = ' '.join(a)
                out.write(a + '\n')

            # patch the data file
            if layer_name in data:
                data[layer_name]['ranges'] = ranges

            out.close()
            inp.close()

    with open('sublayers/range_info.json', 'w') as fp:
        json.dump(range_info, fp)

    with open(arguments['<data_file>'], 'w') as fp:
        json.dump(data, fp, indent=4, separators=(',', ': '))

