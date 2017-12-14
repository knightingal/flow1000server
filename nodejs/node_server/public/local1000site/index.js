    function repOver(obj) {
        for (i = 0; i < rep_list.length; i++) {
            rep_list[i].addEventListener("mouseover", mOver);
        }
    }

    var rep_list;

    function onLoad() {
        $('#del_dlg').dialog('close');
        rep_list = document.getElementsByClassName("rep_list");
        repOver(null);
    }

    function mOver(event) {
        document.getElementById("img_container").style.display = "block";
        document.getElementById("repertory").style.display = "none";
        if (event.target.className==='rep_list') {
            var index = event.target.children[0].attributes.aindex.value;
            var picname = event.target.children[0].attributes.apicname.value;
            var imgNode = document.getElementById("quick_img");
            fetchEncryptedImg(imgNode, `/static/encrypted/${index}/${picname}.bin`)
        }
    }

    function mDown(obj) {
        for (i = 0; i < rep_list.length; i++) {
            rep_list[i].removeEventListener("mouseover", mOver);
        }
        document.getElementById("img_container").style.display = "none";
        document.getElementById("repertory").style.display = "block";
        document.getElementById("repertory").innerHTML = "";
        var local1000Req = new Request("/local1000/picContentAjax/?id=" + obj.children[0].attributes.rep_id.value)
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

    var repo2Del = null;

    function delRepo(obj) {
        console.log(obj);
        $('#del_dlg').dialog('open');
        repo2Del = obj;
    }

    function doDelRepo() {
        console.log(repo2Del);
    }

    function cancelDelRepo() {
        repo2Del = null;
        $('#del_dlg').dialog('close');
    }

const iv = CryptoJS.enc.Utf8.parse("2017041621251234");

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

