var rep_list;

function repOver(obj) {
    for (i = 0; i < rep_list.length; i++) {
        rep_list[i].addEventListener("mouseover", mOver);
    }
}
document.key = CryptoJS.enc.Utf8.parse("");
const iv = CryptoJS.enc.Utf8.parse("2017041621251234");

function mOver(event) {
    //- console.log(event);
    document.getElementById("repertory").style.display = "none";
    document.getElementById("img_container").style.display = "block";
    //- document.getElementById("repertory").style.display = "none";
    var index = event.aindex;
    var picname = event.apicname;
    var imgNode = document.getElementById("quick_img");
    fetchEncryptedImg(imgNode, `/static/encrypted/${index}/${picname}.bin`)
}

const decryptArray = array => {
    var words = CryptoJS.lib.WordArray;
    words.init(array);


    var decrypted = CryptoJS.AES.decrypt(CryptoJS.enc.Base64.stringify(words), document.key, {
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

    return uI8Array;
}

const fetchEncryptedImg = (imgNode, url) => {
    fetch(url).then(function(response) {
        return response.arrayBuffer();
    }).then(function(arrayBuffer) {
        var decrypted = decryptArray(arrayBuffer);
        var objectURL = URL.createObjectURL(new Blob([decrypted]));

        imgNode.src = objectURL;
    });
}

function mDown(event) {

    // for (i = 0; i < rep_list.length; i++) {
    //     rep_list[i].removeEventListener("mouseover", mOver);
    // }
    document.getElementById("img_container").style.display = "none";
    document.getElementById("repertory").style.display = "block";
    document.getElementById("repertory").innerHTML = "";
    var local1000Req = new Request("/local1000/picContentAjax/?id=" + event.rep_id)
    fetch(local1000Req)
        .then(function(resp){
            return resp.json();
        })
        .then(function(resp) {
            console.log(resp);
            var repName = resp.dirName;
            for (var i = 0; i < resp.pics.length; i++) {
                document.getElementById("repertory").appendChild(document.createElement("img"));
            }
            resp.pics.forEach((pic, index) => {
                var img = document.getElementById("repertory").children[index];
                img.id="img" + index;
                fetchEncryptedImg(img, `/static/encrypted/${repName}/${pic}.bin`)
            });
        });
}