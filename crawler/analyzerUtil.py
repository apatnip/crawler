import sys
import json
import cv2
import numpy as np
from matplotlib import pyplot as plt
from pprint import pprint

cordinates = sys.argv[1];
image = sys.argv[2];
img = cv2.imread(image)

with open(cordinates) as data_file:    
    data = json.load(data_file)

for coordinate in data:
	coordinate = json.loads(coordinate)	
	y = int(coordinate['top'])
	x = int(coordinate['left'])
	height = int(coordinate['height'])
	width = int(coordinate['width'])
	overlay = img.copy()
	cv2.rectangle(img,(x,y),(x+width,y+height),(0,0,255),-1)
	opacity = 0.3
	cv2.addWeighted(overlay, opacity, img, 1 - opacity, 0, img)

saveImage = image+'-analyzed.jpg'
cv2.imwrite(saveImage,img)
cv2.imshow('image',img)
cv2.waitKey(0)
cv2.destroyAllWindows()
