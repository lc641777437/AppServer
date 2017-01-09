/**
 * Created by zzs on 2017/1/5.
 */

var device = exports;

var http = require('http');
var config = require('./config.json');

device.post = function (req, res, next) {
    console.log('POST '+ req.url);
    res.contentType = 'json';
    if ( !req.body )
    {
        console.log('error');
        res.send({code:100});
    }
    else
    {
        var transdata = JSON.stringify(req.body);
        console.log('app2dev:', transdata);

        var requset = http.request(config.httppost, function (response) {
            if (response.statusCode === 200) {
                var body = "";
                response.on('data', function (data) {
                    body += data;
                });
                response.on('end', function() {
                    res.send(JSON.parse(body));
                    console.log('dev2app:', body);
                });
            }
            else {
                res.send({code: 100});
            }
        });
        requset.end(transdata);
    }
    return next();
};