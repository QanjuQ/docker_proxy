const express = require('express');
const http = require('http');
const app = express();
const port = 9000;

const webServices = ["web1", "web2", "web3"];

const options = {
  port: 9000,
  method: 'GET',
};

const cycle = (list) => {
  let cycledList = list.slice();
  cycledList.push(cycledList.shift());
  return cycledList;
};

let hosts = webServices;

app.get('/', (req, res) => {
  options.host = hosts[0];
  options.path = `http://${hosts[0]}:${options.port}/`;
  console.log(options.path);
  const requestWeb = http.request(options, (webResponse) => {
    webResponse.setEncoding('utf8');
    let data = '';
    webResponse.on('data', (chunk) => data += chunk);
    webResponse.on('end', () => res.send('Hello World!'));
  });
  hosts = cycle(hosts);
  requestWeb.end();
});

app.listen(port, () => console.log(`Welcome to proxiness ${port}!`));

