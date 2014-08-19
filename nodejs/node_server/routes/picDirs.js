var express = require('express');
var router = express.Router();
var fs = require('fs');
var RootDirString = '/home/knightingal/Downloads/.mix/1000/';
/* GET users listing. */

//router.dirs = {};
//router.dirStat = [];
router.get('/', function(req, res) {

  if (req.query.picpage === undefined) {
    res.render('picIndex', {title: 'Index', picList: router.dirStat});
  }
  else {
    var dirName = router.dirStat[req.query.picpage].name;
    var dirsOri = fs.readdirSync(RootDirString + dirName);
    var patt = new RegExp('\.jpg$');
    var dirs = [];
    for (i = 0; i < dirsOri.length; i++) {
        if (patt.test(dirsOri[i]) === true) {
            dirs.push(dirsOri[i]);
        }
    }
    dirs.sort(function(a, b) {
        return parseInt(a) - parseInt(b);
    });
    res.render('picContent', {
        'title': 'PicContent', 
        'dirName': dirName, 
        'picpage': req.query.picpage, 
        'pics': dirs
    });
  }

});

router.get('/picContent', function(req, res) {
    var picpage = req.query.picpage;
    var pic = req.query.pic;
    var dirName = router.dirStat[req.query.picpage].name;
    var picBuff = fs.readFileSync(RootDirString + dirName + "/" + pic);
    res.send(picBuff);
});

module.exports = router;
