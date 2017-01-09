/**
 * Created by zzs on 2017/1/3.
 */
var fs = require('fs');
var mysql = require('mysql');
var config = require('./config.json');

var version = exports;

version.get = function(req , res, next) {
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
    console.log(selectsql);

    var connnection = mysql.createConnection(config.mysql);
    connnection.connect();
    connnection.query(selectsql, function (error, result) {
        connnection.end();
        if (error) {
            console.log('[SELECT ERROR - ', error.message);
            res.send({code: 101});
        }
        else if (result.length === 0) {
            console.log('no data in database');
            res.send({code: 101});
        }
        else {
            var app_path = './app/' + result[0].fileName;
            var size = fs.statSync(app_path).size;

            console.log('db proc AppPackge info OK');

            res.send({
                versionName: result[0].versionName,
                versionCode: result[0].versionCode,
                changeLog: result[0].changeLog,
                packageSize: size
            });
        }
    });
    return next();
}
