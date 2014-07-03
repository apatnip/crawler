# README #

Project Crawler

### Setup ###

* Clone the Repository
* Run in terminal 
```npm install
```
* Copy phantom.js from crawler to crawler/node_modules/phantom/.

### Configuration ###

* Manual configuration file can be provided in JSON file using -c option.
* Default configuration file is provided in repository named "config.json"

### What you can use it for ###

* To get URLS from wwwranking
* To find out what tools are used by any website (external JS).
* To get alexa data
* To get PageSpeed Insights data
* To find contrast ratio & link density in webpages.(Image Processing)

### Directions to Use ###

*  It can be used to get URLs and to process them. However it recommended to do one at a time.

### Running ###

  Usage: server [options]

  Options:

    -h, --help                     output usage information
    -V, --version                  output the version number
    -a, --automate                 Automate the whole process
    -r, --realtime                 Will make a live server on localhost with Port specified in config
    -c, --config [value]           Path to config file

