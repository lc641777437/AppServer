/**
 * Created by zzs on 2017/1/3.
 */
var mysql = require('mysql');
var fs = require('fs');
var config = require('./config.json');

var package = exports;

package.get = function (req, res, next) {
    console.log("GET ", req.url);
    res.contentType = 'json';

    var type = req.query.type;
    var selectsql;
    if (( 'ios' === type)||('1' === type)) {
        selectsql = 'SELECT * from AppPackage where type = 1 order by id desc limit 1';
    }
    else if (( 'android' === type)||('0' === type) || undefined === type) {
        selectsql = 'SELECT * from AppPackage where type = 0 order by id desc limit 1';
    }

    var connnection = mysql.createConnection(config.mysql);
    connnection.connect();
    connnection.query(selectsql, function (error , result) {
        connnection.end();
        if (error)
        {
            console.log('[SELECT ERROR - ', error.message);
            res.send({code:101});
        }
        else if (res.length === 0)
        {
            console.log('no data in database');
            res.send({code: 101});
        }
        else {
            var path = './app/' + result[0].fileName;
            var stats = fs.statSync(path);
            if (!stats.isFile())
            {
                console.log("file " +path + "not found");
                res.send({code: 101});
            }
            else {
                res.set({
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': 'attachment; filename=package',
                    'Content-Length': stats.size
                });
                fs.createReadStream(path).pipe(res);
                console.log("db proc package OK");
            }
        }
    });
    return next();
}