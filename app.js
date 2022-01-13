'use strict';
const http = require('http');
const util = require('util');

const method = process.argv[2];
const port = process.argv[3];
const path = process.argv[4];
const payload = process.argv[5];

const postOptions = {
    port: port,
    method: 'POST',
    path: path,
    headers: {
        'Content-Type': 'application/json',
    }
};

const inspectOptions = {
    colors: true,
    compact: false,
    depth: 5,
    breakLength: 60
};


function run() {
    
    if (method.toLowerCase() === 'get') {
        
        sendGet();
        
    } else if (method.toLowerCase() === 'post' && payload !== undefined) {
        
        sendPost(postOptions, payload);
        
    } else {
        
        console.log(`
        there was a problem interpreting the command line arguments.
        make certain the following format is followed:
        node app.js method port path payload
        
        method: \'get\' or \'post\'
        port: port on which server is running
        path: path of api endpoint, must provide at least \'/\'
        payload: required for post, json, include escapes, no spaces:
        \"{\\"food\\":\\"juevos rancheros\\",\\"cost\\":9.99}\"`);
        
    }
}
    

function sendGet() {

    http.get('http://localhost:' + port + path, res => {

        const responseObj = {
            STATUS: {
                code: res.statusCode,
                message: res.statusMessage
            }
        };

        if (res.statusCode === 200) {
            
            res.setEncoding('utf-8');
            let rawData = '';
            res.on('data', chunk => {
                rawData += chunk;
            });
            
            res.on('end', () => {
                
                try {
                    
                    responseObj.HEADERS = res.headers;
                    responseObj.BODY = JSON.parse(rawData);

                } catch (err) {
                    console.log(err.message);
                }

            });
        }

        console.log(`\nRESPONSE: ${util.inspect(responseObj, inspectOptions)}`);

    }).on('error', err => {
        console.log(err.message);
    })
}


function sendPost(options, payload) {
    
    const req = http.request(options, res => {

        const responseObj = {
            STATUS: {
                code: res.statusCode,
                message: res.statusMessage
            }
        };

        if (Math.trunc(res.statusCode / 100) === 2) {
            
            try {
                
                const requestObj = { OPTIONS: options, PAYLOAD: JSON.parse(payload) };
                console.log(`\nREQUEST: ${util.inspect(requestObj, inspectOptions)}`);
                
                res.setEncoding('utf-8');
                let body = '';
                res.on('data', chunk => {
                    body += chunk;
                });
                
                res.on('end', () => {
                    
                    responseObj.HEADERS = res.headers;
                    responseObj.BODY = body;
                    
                });
                
            } catch (err) {
                console.log(err.message);
            }
        }

        console.log(`\nRESPONSE: ${util.inspect(responseObj, inspectOptions)}`);
    });

    req.on('error', err => {
        console.log(err.message);
    });

    req.write(payload);
    req.end();    
}


run();