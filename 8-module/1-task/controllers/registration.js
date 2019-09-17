const uuid = require('uuid/v4');
const User = require('../models/User');
const Session = require('../models/Session');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const email = ctx.request.body.email ? ctx.request.body.email : null;
  const displayName = ctx.request.body.displayName ? ctx.request.body.displayName : null;
  const password = ctx.request.body.password ? ctx.request.body.password : null;

  const user = new User({
    email: email,
    displayName: displayName,
    verificationToken: uuid(),
  });
  await user.setPassword(password);
  await user.save().then(() => {
    sendMail({
      template: 'confirmation',
      locals: {token: 'token'},
      to: email,
      subject: 'Подтвердите почту',
    });
    ctx.status = 200;
    ctx.body = {status: 'ok'};
  }).catch((err) => {
    const errorsMsg = {};
    if (err.errors.email) {
      errorsMsg.email = err.errors.email.message;
    }
    if (err.errors.displayName) {
      errorsMsg.displayName = err.errors.displayName.message;
    }
    ctx.status = 400;
    ctx.body = {errors: errorsMsg};
  });
};

module.exports.confirm = async (ctx, next) => {
  const verificationToken = ctx.request.body.verificationToken ? ctx.request.body.verificationToken : null;
  const user = await User.findOneAndUpdate({verificationToken: verificationToken}, {$unset: {verificationToken: 1}}, {
    new: true,
  });
  if (user) {
    const token = uuid();
    await Session.create({token: token, user: user, lastVisit: new Date()});
    ctx.body = {token: token};
    ctx.status = 200;
  } else {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
  }
};
