const fs = require('fs');
const mysql = require('mysql');
const images = require('images');

const connection = mysql.createConnection({
    host:'127.0.0.1',
    user:'knightingal',
    password:'******',
    database:'flow1000db'
});


connection.connect();


function queryRepertorys(time_stamp) {
    return new Promise((res, rej) => {
        connection.query('select * from flow1000section where create_time > ' + time_stamp, (err, rows, fields) => {
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

function updateSize(picId, width, height) {
    return new Promise((res, rej) => {
        connection.query('update flow1000img set width=?, height=? where id=?', [width, height, picId], (error, results, fields) => {
            if (error) throw error;
            res(results.insertId);
        });
    });
}
(async () => {
    const repertorys = await queryRepertorys("19700101000000");
    const reps = repertorys.map(reper=> {
        return {
            index:reper.id,
            name:reper.dir_name, 
            mtime:reper.create_time, 
        };
    });

    for (let i = 0; i< reps.length; i++) {
        const pics = await queryPicsByReperId(reps[i].index);
        // pics.forEach(pic => {
        //     const path = `/home/knightingal/download/linux1000/source/${reps[i].name}/${pic.name}`;
        //     const img = images(path);
        //     // console.log(img.width());
        //     // console.log(img.height());
        //     console.log(`${path}: width:${img.width()}, height:${img.height()}`);
        // });

        connection.beginTransaction();
        Promise.all(pics.map(pic => {
            const path = `/home/knightingal/download/linux1000/source/${reps[i].name}/${pic.name}`;
            const img = images(path);
            console.log(`${path}: width:${img.width()}, height:${img.height()}`);
            return updateSize(pic.id, img.width(), img.height());
        }));
        connection.commit();
    }

    
})();