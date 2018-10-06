const helpers = require('../helpers');
const { User } = require('../models');

/**
 * @param {import('../GateOS')} os 
 * @param {string[]} args
 */
exports.call = (os, [email]) => {
  if (os.session.connected) {
    return os.row('You are already connected.').end();
  }

  if (email) {
    if (!helpers.isEmail(email)) {
      return os.row('Invalid email.').end();
    }

    os.setState({ email });
    os.input(`${email}'s password:`, 'password');
  } else {
    os.setState();
    os.input('Your email:');
  }
}

/**
 * @param {import('../GateOS')} os 
 * @param {string} value 
 */
exports.state = async (os, value) => {
  /*
  | Check email's validity
  */
  if (!os.state.data.email) {
    if (!helpers.isEmail(value)) {
      return os.row('Invalid email.').input('Your email:');
    }

    os.setState({ email: value });
    os.input(`${value}'s password:`, 'password');

    return;
  }

  const passwordIncorrect = () => {
    os.row('Password incorrect.');
    os.input(`${os.state.data.email}'s password:`, 'password');
  }

  /*
  | Check password validity
  */
  if (!value) {
    return passwordIncorrect();
  }

  /*
  | Check credentials and connect the user
  */
  try {
    const valid = await User.checkCredentials(os.state.data.email, value);

    if (!valid) {
      return passwordIncorrect();
    }

    const user = await User.entity.findOne({ email: os.state.data.email }, ['_id', 'username', 'email']);

    os.session.connected = true;
    os.session.user = user;
    os.session.save();

    os.setPrefix(`${user.username.toLowerCase()}@gate>`)

    os.end();
  } catch (e) {
    console.log(e)
    passwordIncorrect();
  }
}