const express = require('express');
const router = express.Router();
const http = require('http');
const mysql = require('mysql');

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