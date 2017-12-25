var express = require('express');
const CryptoJS = require("crypto-js");
var router = express.Router();
var http = require("http");
var fs = require("fs");
var url = require('url');
var path = require('path');
var EventEmitter = require('events');

function DEventEmitter() {
    EventEmitter.call(this);
}

require('util').inherits(DEventEmitter, EventEmitter)
var dEmitter = new DEventEmitter();

dEmitter.on("next", function(dirName) {
    var currentImg = ImgSrcArray.getCurrentImg();
    if (currentImg != undefined) {
        startDownload(currentImg, dirName);
    }
});

var RootDirString = 'D:\\Games\\linux1000\\source\\';
var enCryptedDirString = 'D:\\Games\\linux1000\\encrypted\\' 

function ReqHeadersTemp(ref) {
    this["User-Agent"]= "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";
    this["Connection"]= "keep-alive";
    this["Accept"]= "image/webp,image/*,*/*;q=0.8";
    this["Accept-Encoding"]= "gzip,deflate,sdch";
    this["Accept-Language"]= "zh-CN,zh;q=0.8";
    this["Referer"]=ref
    this["Pragma"]="no-cache"
    this["Cache-Control"]="no-cache"
    this["Host"]="531.1000yishu.com"
}

var gImgCount = 0;
var gSuccCount = 0;
const key = CryptoJS.enc.Utf8.parse(""); //16位
const iv = CryptoJS.enc.Utf8.parse("2017041621251234");

const encyptoArray = (array) => {
    var words = CryptoJS.lib.WordArray;
    words.init(array);
    var encrypted = CryptoJS.AES.encrypt(words, key, {
        iv: iv,
        mode:CryptoJS.mode.CFB, 
        padding: CryptoJS.pad.ZeroPadding
    });

    var uI8Array = new Uint8Array(encrypted.ciphertext.words.length * 4);
    encrypted.ciphertext.words.forEach((word, index) => {
        uI8Array[index * 4 + 3] = word & 0xff;
        uI8Array[index * 4 + 2] = word >>> 8 & 0xff;
        uI8Array[index * 4 + 1] = word >>> 16 & 0xff;
        uI8Array[index * 4] = word >>> 24 & 0xff;
    });

    return  uI8Array.slice(0, encrypted.ciphertext.sigBytes);
}

function getHttpReqCallback(imgSrc, dirName) {
    var fileName = path.basename(imgSrc.src);
    return function (res) {
      // console.log('STATUS: ' + res.statusCode);
      // console.log('HEADERS: ' + JSON.stringify(res.headers));
        var contentLength = parseInt(res.headers['content-length']);
        var fileBuff = [];
        res.on('data', (function(fileName) {
            return function (chunk) {
                var buffer = new Buffer(chunk);
                fileBuff.push(buffer);
            };
        })(fileName));
        res.on('end', (function(fileName, contentLength) {
            return function() {
                var totalBuff = Buffer.concat(fileBuff);
                console.log("bufferLenght = " + totalBuff.length + ", this contentLength = " + contentLength);
                if (totalBuff.length < contentLength) {
                    console.log(imgSrc + " download error, try again");
                    startDownload(imgSrc, dirName);
                    return;
                }
                var totalArray = Uint8Array.from(totalBuff);
                var encrytedArray = encyptoArray(totalArray);
                fs.appendFile(dirName[0] + "/" + fileName, totalBuff, function(err){});
                fs.appendFile(dirName[1] + "/" + fileName + ".bin", encrytedArray, function(err){});
                gSuccCount += 1;
                console.log("(" + gSuccCount + "/" + gImgCount + ")" + fileName + " download succ!");

                if (gSuccCount == gImgCount) {
                    console.log("all task succ!");
                    gImgCount = gSuccCount = 0;
                    //router.initCb();
                }
                dEmitter.emit("next", dirName);
            };
        })(fileName, contentLength));
    };
}

function startDownload(imgSrc, dirName) {
    var urlObj = url.parse(imgSrc.src);
    // var fileName = path.basename(imgSrc);
    var options = {
        host: urlObj.host,
        path: urlObj.path,
        headers: new ReqHeadersTemp(imgSrc.ref)
    };

    var req = http.request(options, getHttpReqCallback(imgSrc, dirName));
    req.setTimeout(60 * 1000, function() {
        console.log(imgSrc + 'timeout');
        req.abort();
    });
    req.on('error', function(e) {
        startDownload(imgSrc, dirName);
    });

    req.end();
}

function downloadNavyFor20(imgSrcArray, dirName) {
    for (var i = 0; i < imgSrcArray.length; i++) {
        var imgSrc = imgSrcArray[i].imrSrc;
        startDownload(imgSrc, dirName);
    }
}

function downloadFor20(imgSrcArray, dirName) {
    for (var i = 0; i < imgSrcArray.length; i++) {
        //   var imgSrc = imgSrcArray[i].imrSrc;
        var imgSrc = imgSrcArray[i];
        startDownload(imgSrc, dirName)
    }
}

var ImgSrcArray = {
    "imgSrcArray": [],
    "currentIndex": 0,
    "getCurrentImg": function() {
        return this.imgSrcArray[this.currentIndex++];
    },
    "get20Img": function() {
        this.currentIndex = 10;
        return this.imgSrcArray.slice(0, 10);
    },
};

//TODO: so many anonymous function, and callback hell!!!
router.post('/', function(req, res) {
    console.log(req.body);

    gImgCount += req.body.imgSrcArray.length;
    var nowTime = new Date(Date.now());
    var nowString = "" + nowTime.getFullYear() +
        ((nowTime.getMonth() + 1) < 10 ? "0" + (nowTime.getMonth() + 1) : (nowTime.getMonth() + 1)) +
        (nowTime.getDate() < 10 ? "0" + nowTime.getDate() : nowTime.getDate()) +
        (nowTime.getHours() < 10 ? "0" + nowTime.getHours() : nowTime.getHours())+
        (nowTime.getMinutes() < 10 ? "0" + nowTime.getMinutes() : nowTime.getMinutes()) +
        (nowTime.getSeconds() < 10 ? "0" + nowTime.getSeconds() : nowTime.getSeconds());
    var title = req.body.title;


    var dirName = [RootDirString + title, enCryptedDirString + title];
    res.send(title);
    gSuccCount = 0;
    fs.mkdirSync(dirName[1]);
    fs.mkdir(dirName[0], function() {
        console.log(req.body.imgSrcArray);
        console.log(req.body.href);
        var imgSrcArray = req.body.imgSrcArray;
        ImgSrcArray.imgSrcArray = imgSrcArray;
        ImgSrcArray.currentIndex = 0;
        downloadFor20(ImgSrcArray.get20Img(), dirName);
    });
});
router.downloadFor20 = downloadFor20;

module.exports = router;
