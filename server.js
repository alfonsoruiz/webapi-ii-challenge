const express = require('express');
const server = express();
server.use(express.json());

const postsRouter = require('./postsRouter.js');

server.get('/', (req, res) => {
  res.send('Hello from Heroku');
});

server.use('/api/posts', postsRouter);

module.exports = server;
