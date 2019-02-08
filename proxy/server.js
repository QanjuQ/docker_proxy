const express = require('express');
const http = require('http');
const app = express();
const port = process.env.PORT;
const now = () => new Date().getTime();
const logger = function (req, res, next) {
  console.log(req.url, req.method);
  next();
};

class Service {
  constructor (ip) {
    this.ip = ip;
    this._time = new Date().getTime();
  }

  isAlive(limit) {
    return now() - this._time < limit;
  }
}

class Services {
  constructor (services = []) {
    console.log(services);
    this.services = services;
  }

  addService(service) {
    this.services.push(service);
  }

  aliveServices(limit) {
    const services = this.services.filter((service) => service.isAlive(limit));
    return new Services(services);
  }
}

let services = new Services();

const options = (req) => {
  services = services.aliveServices(2000).services;
  let host = services[0].ip;
  let data = "";
  let reqBody = req.on('data', (chunk) => data += chunk);
  return {
    path: req.url,
    host: host,
    port: port,
    method: req.method,
    body: reqBody
  };
};

app.use(logger);

app.post('/service-health', (req, res) => {
  const service = new Service(req.connection.remoteAddress);
  services.addService(service);
  res.end("OK");
});

app.use((req, res) => {
  let reqConfig = options(req);
  if (reqConfig.host == undefined) {
    res.end("Server not present");
  }
  const requestWeb = http.request(reqConfig, (webResponse) => {
    webResponse.setEncoding('utf8');
    let data = '';
    webResponse.on('data', (chunk) => data += chunk);
    webResponse.on('end', () => res.send('Hello World!'));
  });
  requestWeb.write(reqConfig.body.toString());
  requestWeb.end();
});

app.listen(port, () => console.log(`Welcome to proxiness ${port}!`));
