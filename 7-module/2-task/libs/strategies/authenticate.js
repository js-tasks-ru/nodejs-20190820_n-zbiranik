const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (typeof email === 'undefined') {
    done(null, false, `Не указан email`);
    return;
  }
  if (email === null) {
    done(null, false, `Не указан emaill`);
    return;
  }
  const user = await User.findOne({email});
  if (user === null) {
    // создать пользователя
    const newUserData = {
      email: email,
      displayName: displayName,
    };
    const newUser = new User(newUserData);
    newUser.save((err, user) => {
      if (err) {
        done(err, false);
      } else {
        done(null, newUser);
      }
    });
  } else {
    done(null, user);
  }
};
