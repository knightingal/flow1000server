__author__ = 'knightingal'

import PyHTTPServer
import os


def str_cmp(str1, str2):
    if len(str1) < len(str2):
        return -1
    elif len(str1) > len(str2):
        return 1
    else:
        return str1 > str2 and 1 or -1

if __name__ == "__main__":
    #print PyHTTPServer.rootDirString
    #rootDirString = '/home/knightingal/Downloads/.mix/1000/'
    for root, dirs, files in os.walk(PyHTTPServer.rootDirString):
        if root != PyHTTPServer.rootDirString:
            print root
            pagefd = open(root + "/page.html", "w")
            #print dirs
            pagefd.write("<html><head></head><body>")

            files.sort(str_cmp)
            for picname in files:
                pagefd.write('<img src="' + picname + '"></img>')
            pagefd.write("</body></html>")
