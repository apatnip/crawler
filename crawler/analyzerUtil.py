import sys
import os
import json
import cv2
import numpy as np
from pprint import pprint
from matplotlib import pyplot as plt
from pprint import pprint
from sklearn.cluster import KMeans

font = cv2.FONT_HERSHEY_SIMPLEX
boxSize = 100
moveSize = 20
cordinates = sys.argv[1];
image = sys.argv[2];
img = cv2.imread(image)
heightPage, widthPage  = img.shape[:2]
imageQuality = 56

overlay = img.copy()

def relativeLum(color):
	sRed = float(color[0]/255)
	sGreen = float(color[1]/255)
	sBlue = float(color[2]/255)
	R = [sRed/12.92 , ((sRed+0.055)/1.055) ** 2.4] [sRed > 0.03928] 
	G = [sGreen/12.92 , ((sGreen+0.055)/1.055) ** 2.4][sGreen > 0.03928] 
	B = [sBlue/12.92 , ((sBlue+0.055)/1.055) ** 2.4][sBlue > 0.03928] 
	L = 0.2126 * R + 0.7152 * G + 0.0722 * B
	return L

#can be merged in similar loop of for link in data['aTags']
def contrastCal ():
	imagE = img.copy()
	mask = imagE
	fontFace = cv2.FONT_HERSHEY_SCRIPT_SIMPLEX;
	fontScale = 1;
	thickness = 3;
	for link in data['aTags']:
		link = json.loads(link)
		y = int(link['top'])
		x = int(link['left'])
		height = int(link['height'])
		width = int(link['width'])
		crop_img = imagE[y:y+height, x:x+width]
		if crop_img.size > 0:
			crop_img = cv2.cvtColor(crop_img, cv2.COLOR_BGR2RGB)
			# reshape the crop_img to be a list of pixels
			crop_img = crop_img.reshape((crop_img.shape[0] * crop_img.shape[1], 3))
			# cluster the pixel intensities
			clt = KMeans(n_clusters = 2)
			clt.fit(crop_img)
			rL_back = relativeLum(clt.cluster_centers_[0])
			rL_text = relativeLum(clt.cluster_centers_[1])
			contrast = rL_back/rL_text
			contrast = [contrast , 1/contrast][contrast < 1]
			text = str(round(contrast,1))
			cv2.putText(mask, text, (x+width/4,y+height/4),font, fontScale,(0,0,0),thickness, 8)
			cv2.addWeighted(mask, 0.8, imagE, 1 - 0.8, 0, imagE)

	# Save image
	saveImage = image+'-contrast.jpg'
	cv2.imwrite(saveImage,imagE,[int(cv2.IMWRITE_JPEG_QUALITY),imageQuality])
	cv2.imshow('Contrast',imagE)
	cv2.waitKey(0)

# Checks if a link is inside a box
def containsLink (x,y,link):
	yLink = int(link['top'])
	xLink = int(link['left'])
	height = int(link['height'])
	width = int(link['width'])
	if containsPoint(x,y,xLink+ width/2,yLink+height/2):
		return True
	'''
	if containsPoint(x,y,xLink,yLink):
		return True
	if containsPoint(x,y,xLink+width,yLink):
		return True
	if containsPoint(x,y,xLink,yLink+height):
		return True
	if containsPoint(x,y,xLink+width,yLink+height):
		return True
		'''
	return False

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
			if counter>=halfmax/3:
				cv2.rectangle(img,(x+boxSize/2 - moveSize/2,y+boxSize/2 -moveSize/2),(x+boxSize/2 +moveSize/2,y+boxSize/2 + moveSize/2),(b,g,r),-1)
			if x+boxSize>widthPage:
				break
			x += moveSize
		y += moveSize

# Read coordinates from file
with open(cordinates) as data_file:    
    data = json.load(data_file)

# Remove coordinates file
#os.remove(cordinates)

contrastCal()

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

#blur = cv2.blur(img,(50,50))

opacity = 0.2
cv2.addWeighted(overlay, opacity, img, 1 - opacity, 0, img)

# Save image
saveImage = image+'-analyzed.jpg'
cv2.imwrite(saveImage,img,[int(cv2.IMWRITE_JPEG_QUALITY),imageQuality])

# Show image
cv2.imshow('image',img)
cv2.waitKey(0)
cv2.destroyAllWindows()
