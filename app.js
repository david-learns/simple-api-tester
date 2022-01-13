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

const utilOptions = {
    colors: true,
    compact: false,
    depth: 5,
    breakLength: 60
};


function run() {
    
    if (method.toLowerCase() === 'get') {
        
        sendGet();
        
    } else if (method.toLowerCase() === 'post') {
        
        sendPost(postOptions, payload);
        
    } else {
        
        console.log(`
        there was a problem interpreting the command line arguments.
        make certain the following format is followed:
        node app.js method port path payload
        
        method: \'get\' or \'post\'
        port: port on which server is running
        path: path of api endpoint, must provide at least \'/\'
        payload: post, json, pass in string with escapes, no spaces:
        \"{\\"food\\":\\"juevos rancheros\\",\\"cost\\":9.99}\"`);
        
    }
}
    

function sendGet() {

    http.get('http://localhost:' + port + path, res => {

        res.setEncoding('utf-8');
        let rawData = '';
        res.on('data', chunk => {
            rawData += chunk;
        });

        res.on('end', () => {

            try {

                const responseObj = {
                    STATUS: {
                        code: res.statusCode,
                        message: res.statusMessage
                    },
                    HEADERS: res.headers,
                    BODY: JSON.parse(rawData)
                };

                console.log(`\nRESPONSE: ${util.inspect(responseObj, utilOptions)}`);

            } catch (err) {
                console.log(err.message);
            }
        });

    }).on('error', err => {
        console.log(err.message);
    })
}


function sendPost(options, payload) {
    
    const req = http.request(options, res => {

        try {

            const requestObj = { OPTIONS: options, PAYLOAD: JSON.parse(payload) };
        
            console.log(`\nREQUEST: ${util.inspect(requestObj, utilOptions)}`);

            res.setEncoding('utf-8');
            let body = '';
            res.on('data', chunk => {
                body += chunk;
            });

            const responseObj = {
                STATUS: {
                    code: res.statusCode,
                    message: res.statusMessage
                },
                HEADERS: res.headers,
                BODY: body
            };

            res.on('end', () => {
                console.log(`\nRESPONSE: ${util.inspect(responseObj, utilOptions)}`);
            });

        } catch (err) {
            console.log(err.message);
        }
    });

    req.on('error', err => {
        console.log(err.message);
    });

    req.write(payload);
    req.end();    
}


run();