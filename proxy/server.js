const express = require('express');
const http = require('http');
const app = express();
const port = process.env.PORT;

const webServices = process.env.SERVICES.split(' ');
let hosts = webServices;

const cycle = (list) => {
  let cycledList = list.slice();
  cycledList.push(cycledList.shift());
  return cycledList;
};

const options = (req) => {
  let data = "";
  let reqBody = req.on('data', (chunk) => data += chunk);
  return {
    path: `http://${hosts[0]}:${port}${req.url}`,
    host: hosts[0],
    port: port,
    method: req.method,
    body: reqBody
  };
}

app.get('/', (req, res) => {
  const requestWeb = http.request(options(req), (webResponse) => {
    webResponse.setEncoding('utf8');
    let data = '';
    webResponse.on('data', (chunk) => data += chunk);
    webResponse.on('end', () => res.send('Hello World!'));
  });
  hosts = cycle(hosts);
  requestWeb.write(options.body);
  requestWeb.end();
});

app.listen(port, () => console.log(`Welcome to proxiness ${port}!`));
