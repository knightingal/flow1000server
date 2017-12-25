const express = require('express');
const router = express.Router();
const http = require('http');
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');
const postMsg = require('./postMsg');
const url = require('url');

const connection = mysql.createConnection({
    host:'127.0.0.1',
    user:'Knightingal',
    password:'123456',
    database:'djangodb'
});
connection.connect();

function queryRepertorys(time_stamp) {
    return new Promise((res, rej) => {
        connection.query('select * from local1000site_picrepertory where pub_date > ' + time_stamp, (err, rows, fields) => {
            if (err) throw err;
            res(rows);
        });
    });
}

function insertRepertorys(repertory) {
    return new Promise((res, rej) => {
        connection.query('insert into local1000site_picrepertory set ?', repertory, (error, results, fields) => {
            if (error) throw error;
            res(results.insertId);
        });
    });
}

function insertPisInstance(picInstance) {
    return new Promise((res, rej) => {
        connection.query('insert into local1000site_picinstance set ?', picInstance, (error, results, fields) => {
            if (error) throw error;
            res(results.insertId);
        });
    });
}

function queryRepertorysById(reperId) {
    return new Promise((res, rej) => {
        connection.query('select * from local1000site_picrepertory where id = ' + reperId, (err, rows, fields) => {
            if (err) throw err;
            res(rows);
        });
    });
}

function queryPicsByReperId(reperId) {
    return new Promise((res, rej) => {
        connection.query('select * from local1000site_picinstance where repertory_id = ' + reperId, (err, rows, fields) => {
            if (err) throw err;
            res(rows);
        });
    });
}

router.get("/", function (req, res) {
    queryRepertorys("19701010000000").then(pic_repertorys => {
        res.render('local1000index', {pic_repertorys: pic_repertorys});
    })
})

router.get('/picContentAjax', function(req, res) {
    var reperId = req.query.id;
    (async (reperId) => {
        let repers = await queryRepertorysById(reperId);
        console.log(repers)
        let reper = {
            dirName:repers[0].rep_name,
            picpage:reperId,
        }
        reper.pics = (await queryPicsByReperId(reperId)).map(pic => {
            return pic.pic_name;
        });
        return reper;
    })(reperId).then(reper=> {
        res.send(JSON.stringify(reper));
    });
});

Date.prototype.numericArray = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"];
Date.prototype.toStamp = function() {
    
    let year = this.getFullYear();
    let month = this.getMonth() + 1;
    let day = this.getDate();
    let hour = this.getHours();
    let minute = this.getMinutes();
    let second = this.getSeconds();

    return year.toString() 
        + (month > 9 ? month.toString() : this.numericArray[month])
        + (day > 9 ? day.toString(): this.numericArray[day])
        + (hour > 9 ? hour.toString(): this.numericArray[hour])
        + (minute > 9 ? minute.toString(): this.numericArray[minute])
        + (second > 9 ? second.toString(): this.numericArray[second]);
}
var RootDirString = 'D:\\Games\\linux1000\\source\\';
var enCryptedDirString = 'D:\\Games\\linux1000\\encrypted\\' 

router.post('/urls1000/', function(req, res) {
    // let body = '{"title":"title1","imgSrcArray":[
    //    {"src":"http://127.0.0.1/1.jpg","ref":"http://127.0.0.1/16.html"},
    //    {"src":"http://127.0.0.1/2.jpg","ref":"http://127.0.0.1/16.html"}
    // ]}'
    let bodyObj = req.body;
    let stamp = (new Date()).toStamp();
    let title = stamp + bodyObj.title;
    bodyObj.title = title;
    let picRepertory = {rep_name: title, pub_date: stamp, cover:path.basename(bodyObj.imgSrcArray[0].src)};
    insertRepertorys(picRepertory)
    .then(id => {
        picRepertory.id = id;
        let picInstances = bodyObj.imgSrcArray.map(img => {
            return {
                pic_name:path.basename(img.src),
                repertory_id:id,
                is_cover:0
            };
        });
        picInstances[0].is_cover = 1;
        connection.beginTransaction();
        return Promise.all(picInstances.map(picInstance => {
            return insertPisInstance(picInstance);
        }));
    })
    .then(retValues=> {
        connection.commit();
        // console.log(retValues);
        res.send(JSON.stringify(retValues));
    });
    // var fileName = path.basename(imgSrc);
    var options = {
        host: '127.0.0.1',
        port: 8000,
        path: '/startDownload/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(bodyObj))
          }
    };

    var req = http.request(options, res => {
        // console.log(`STATUS: ${res.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            // console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            // console.log('No more data in resp');
        });
    });
    req.on('error', (e) => {
        console.error(`problem with requst: ${e.message}`);
    });
    req.write(JSON.stringify(bodyObj));
    req.end();
});

router.get('/repertory', function(req, res) {
    var reperId = req.query.id;
    (async (reperId) => {
        let repers = await queryRepertorysById(reperId);
        console.log(repers)
        let reper = {
            dirName:repers[0].rep_name,
            picpage:reperId,
        }
        reper.pics = (await queryPicsByReperId(reperId)).map(pic => {
            return {
                name:pic.pic_name
            };
        });
        return reper;
    })(reperId).then(reper=> {
        res.send(JSON.stringify(reper));
    });
});


router.get('/picIndex', function(req, res) {
    var time_stamp = req.query.time_stamp;
    if (time_stamp == null || time_stamp == "") {
        time_stamp = "19700101000000";
    }

    (async (time_stamp) => {
        repertorys = await queryRepertorys(time_stamp);
        return repertorys.map(reper=> {
            return {
                index:reper.id,
                name:reper.rep_name, 
                mtime:reper.pub_date, 
            };
        });
    })(time_stamp).then(repertorys => {
        res.send(JSON.stringify(repertorys));
    });
});

module.exports = router;