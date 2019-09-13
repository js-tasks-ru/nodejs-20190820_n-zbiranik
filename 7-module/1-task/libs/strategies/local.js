const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy({
  session: false,
  usernameField: 'email',
  passwordField: 'password',
},
async (login, password, done) => {
  const user = await User.findOne({email: login});
  if (user === null) {
    done(null, false, 'Нет такого пользователя');
  } else {
    const checkPassword = await user.checkPassword(password);
    if (checkPassword === false) {
      done(null, false, 'Невереный пароль');
    } else {
      done(null, user);
    }
  }
});
