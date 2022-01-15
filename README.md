# simple-api-tester

a simple single-shot cli app for testing a local API.

## requirements

node.js

## how to use

type `node app.js method port path payload` into your terminal window.
- method: currently supports 'get', 'post' 'patch' and 'delete'
- port: any valid port
- path: path to follow after protocol-hostname-port component of URL. should include query strings or anything else needed to deliver request correctly. **path should be at least or begin with a single forward slash**
- payload: required for post and patch. supports only json. do not use spaces outside of name/value pairs, example (for windows cmd): "{\\"food\\":\\"juevos rancheros\\",\\"cost\\":9.99}"

## notes
- all http methods expect to receive json
- all requests are sent to localhost (127.0.0.1)
