#!/usr/bin/env python

import json

with open('data.json') as fp:
    data = json.load(fp)
    for key in data.keys():
        data[key]['type'] = ""
        data[key]['subcategories'] = []
        data[key]['related-species'] = []

with open('data.json', 'w') as fp:
    json.dump(data, fp)




