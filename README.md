<div align="center">
  <img alt="DTD-Banner" src="https://cdn.discordapp.com/attachments/1224721230825783386/1299428604492644517/dtd.png?ex=671d2ab1&is=671bd931&hm=74ae672d57cfae0706b0768f46da351083e5c4a97e9cd025532ecbbc93d688d5&" />
</div>

<p align="center">Easily detect and block developer tools on any web server.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/dev-tools-detector">
    <img alt="version" src="https://img.shields.io/npm/v/dev-tools-detector" />
  </a>

  <a href="https://www.npmjs.com/package/dev-tools-detector">
    <img alt="downloads" src="https://img.shields.io/npm/dt/dev-tools-detector" />
  </a>
</p>

<h1>Getting Started</h1>
<h2>Installation</h2>

<h4>Using NPM:</h4>


```
npm install dev-tools-detector
```


<h4>Using YARN:</h4>


```
yarn add dev-tools-detector
```

<h2>Usage</h2>

<h4>Detecting options</h4>

- `consoleLog:` true or false

- `checkDuration:` "Always" or Number in miliseconds

- `blockIfDetected:` true or false

- `allowedPaths:` list of paths


<h4>Legends</h4>

- `consoleLog` - This option will log detection if enabled.

- `checkDuration` - Set if you want to check for devtools always or only if first X ms time of user access on website.

- `blockIfDetected` - Do you want to block (about:blank) user that will open devtools?

- `allowedPaths` - What paths you want to have dev-tools-detection enabled on?

<h4>Import and usage example</h4>    

<p>You can use DTD (dev-tools-detector) on any web server. For example this is usage of DTD in express web server.</p>

```js
const express = require('express');
const { DevToolsDetector } = require('dev-tools-detector'); 

const app = express();
const port = 3000;

const allowedPaths = ['/protected'];

const detector = new DevToolsDetector(allowedPaths, {
    consoleLog: true,
    checkDuration: "always",
    blockIfDetected: false, 
});

app.post('/log-devtools-detected', (req, res) => {
    console.log("Developer tools detected on the client!");
    res.sendStatus(200);
});

app.get('/protected', (req, res) => {
    if (detector.isPathAllowed(req.path)) {
        const detectionScript = detector.getDetectionScript();

        res.send(`
            <html>
                <head>
                    <title>Protected Route</title>
                    ${detectionScript} <!-- Injects the DevTools detection script -->
                </head>
                <body>
                    <h1>This is a protected route!</h1>
                    <p>Your protected content goes here...</p>
                </body>
            </html>
        `);
    } else {
        res.status(403).send("Access Denied");
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
```

<h4>Output example</h4>

```
Server is running at http://localhost:3000
Developer tools detected on the client!
```
<h2>Do you have any issues?</h2>

<p>

  > If you have any issues don't hesitate to report it via  <a href="https://github.com/lazyfenix/dev-tool-detector/issues">GitHub Issues</a>.

</p>

<p>

> This package was made by @lazyfenix.</p>