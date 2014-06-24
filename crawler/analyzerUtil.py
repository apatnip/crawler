import sys
import json
from pprint import pprint

cordinates = sys.argv[1];
image = sys.argv[2];

with open(cordinates) as data_file:    
    data = json.load(data_file)

for cordinate in data:
	print 'Co-ordinate: '+ cordinate