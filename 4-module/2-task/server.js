const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const server = new http.Server();

server.on('request', (req, res) => {
  const limitedStream = new LimitSizeStream({limit: 1048576}); // 1048576 байт (1Мб)
  let needClean = true;
  switch (req.method) {
    case 'POST':
      const pathname = url.parse(req.url).pathname.slice(1);
      if (pathname.indexOf('/') !== -1) {
        res.statusCode = 400;
        res.end('No sub folders in path');
      }

      let body = '';
      req.on('data', function(data) {
        body += data;
      });
      req.on('end', () => {
        needClean = false;
        setTimeout(function() {
          limitedStream.write(body, null, function() {
            res.statusCode = 201;
            res.end();
          });
        }, 1);
      });
      req.on('close', function(data) {
        if (needClean) {
          setTimeout(function() {
            fs.unlink(filepath, (err) => {
              if (err) res.end();
            });
          }, 1);
        }
      });
      let filepath = path.join(__dirname, 'files', pathname);
      filepath = path.normalize(filepath);
      const outStream = fs.createWriteStream(filepath, {flags: 'wx', mode: 0o777});
      limitedStream.pipe(outStream);
      outStream.on('error', function(err) {
        if (err.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('Duplicate filename ' + pathname);
        }
      });
      limitedStream.on('error', function(err) {
        if (err instanceof LimitExceededError) {
          fs.unlink(filepath, (err) => {
            if (err) throw err;
          });
          res.statusCode = 413;
          res.end('Limit file 1Mb!');
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

module.exports = server;
