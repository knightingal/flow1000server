const fs = require('fs');
const mysql = require('mysql');
const images = require('images');
const config = require('./config');

const connection = mysql.createConnection({
    host:'127.0.0.1',
    user:'knightingal',
    password:config.dbpassword,
    database:'flow1000db'
});


connection.connect();

/*
+-------------+--------------+------+-----+---------+----------------+
| Field       | Type         | Null | Key | Default | Extra          |
+-------------+--------------+------+-----+---------+----------------+
| id          | int(11)      | NO   | PRI | NULL    | auto_increment |
| name        | varchar(128) | YES  |     | NULL    |                |
| create_time | varchar(14)  | YES  |     | NULL    |                |
| cover       | varchar(128) | YES  |     | NULL    |                |
+-------------+--------------+------+-----+---------+----------------+
*/
function insertRepertorys(repertory) {
    return new Promise((res, rej) => {
        connection.query('insert into flow1000section set ?', repertory, (error, results, fields) => {
            if (error) throw error;
            res(results.insertId);
        });
    });
}

/*
+------------+-------------+------+-----+---------+----------------+
| Field      | Type        | Null | Key | Default | Extra          |
+------------+-------------+------+-----+---------+----------------+
| id         | int(11)     | NO   | PRI | NULL    | auto_increment |
| name       | varchar(64) | YES  |     | NULL    |                |
| section_id | int(11)     | YES  |     | NULL    |                |
| in_cover   | int(11)     | YES  |     | NULL    |                |
+------------+-------------+------+-----+---------+----------------+
*/
function insertPisInstance(picInstance) {
    return new Promise((res, rej) => {
        connection.query('insert into flow1000img set ?', picInstance, (error, results, fields) => {
            if (error) throw error;
            res(results.insertId);
        });
    });
}

let sectionDirs = fs.readdirSync('/home/knightingal/download/linux1000/source/')

sectionDirs.forEach((sectionDirName) => {

    var imgs = fs.readdirSync('/home/knightingal/download/linux1000/source/' + sectionDirName).filter((fileName) => {
        return fileName.match(/\S+\.[jJ][pP][gG]$/) != null;
    });
    imgs = imgs.sort((a, b) => {
        return Number.parseInt(a) - Number.parseInt(b);
    });
    const section = {
        dir_name: sectionDirName,
        name: sectionDirName.substring(14),
        create_time: sectionDirName.substring(0, 14),
        cover: imgs[0]
    }
    insertRepertorys(section)
    .then(id => {
        const imgInstances = imgs.map((imgName, index) => {
            // const img = images('/home/knightingal/download/linux1000/source/' + sectionDirName + '/' + imgName)

            return {
                name: imgName,
                section_id: id,
                in_cover: index === 0 ? 1 : 0
                // withd: img.width(),
                // height: img.height()
            };
        });

        connection.beginTransaction();
        return Promise.all(imgInstances.map(imgInstance => {
            return insertPisInstance(imgInstance);
        }));

    })
    .then(retValues => {
        connection.commit();
        console.log(`section ${sectionDirName} wrotten`);
    });

});