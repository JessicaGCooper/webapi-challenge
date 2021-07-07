const express = require('express');
const helmet = require('helmet');

//routers
const projectsRouter = require('./api/projects/projectsRouter.js');


const server = express();

//server.use
server.use(express.json());
server.use(helmet());
server.use(logger);

//endpoints
server.use('/api/projects', projectsRouter);

//sanity test
server.get('/', (req, res) => {
  res.send(`<h2>Let's Finish this Sprint Challenge!</h2>`);
});

//custom middleware
function logger(req, res, next) {
  req.requestTime = Date();
  console.log(`${req.method} to ${req.originalUrl} at ${req.requestTime}`);
  next();
}


module.exports = server;