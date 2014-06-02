import cv2
import numpy as np
from matplotlib import pyplot as plt
import os
for filename in os.listdir('./screenshots'):
	print 'Saving Histogram of '+ filename
	img = cv2.imread('./screenshots/'+filename)
	color = ('b','g','r')
	for i,col in enumerate(color):
	    histr = cv2.calcHist([img],[i],None,[256],[0,256])
	    plt.plot(histr,color = col)
	    plt.xlim([0,256])
	plt.savefig(filename+'-histogram.png')