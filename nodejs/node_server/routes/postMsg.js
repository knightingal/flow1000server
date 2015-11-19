var express = require('express');
var router = express.Router();
var http = require("http");
var fs = require("fs");
var url = require('url');
var path = require('path');

// var reqs = {};
// var bufferArray = {};

var RootDirString = 'D:\\Python27\\testdir\\testsubdir\\';

function ReqHeadersTemp() {
    // this["Referer"] = pageHref;
    this["User-Agent"]= "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.63 Safari/537.31";
    this["Connection"]= "keep-alive";
    this["Accept"]= "*/*";
    this["Accept-Encoding"]= "gzip,deflate,sdch";
    this["Accept-Language"]= "zh-CN,zh;q=0.8";
    this["Accept-Charset"]= "GBK,utf-8;q=0.7,*;q=0.3";
}

var gImgCount = 0;
var gSuccCount = 0;

function getHttpReqCallback(fileName, dirName) {
    return function (res) {
        var fileBuff = [];
        res.on('data', (function(fileName) {
            return function (chunk) {
                var buffer = new Buffer(chunk);
                fileBuff.push(buffer);
            };
        })(fileName));
        res.on('end', (function(fileName) {
            return function() {
                var totalBuff = Buffer.concat(fileBuff);
                fs.appendFile(dirName + "/" + fileName, totalBuff, function(err){});
                gSuccCount += 1;
                console.log("(" + gSuccCount + "/" + gImgCount + ")" + fileName + " download succ!");

                if (gSuccCount == gImgCount) {
                    console.log("all task succ!");
                    gImgCount = gSuccCount = 0;
                    router.initCb();
                }
            };
        })(fileName))
    };
}

function startDownload(imgSrc, dirName) {
    var urlObj = url.parse(imgSrc);
    var fileName = path.basename(imgSrc);
    var options = {
        host: urlObj.host,
        path: urlObj.path,
        headers: new ReqHeadersTemp()
    };
    
    var req = http.request(options, getHttpReqCallback(fileName, dirName));
    req.setTimeout(60 * 1000, function() {
        console.log(imgSrc + 'timeout, try again...');
        req.abort();
        startDownload(imgSrc, dirName); 
    });
    req.on('error', function(e) {
        startDownload(imgSrc, dirName);             
    });
    
    req.end();
}

//TODO: so many anonymous function, and callback hell!!!
router.post('/', function(req, res) {
    console.log(req.body);
    res.send('ok');
    gImgCount += req.body.imgSrcArray.length;
    var dirName = RootDirString + req.body.title;
    
    
    fs.mkdir(dirName, function() {
        
        console.log(req.body.imgSrcArray);
        console.log(req.body.href);

        var imgSrcArray = req.body.imgSrcArray;
        // var pageHref = req.body[j].href;
        for (var i = 0; i < imgSrcArray.length; i++) {
            var imgSrc = imgSrcArray[i];
            startDownload(imgSrc, dirName)
        }
        
    });

});

module.exports = router;
