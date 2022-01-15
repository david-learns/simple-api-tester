'use strict';
const http = require('http');
const util = require('util');

const method = process.argv[2];
const port = process.argv[3];
const path = process.argv[4];
const payload = process.argv[5];

const deleteOptions = {
    port: port,
    method: 'DELETE',
    path: path,
}

const patchOptions = {
    port: port,
    method: 'PATCH',
    path: path,
    headers: {
        'Content-Type': 'application/json',
    },
}

const postOptions = {
    port: port,
    method: 'POST',
    path: path,
    headers: {
        'Content-Type': 'application/json',
    },
};

const inspectOptions = {
    colors: true,
    compact: false,
    depth: 5,
    breakLength: 60,
};

const userErrorMessage = `
 there was a problem interpreting the command line arguments.
 make certain the following format is followed:

     node app.js method port path payload

 method: \'get\' or \'post\' or \'patch\' or \'delete\'
 port: port on which server is listening
 path: path of api endpoint, must provide at least \'/\'
 payload: required for post and patch, json, include escapes,
 no spaces outside of name/value pairs:
 \"{\\"food\\":\\"juevos rancheros\\",\\"cost\\":9.99}\"`


function run() {
    
    if (method.toLowerCase() === 'get') {
        
        sendGet();

    } else if (method.toLowerCase() === 'delete') {

        sendDelete(deleteOptions);

    } else if (method.toLowerCase() === 'patch' && payload !== undefined) {

        sendPayload(patchOptions, payload);
        
    } else if (method.toLowerCase() === 'post' && payload !== undefined) {
        
        sendPayload(postOptions, payload);
        
    } else {
        
        console.log(userErrorMessage);
        
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

            const responseObj = {
                STATUS: {
                    code: res.statusCode,
                    message: res.statusMessage
                },
                HEADERS: res.headers
            };

            try {
                responseObj.BODY = JSON.parse(rawData);
            } catch (err) {
                console.log('unable to parse response body data as json\n', err.message);
                responseObj.BODY = rawData;
            }

            console.log(`\nRESPONSE: ${util.inspect(responseObj, inspectOptions)}`);
        });

    }).on('error', err => {
        console.log(err.message);
    })
}


function sendDelete(options) {
    
    const req = http.request(options, res => {

        res.setEncoding('utf-8');
        let body = '';
        res.on('data', chunk => {
            body += chunk;
        });
        
        res.on('end', () => {

            const responseObj = {
                STATUS: {
                    code: res.statusCode,
                    message: res.statusMessage
                },
                HEADERS: res.headers
            };
            
            try {
                responseObj.BODY = JSON.parse(body);
            } catch (err) {
                console.log('\nerror: unable to parse response body data as json\n', err.message);
                responseObj.BODY = body.slice(0, body.indexOf('<br>') + 4);
            }
            
            console.log(`\nRESPONSE: ${util.inspect(responseObj, inspectOptions)}`);
        });
    });

    req.on('error', err => {
        console.log(err.message);
    });

    req.end();
}


function sendPayload(options, payload) {
    
    const req = http.request(options, res => {

        const requestObj = { OPTIONS: options, PAYLOAD: payload };
        
        try {
            requestObj.PAYLOAD = JSON.parse(payload);
        } catch (err) {
            console.log(
                '\nunable to parse cmd arg payload as json, error:\n ' + err.message + 
                '\n\npayload: required for post and patch, json, include escapes,' +
                '\nno spaces outside of name/value pairs:' +
                '\n\"{\\"food\\":\\"juevos rancheros\\",\\"cost\\":9.99}\"');
        }

        console.log(`\nREQUEST: ${util.inspect(requestObj, inspectOptions)}`);

        res.setEncoding('utf-8');
        let body = '';
        res.on('data', chunk => {
            body += chunk;
        });
        
        res.on('end', () => {

            const responseObj = {
                STATUS: {
                    code: res.statusCode,
                    message: res.statusMessage
                },
                HEADERS: res.headers
            };
            
            try {
                responseObj.BODY = JSON.parse(body);
            } catch (err) {
                console.log('\nerror: unable to parse response body data as json\n', err.message);
                responseObj.BODY = body.slice(0, body.indexOf('<br>') + 4);
            }
            
            console.log(`\nRESPONSE: ${util.inspect(responseObj, inspectOptions)}`);
        });
    });

    req.on('error', err => {
        console.log(err.message);
    });

    req.write(payload);
    req.end();
}


run();