const express = require('express');
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

const server = express();

// middleware
server.use(express.json());
server.use(logger);

// routers
server.use('/api/user', userRouter);
server.use('/api/post', postRouter);

// default route handler
server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware functions
function logger(req, res, next) {

  const timeStamp = new Date();

  console.log(`Method: ${req.method}, URL: ${req.url}, Timestamp: ${timeStamp}`);

  next();
}

module.exports = server;
