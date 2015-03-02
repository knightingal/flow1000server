var fs = require('fs');
var RootDirString = '/home/knightingal/download/';
function main() {
    var picDirs = [];
    var dirs = fs.readdirSync(RootDirString);
    for (i = 0; i < dirs.length; i++) {
        var dirName = dirs[i];
        var stat = fs.statSync(RootDirString + dirName);
        if (stat.isDirectory()) {
            var picsOri = fs.readdirSync(RootDirString + dirName);
            var patt = new RegExp('\.jpg$');

            var pics = [];
            for (j = 0; j < picsOri.length; j++) {
                if (patt.test(picsOri[j]) === true) {
                    pics.push(picsOri[j]);
                }
            }
            if (pics[0] != undefined && pics[0] != null) {
                var fileStat = fs.statSync(RootDirString + dirName + "/" + pics[0]);
                picDirs.push({
                    "dirName": dirName,
                    "mtime": fileStat.mtime
                });
            }
        }
    }
    picDirs.sort(function(a, b) {
        return a.mtime.getTime() - b.mtime.getTime();
    });
    for (i = 0; i < picDirs.length; i++) {
        function getTrulyNumber(num) {
            return num < 10 ? "0" + num : "" + num;
        }
        console.log(picDirs[i].dirName + " " 
                + picDirs[i].mtime.getFullYear()
                + getTrulyNumber(picDirs[i].mtime.getMonth() + 1)
                + getTrulyNumber(picDirs[i].mtime.getDate())
                + getTrulyNumber(picDirs[i].mtime.getHours())
                + getTrulyNumber(picDirs[i].mtime.getMinutes())
                + getTrulyNumber(picDirs[i].mtime.getSeconds())
                );
    }


}

main();


