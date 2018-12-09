const express = require('express');
const router = express.Router();
const http = require('http');
const mysql = require('mysql');
const path = require('path');
const images = require('images');
const config = require('../config')

const connection = mysql.createConnection({
    host:'127.0.0.1',
    user:'knightingal',
    password:config.dbpassword,
    database:'flow1000db'
});
connection.connect();

function updateSize(picId, width, height) {
    return new Promise((res, rej) => {
        connection.query('update flow1000img set width=?, height=? where id=?', [width, height, picId], (error, results, fields) => {
            if (error) throw error;
            res(results.insertId);
        });
    });
}

function queryRepertorys(time_stamp, album) {
    return new Promise((res, rej) => {
        connection.query('select * from flow1000section where create_time > ' + time_stamp + ' and album = \'' + album + '\'', (err, rows, fields) => {
            if (err) throw err;
            res(rows);
        });
    });
}

function queryTarsyliaBook() {
    return new Promise((resolve, reject) => {
        connection.query('select * from tarsylia_book', (err, rows, fields) => {
            if (err) throw err;
            resolve(rows);
        });
    });
}

function queryTarsyliaSection(book_id) {
    return new Promise((resolve, reject) => {
        connection.query('select * from tarsylia_section where book_id = ' + book_id, (err, rows, fields) => {
            if (err) throw err;
            resolve(rows);
        });
    });
}

function queryTarsyliaImg(section_id) {
    return new Promise((resolve, reject) => {
        connection.query('select * from tarsylia_img where section_id = ' + section_id, (err, rows, fields) => {
            if (err) throw err;
            resolve(rows);
        });
    });
}

function insertRepertorys(repertory) {
    return new Promise((res, rej) => {
        connection.query('insert into flow1000section set ?', repertory, (error, results, fields) => {
            if (error) throw error;
            res(results.insertId);
        });
    });
}

function insertPisInstance(picInstance) {
    return new Promise((res, rej) => {
        connection.query('insert into flow1000img set ?', picInstance, (error, results, fields) => {
            if (error) throw error;
            res(results.insertId);
        });
    });
}

function queryRepertorysById(reperId) {
    return new Promise((res, rej) => {
        connection.query('select * from flow1000section where id = ' + reperId, (err, rows, fields) => {
            if (err) throw err;
            res(rows);
        });
    });
}

function queryPicsByReperId(reperId) {
    return new Promise((res, rej) => {
        connection.query('select * from flow1000img where section_id = ' + reperId, (err, rows, fields) => {
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

router.get("/winjs1000index", function (req, res) {
    queryRepertorys("19701010000000").then(pic_repertorys => {
        res.render('winjs1000index', {pic_repertorys: pic_repertorys});
    })
})

router.get('/picDetailAjax', function(req, res) {
    var reperId = req.query.id;
    (async (reperId) => {
        let repers = await queryRepertorysById(reperId);
        console.log(repers)
        let reper = {
            dirName:repers[0].dir_name,
            picpage:reperId,
        }
        reper.pics = (await queryPicsByReperId(reperId)).map(pic => {
            return {
                "name":pic.name, 
                "width":pic.width, 
                "height":pic.height
            };
        });
        return reper;
    })(reperId).then(reper=> {
        res.send(JSON.stringify(reper));
    });
    if (router.echoWs !== undefined) {
        router.echoWs.send("picDetailAjax");
    }
});

router.get('/picContentAjax', function(req, res) {
    var reperId = req.query.id;
    (async (reperId) => {
        let repers = await queryRepertorysById(reperId);
        console.log(repers)
        let reper = {
            dirName:repers[0].dir_name,
            picpage:reperId,
        }
        reper.pics = (await queryPicsByReperId(reperId)).map(pic => {
            return pic.name;
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

router.post('/allComplete/', (req, res) => {
    const bodyObj = req.body;
    res.send("");
    console.log(`allComplete: ${JSON.stringify(bodyObj)}`);

    // const pics = queryPicsByReperId(bodyObj.sectionId);
    queryPicsByReperId(bodyObj.sectionId)
    .then(pics => {
        connection.beginTransaction();
        return Promise.all(pics.map(pic => {
            const path = `${bodyObj.dirName}/${pic.name}`;
            const img = images(path);
            console.log(`${path}: width:${img.width()}, height:${img.height()}`);
            return updateSize(pic.id, img.width(), img.height());
        }));
    })
    .then((retValues) => {
        connection.commit();
    });

    if (router.updateListenerWs !== undefined) {
        (async (reperId) => {
            let repers = await queryRepertorysById(reperId);
            return {
                index: repers[0].id,
                name: repers[0].dir_name,
                mtime: repers[0].create_time
            };
        })(bodyObj.sectionId).then(reper => {
            router.updateListenerWs.send(JSON.stringify(reper));
        });
    }
});

router.post('/urls1000/', function(req, res) {
    // let body = '{"title":"title1","imgSrcArray":[
    //    {"src":"http://127.0.0.1/1.jpg","ref":"http://127.0.0.1/16.html"},
    //    {"src":"http://127.0.0.1/2.jpg","ref":"http://127.0.0.1/16.html"}
    // ]}'
    let bodyObj = req.body;
    let stamp = (new Date()).toStamp();
    let title = stamp + bodyObj.title;
    bodyObj.title = title;
    let picRepertory = {
        name: title.substring(14),
        dir_name:title, 
        create_time: stamp, 
        cover:path.basename(bodyObj.imgSrcArray[0].src)
    };
    insertRepertorys(picRepertory)
    .then(id => {
        picRepertory.id = id;
        bodyObj.sectionId = id;
        let picInstances = bodyObj.imgSrcArray.map(img => {
            return {
                name:path.basename(img.src),
                section_id:id,
                in_cover:0
            };
        });
        picInstances[0].in_cover = 1;
        connection.beginTransaction();
        return Promise.all(picInstances.map(picInstance => {
            return insertPisInstance(picInstance);
        }));
    })
    .then(retValues=> {
        connection.commit();
        // console.log(retValues);
        res.send(JSON.stringify(retValues));

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
    // var fileName = path.basename(imgSrc);
});

router.get('/repertory', function(req, res) {
    var reperId = req.query.id;
    (async (reperId) => {
        let repers = await queryRepertorysById(reperId);
        console.log(repers)
        let reper = {
            dirName:repers[0].dir_name,
            picpage:reperId,
        }
        reper.pics = (await queryPicsByReperId(reperId)).map(pic => {
            return {
                name:pic.name
            };
        });
        return reper;
    })(reperId).then(reper=> {
        res.send(JSON.stringify(reper));
    });
});

router.get('/picIndexAjax', (req, res) => {
    res.set({
        "Content-Type":"application/json;charset=UTF-8"
    });
    var time_stamp = req.query.time_stamp;
    if (time_stamp == null || time_stamp == "") {
        time_stamp = "19700101000000";
    }
    var album = req.query.album;
    if (album == null || album == "") {
        album = "flow1000";
    }

    (async (time_stamp, album) => {
        repertorys = await queryRepertorys(time_stamp, album);
        return repertorys.map(reper=> {
            return {
                index:reper.id,
                name:reper.dir_name, 
                mtime:reper.create_time, 
            };
        });
    })(time_stamp, album).then(repertorys => {
        res.send(JSON.stringify(repertorys));
    });
    if (router.echoWs !== undefined) {
        router.echoWs.send("picIndexAjax");
    }
});
router.get('/tarsylia', function(req, res) {
    
    (async () => {
        books = await queryTarsyliaBook();
        for (let book of books) {
            let sectionDetails = await queryTarsyliaSection(book.id);
            book.section = sectionDetails;
            for (let section of sectionDetails) {
                let imgDetails = await queryTarsyliaImg(section.id);
                section.img = imgDetails;
            }
        }
        return books;
    })().then(books => {
        res.send(JSON.stringify(books));
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
                name:reper.name, 
                mtime:reper.create_time, 
            };
        });
    })(time_stamp).then(repertorys => {
        res.send(JSON.stringify(repertorys));
    });
});

module.exports = router;