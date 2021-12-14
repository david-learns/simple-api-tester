const http = require('http');


const method = process.argv[2];
const port = process.argv[3];
const path = process.argv[4];
const payload = process.argv[5];

if (method.toLowerCase() === 'get') {

    sendGet();
    
} else if (method.toLowerCase() === 'post') {

    const options = {
        port: port,
        method: 'POST',
        path: path,
        headers: {
            'Content-Type': 'application/json',
        }
    }

    sendPost(options, payload);

} else {

    console.log('??? \"get\" or \"post\" only! don\'t let it happen again!');

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
                const jsonData = JSON.parse(rawData)
                console.log(jsonData);
            } catch (err) {
                console.error(err.message);
            }
        })
    }).on('error', err => {
        console.error(err.message);
    })
}

function sendPost(options, payload) {
    
    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf-8');
        res.on('data', chunk => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('end response');
        });
    });

    req.on('error', err => {
        console.error(err.message);
    });

    req.write(payload);
    req.end();    
}