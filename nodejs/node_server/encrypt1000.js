const CryptoJS = require("crypto-js");
var config = require('./config');
const fs = require('fs');

const key = CryptoJS.enc.Utf8.parse(config.password);
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

let sectionDirs = fs.readdirSync('/home/knightingal/download/linux1000/source/')

for (let i = 0; i < sectionDirs.length; i++)
{
    const sectionDirName = sectionDirs[i];
    fs.mkdirSync("/home/knightingal/download/linux1000/encrypted/" + sectionDirName);
    const imgs = fs.readdirSync('/home/knightingal/download/linux1000/source/' + sectionDirName).filter((fileName) => {
        return fileName.match(/\S+\.[jJ][pP][gG]$/) != null;
    });

    for (let j = 0; j < imgs.length; j++)
    {
        const imgName = imgs[j];
        const data = fs.readFileSync("/home/knightingal/download/linux1000/source/" + sectionDirName + "/" + imgName);
        
        const encrytedArray = encyptoArray(data);
        fs.appendFileSync(
            "/home/knightingal/download/linux1000/encrypted/" + sectionDirName + "/" + imgName + ".bin", 
            encrytedArray
        );
    };

    console.log(`section ${sectionDirName} encrypted`);

};