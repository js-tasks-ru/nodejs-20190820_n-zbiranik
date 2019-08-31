const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit ? options.limit : 0;
    this.size = 0;
  }

  _transform(chunk, encoding, callback) {
    this.size += chunk.length;
    if (this.size > this.limit) {
      this.emit('error', new LimitExceededError());
    }
    this.push(chunk);
    callback();
  }
}

module.exports = LimitSizeStream;
