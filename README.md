# simple-api-tester

a simple single-shot cli app to send posts and gets to a local API. responses are printed to console. this is the first somewhat permanent project posted under this account for learning purposes. the learning purposes include things like GitHub workflows, security, how to write a decent readme, etc. this isn't intended to be something anyone would find very useful other than a simple way to test a locally running API. further improvements on functionality may take place in the future if required.

## requirements

node.js

## how to use

type `node app.js [method] [port] [path] [payload]` into your terminal window.
- method: supports 'get' and 'post' only at the moment
- port: any valid port
- path: path to follow after protocol-hostname-port component of URL. should include query strings or anything else needed to deliver request correctly. **path should be at least or begin with a single forward slash**
- payload: required for posts. supports only json. to save you the trouble of trying to figure out how to pass json through the command line here's an example (tested in windows environment): "{ \\"name\\": \\"david-learns\\", \\"count\\": 1 }"

'get' method expects to receive json