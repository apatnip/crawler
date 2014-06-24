import sys
import json
import cv2
import numpy as np
from matplotlib import pyplot as plt
from pprint import pprint

cordinates = sys.argv[1];
image = sys.argv[2];

img = cv2.imread(image)
cv2.imshow('img',img)
with open(cordinates) as data_file:    
    data = json.load(data_file)

for cordinate in data:
	print 'Co-ordinate: '+ cordinate

