const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  switch (req.method) {
    case 'GET':
      const pathname = url.parse(req.url).pathname.slice(1);
      if (pathname.indexOf('/') !== -1) {
        res.statusCode = 400;
        res.end('No sub folders in path');
        return;
      }
      let filepath = path.join(__dirname, 'files', pathname);
      filepath = path.normalize(filepath);
      fs.stat(filepath, function(er, stats) {
        if (er || !stats.isFile()) {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }
        sendFile(filepath, res);
      });
      break;

    default:
      throw new Error();
  }
});

server.on('error', (req, res) => {
  res.statusCode = 501;
  res.end('Not implemented');
});

function sendFile(filepath, res) {
  fs.readFile(filepath, function(er, content) {
    if (er) {
      throw er;
    }
    res.end(content);
  });
}

module.exports = server;
