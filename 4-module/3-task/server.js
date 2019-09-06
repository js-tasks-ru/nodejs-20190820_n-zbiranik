const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  switch (req.method) {
    case 'DELETE':
      const pathname = url.parse(req.url).pathname.slice(1);
      if (pathname.indexOf('/') !== -1) {
        res.statusCode = 400;
        res.end('No sub folders in path');
      }
      let filepath = path.join(__dirname, 'files', pathname);
      filepath = path.normalize(filepath);
      fs.stat(filepath, function(er, stats) {
        if (er || !stats.isFile()) {
          res.statusCode = 404;
          res.end('Not found');
        } else {
          deleteFile(filepath, res);
        }
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

function deleteFile(filepath, res) {
  fs.unlink(filepath, (err) => {
    if (err) throw new Error();
    res.statusCode = 200;
    res.end('File deleted');
  });
}

module.exports = server;

