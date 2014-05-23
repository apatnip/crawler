import json
import urllib2
import HTMLParser
import urllib, urllib2
from bs4 import BeautifulSoup
from xml.dom.minidom import parse, parseString

'''
class parseTitle(HTMLParser.HTMLParser):

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            for name, value in attrs:
                if name == 'href':
                    print value # or the code you need.
  #              if name == 'title':
  #                  print value # or the code you need.

aparser = parseTitle()
'''



var=input('no of results?')
j = urllib2.urlopen('http://wwwranking.webdatacommons.org/Q/?pageIndex=0&pageSize='+str(var))
js = json.load(j)
ourResult = js['data']
for rs in ourResult:
#	print rs['harmonic']
	html = rs['harmonic']
#	url = aparser.feed(html)
#	print url
	soup = BeautifulSoup(html)
	for link in soup.findAll("a"):
		url =  link.get("href")
	print url
	aurl = 'http://data.alexa.com/data?cli=10&dat=snbamz&url='+url
	dom = parse( urllib2.urlopen( aurl))
	ranktag = dom.getElementsByTagName('REACH')
	print ranktag[0].attributes['RANK'].value
print 'done'
'''
	url = http://path.to.url/
    dom = minidom.parse(urlopen(url))
'''