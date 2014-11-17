var express = require('express');
var router = express.Router();
var fs = require('fs');
//var RootDirString = '/home/knightingal/Downloads/.mix/1000/';
/* GET users listing. */
var kn_creptor = require('../kn_creptor');
router.get('/', function(req, res) {

  if (req.query.picpage === undefined) {
    res.render('picIndex', {title: 'Index', picList: router.dirStat});
  }
  else {
    var dirName = router.dirStat[req.query.picpage].name;
    var dirsOri = fs.readdirSync(router.RootDirString + dirName);
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

router.get(/\/picContent\/(\w+)\/(\w+\.jpg)/, function(req, res) {
    var picpage = req.params[0];
    var pic = req.params[1];
    var dirName = router.dirStat[picpage].name;
    var picBuff = fs.readFileSync(router.RootDirString + dirName + "/" + pic);
    //picBuff = kn_creptor.decode(picBuff, "Knightingal");
    res.send(picBuff);
});

module.exports = router;
