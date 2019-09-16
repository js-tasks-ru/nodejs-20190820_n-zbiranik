const Session = require('../models/Session');
module.exports = async function mustBeAuthenticated(ctx, next) {
  const authorization = ctx.headers.authorization ? ctx.headers.authorization: null;
  if (authorization === null) {
    ctx.status = 401;
    ctx.body = {error: 'Пользователь не залогинен'};
    return;
  }
  const authorizationArray = authorization.split(' ');
  const token = authorizationArray[1] ? authorizationArray[1] : null;
  const session = await Session.findOneAndUpdate({token: token}, {lastVisit: new Date()}).populate('user');
  if (session === null) {
    ctx.status = 401;
    ctx.body = {error: 'Неверный аутентификационный токен'};
    return;
  }
  ctx.user = {
    email: session.user.email,
    displayName: session.user.displayName,
  };
  return next();
};
