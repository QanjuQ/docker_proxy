const express = require('express')
const app = express()
const port = 9000;

app.get('/', (req, res) => { console.log(req.url, req.method, " hello"); res.send('Hello World!'); });

app.listen(port, () => console.log(`Magic happens here ${port}!`));