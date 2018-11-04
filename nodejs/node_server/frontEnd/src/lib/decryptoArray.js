var CryptoJS = require("crypto-js");

function decryptArray(fileContent, password) {

    var words = CryptoJS.lib.WordArray;
    words.init(fileContent);


    var key = CryptoJS.enc.Utf8.parse(password); //16位
    const iv = CryptoJS.enc.Utf8.parse("2017041621251234");
    var decrypted = CryptoJS.AES.decrypt(CryptoJS.enc.Base64.stringify(words), key, {
        iv: iv,
        mode:CryptoJS.mode.CFB, 
        padding: CryptoJS.pad.ZeroPadding
    });

    var uI8Array = new Uint8Array(decrypted.words.length * 4);
    decrypted.words.forEach((word, index) => {
        uI8Array[index * 4 + 3] = word & 0xff;
        uI8Array[index * 4 + 2] = word >>> 8 & 0xff;
        uI8Array[index * 4 + 1] = word >>> 16 & 0xff;
        uI8Array[index * 4] = word >>> 24 & 0xff;
    });

    return uI8Array.slice(0, decrypted.sigBytes);
}

module.exports.decryptArray = decryptArray;