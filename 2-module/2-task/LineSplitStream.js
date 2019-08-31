const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.objectMode = true;
  }

  _transform(chunk, encoding, callback) {
    /* const newChunks = chunk.toString().split(os.EOL);
    for (const newChunk of newChunks) {
      this.push(newChunk);
    }
    callback(); */
    let data = chunk.toString();
    if (this._lastLineData) data = this._lastLineData + data;

    const lines = data.split(os.EOL);
    this._lastLineData = lines.splice(lines.length-1, 1)[0];

    lines.forEach(this.push.bind(this));
    callback();
  }

  _flush(callback) {
    this.push(os.EOL);
    if (this._lastLineData) this.push(this._lastLineData);
    this._lastLineData = null;
    callback();
  }
}

module.exports = LineSplitStream;
