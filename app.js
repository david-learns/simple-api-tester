'use strict';
const http = require('http');
const util = require('util');

const method = process.argv[2];
const port = process.argv[3];
const path = process.argv[4];
const payload = process.argv[5];

const getOptions = {
    port: port,
    method: 'GET',
    path: path,
};

const deleteOptions = {
    port: port,
    method: 'DELETE',
    path: path,
};

const patchOptions = {
    port: port,
    method: 'PATCH',
    path: path,
    headers: {
        'Content-Type': 'application/json',
    },
};

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

        request(getOptions);

    } else if (method.toLowerCase() === 'delete') {

        request(deleteOptions);

    } else if (method.toLowerCase() === 'patch' && payload !== undefined) {

        request(patchOptions, payload);
        
    } else if (method.toLowerCase() === 'post' && payload !== undefined) {
        
        request(postOptions, payload);
        
    } else {
        
        console.log(userErrorMessage);
        
    }
}


function request(options, payload) {
    
    const req = http.request(options, res => {

        if (payload !== undefined) {
            const requestObj = buildRequestObj(payload, options);
            console.log(`\nREQUEST: ${util.inspect(requestObj, inspectOptions)}`);
        }

        res.setEncoding('utf-8');
        let body = '';
        res.on('data', chunk => {
            body += chunk;
        });
        
        res.on('end', () => {
            const responseObj = buildResponseObj(res, body);
            console.log(`\nRESPONSE: ${util.inspect(responseObj, inspectOptions)}`);
        });
    });

    req.on('error', err => {
        console.log(err.message);
    });

    if (payload !== undefined) req.write(payload);
    req.end();
}


function buildRequestObj(payload, options) {

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

    return requestObj;
}


function buildResponseObj(res, body) {
    
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
        const brIndex = body.indexOf('<br>');
        const endIndex = brIndex === -1 ? body.length : brIndex + 4;
        responseObj.BODY = body.slice(0, endIndex);
    }

    return responseObj;
}


run();