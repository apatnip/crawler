import numpy as np
import cv2
import json
from pprint import pprint
# Load an color image in grayscale

with open('test.json') as data_file:    
    data = json.load(data_file)


img = cv2.imread('image.jpg',1)
for coordinate in data['array']:
	x = int(coordinate['top'])
	y = int(coordinate['left'])
	height = int(coordinate['height'])
	width = int(coordinate['width'])
#	pprint(x)
#	pprint(y)
	cv2.rectangle(img,(x,y),(x+width,y+height),(100,200,100),4)

cv2.imshow('image',img)
cv2.waitKey(0)
cv2.destroyAllWindows()
cv2.imwrite('imagenew.png',img)