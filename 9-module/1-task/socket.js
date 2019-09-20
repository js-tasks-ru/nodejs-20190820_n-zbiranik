const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    next();
  });

  io.on('connection', async function(socket) {
    try {
      const token = socket.handshake.query.token ? socket.handshake.query.token : null;
      if (token === null) {
        throw new Error('anonymous sessions are not allowed');
      }
      const session = await Session.findOne({token: socket.handshake.query.token}).populate('user');
      if (session === null) {
        throw new Error('wrong or expired session token');
      }
      if (session.user) {
        socket.user = session.user;
      }
    } catch (e) {
      io.emit('error', e.message);
    }

    socket.on('message', async (msg) => {
      const mess = new Message({
        user: socket.user.displayName,
        chat: socket.user._id,
        text: msg,
        date: new Date(),
      });
      await mess.save();
    });
  });

  return io;
}

module.exports = socket;
