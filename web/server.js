const express = require('express');
const http = require("http");
const app = express();
const port = 9000;
const host = process.env.LOAD_BALANCER || "proxy";
const sleepingTime = 10000000000;

const logger = function (req, res, next) {
  console.log(req.url, req.method);
  next();
};

const sleep = (time, interval) => {
  clearInterval(interval);
  while (time)
    time--;
};

const options = {
  path: '/service-health',
  host: host,
  port: 9000, //parametrize it.
  method: 'POST'
};


const postHealth = () => setInterval(() => {
  let req = http.request(options, (response) => {
    if (response.statusCode == 200) {
      console.log("Health post successful.");
    }
  });
  req.write("health");
  req.end();
}, 2000);

let startpush = postHealth();


app.use(logger);
app.get('/sleep', (req, res) => {
  sleep(sleepingTime, startpush);
  startpush = postHealth;
  res.send("I will be busy sleeping for some time.");
});
app.get('/', (req, res) => res.send('Hello World!'));
app.post('/', (req, res) => res.send('Hello World!,post'));

app.listen(port, () => console.log(`Magic happens here ${port}!`));