import sys
import os
import json
import cv2
import numpy as np
from pprint import pprint
from matplotlib import pyplot as plt

font = cv2.FONT_HERSHEY_SIMPLEX
boxSize = 100
moveSize = 20
cordinates = sys.argv[1];
image = sys.argv[2];
img = cv2.imread(image)
heightPage, widthPage  = img.shape[:2]
imageQuality = 56

overlay = img.copy()

# Checks if a link is inside a box
def containsLink (x,y,link):
	yLink = int(link['top'])
	xLink = int(link['left'])
	height = int(link['height'])
	width = int(link['width'])
	if xLink > x+boxSize or x >xLink + width:
		return False
	if yLink >y + boxSize or y > yLink + height:
		return False
	return True

# Checks if a point is inside a box
def containsPoint (x,y,xp,yp):

	if xp>=x and xp<=x+boxSize:
		if yp>=y and yp<=y+boxSize:
			return True
	return False
 
# claculate max density
def getMax():
	maxl = 0
	maxx = 0
	maxy = 0
	y=0
	while True:	
		x=left
		if y+boxSize>heightPage:
			break
		while True:	
			if x+boxSize>widthPage:
				break
			counter=0
			for link in data['aTags']:
				link = json.loads(link)	
				if containsLink(x,y,link):
					counter+=1
			if counter>maxl:
				maxl = counter
			x += moveSize
		y += moveSize
	return float(maxl)

# Draw grid and find no of links in each box
def getLinkDensity():
	y= -boxSize/2
	halfmax = getMax()/2
	while True:	
		x=0
		if y+boxSize>heightPage:
			break
		while True:	
			counter=0
			for link in data['aTags']:
				link = json.loads(link)	
				if containsLink(x,y,link):
					counter+=1
			# Heatmap
			r = int(max(0, (255*(counter/halfmax - 1))))
			b = int(max(0, (255*(1 - counter/halfmax))))
			g = 255-b-r
		#	cv2.putText(overlay,str(counter),(x+boxSize/3,y+boxSize/2), font, 2,(b,g,r),3, cv2.FONT_HERSHEY_PLAIN)
			if counter>=halfmax/2:
				cv2.rectangle(img,(x+boxSize/2 - moveSize/2,y+boxSize/2 -moveSize/2),(x+boxSize/2 +moveSize/2,y+boxSize/2 + moveSize/2),(b,g,r),-1)
			if x+boxSize>widthPage:
				break
			x += moveSize
		y += moveSize

# Read coordinates from file
with open(cordinates) as data_file:    
    data = json.load(data_file)

# Remove coordinates file
# os.remove(cordinates)

# Plot links in image and find margins
left = widthPage
right = 0
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
	cv2.rectangle(img,(xLink,yLink),(xLink+width,yLink+height),(50,50,50),2)

# Draw margins
cv2.line(img,(left,0),(left,heightPage),(255,0,0),5)
cv2.line(img,(right,0),(right,heightPage),(255,0,0),5)

# Find number of links in boxes
getLinkDensity()

blur = cv2.blur(img,(moveSize/2,moveSize/2))

opacity = 0.8
cv2.addWeighted(overlay, opacity, blur, 1 - opacity, 0, img)

# Save image
saveImage = image+'-analyzed.jpg'
cv2.imwrite(saveImage,img,[int(cv2.IMWRITE_JPEG_QUALITY),imageQuality])

# Show image
cv2.imshow('image',img)
cv2.waitKey(0)
cv2.destroyAllWindows()
print 'Done'