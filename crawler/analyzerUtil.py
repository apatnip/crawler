import sys
import os
import json
import cv2
import numpy as np
from matplotlib import pyplot as plt
from pprint import pprint

font = cv2.FONT_HERSHEY_SIMPLEX
boxSize = 300
moveSize = 300
cordinates = sys.argv[1];
image = sys.argv[2];
img = cv2.imread(image)
heightPage, widthPage  = img.shape[:2]
overlay = img.copy()

# Checks if a link is inside a box
def containsLink (x,y,link):
	yLink = int(link['top'])
	xLink = int(link['left'])
	height = int(link['height'])
	width = int(link['width'])
	if containsPoint(x,y,xLink,yLink):
		return True
	if containsPoint(x,y,xLink+width,yLink):
		return True
	if containsPoint(x,y,xLink,yLink+height):
		return True
	if containsPoint(x,y,xLink+width,yLink+height):
		return True
	return False

# Checks if a point is inside a box
def containsPoint (x,y,xp,yp):
	if xp>x and xp<x+boxSize:
		if yp>y and yp<y+boxSize:
			return True
	return False

# Draw grid and find no of links in each grid
def getLinkDensity():
	y=0
	while True:	
		x=left
		if y+boxSize>heightPage:
			break
		while True:	
			if x+boxSize>widthPage:
				break
			cv2.rectangle(img,(x,y),(x+boxSize,y+boxSize),(80,100,20),2)
			counter=0
			for link in data['aTags']:
				link = json.loads(link)	
				if containsLink(x,y,link):
					counter+=1
			cv2.putText(img,str(counter),(x+boxSize/2,y+boxSize), font, 4,(0,0,0),2, cv2.FONT_HERSHEY_PLAIN)
			x += moveSize
		y += moveSize


left = widthPage
right = 0
with open(cordinates) as data_file:    
    data = json.load(data_file)

os.remove(cordinates)

for link in data['aTags']:
	link = json.loads(link)	
	yLink = int(link['top'])
	xLink = int(link['left'])
	if xLink<left:
		left = xLink
	height = int(link['height'])
	width = int(link['width'])
	if (xLink+width) >right:
		right = xLink+width 
	cv2.rectangle(img,(xLink,yLink),(xLink+width,yLink+height),(0,0,255),-1)
	cv2.rectangle(img,(xLink,yLink),(xLink+width,yLink+height),(0,0,0),2)
opacity = 0.3
cv2.addWeighted(overlay, opacity, img, 1 - opacity, 0, img)

# Draw margins
cv2.line(img,(left,0),(left,heightPage),(255,0,0),5)
cv2.line(img,(right,0),(right,heightPage),(255,0,0),5)

#Find number of links in boxes
getLinkDensity()

# Save image
saveImage = image+'-analyzed.jpg'
cv2.imwrite(saveImage,img)

# Show image
cv2.imshow('image',img)
cv2.waitKey(0)
cv2.destroyAllWindows()
