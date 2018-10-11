const bcrypt = require('bcrypt');

const helpers = require('../helpers');
const { User } = require('../models');

/**
 * @param {import('../GateOS')} os 
 * @param {string[]} args
 */
exports.call = async (os, [username]) => {
  if (os.session.connected) {
    return os.row('You already have an account.').end();
  }

  if (username) {
    if (!helpers.isValidUsername(username)) {
      os.row('adduser: To avoid problems, the username should consist only of');
      os.row('letters, digits, underscores, periods, at signs and dashes, and not start with');
      os.row('a dash (as defined by IEEE Std 1003.1-2001).');
      return os.end();
    }

    try {
      const user = await User.entity.findOne({
        username: {
          $regex: new RegExp(`^${username}$`, "i")
        }
      });

      if (user) {
        return os.row(`adduser: The user \`${username}' already exists.`).end();
      }
    } catch (e) {
      console.error(e);
    }


    os.setState({ username });

    os.row(`Adding user \`${username}' ...`);
    os.input(`Enter your email address:`);
  } else {
    os.row('Your need to provide an username.').end();
  }
}

/**
 * @param {import('../GateOS')} os 
 * @param {string} value 
 */
exports.state = async (os, value) => {
  try {
    /*
    | Check email's validity
    */
    if (!os.state.data.email) {
      if (!helpers.isEmail(value)) {
        return os.row('Invalid email.').input('Enter your email address:');
      }

      os.setState({ email: value });
      os.input(`Enter new GATE password:`, 'password');

      return;
    }

    /*
    | In case of bad password retyping, the user have the choice to retry or quit the adduser command
    */
    if (os.state.data.passwdRetry) {
      if (value === 'y' || value === 'Y') {
        os.setState({ passwdRetry: false });
        return os.input(`Enter new GATE password:`, 'password');
      }

      os.end();

      return;
    }

    /*
    | Storing the first password (as a bcrypted hash)
    */
    if (!os.state.data.password1) {
      if (value.length < 8) {
        os.row('The password must be 8 characters long minimum.');

        os.setState({ passwdRetry: true });
        os.input('Try again? [y/N]');

        return;
      }

      os.setState({ password1: await bcrypt.hash(value, 10) });
      os.input('Retype new GATE password:', 'password');

      return;
    }

    /*
    | Check password2's validity
    */
    const valid = await bcrypt.compare(value, os.state.data.password1);

    if (!valid) {
      os.row('Sorry, passwords do not match');
      os.row('passwd: Authentication token manipulation error');
      os.row('passwd: password unchanged');

      os.setState({ passwdRetry: true, password1: undefined })
      os.input('Try again? [y/N]');

      return;
    }

    const mongoose = require('mongoose');

    await new User.entity({
      username: os.state.data.username,
      email: os.state.data.email,
      password: os.state.data.password1,
      challenges: [
        {
          challengeid: new mongoose.Types.ObjectId(),
          completed: true,
        },
        {
          challengeid: new mongoose.Types.ObjectId(),
          completed: false,
        },
        {
          challengeid: new mongoose.Types.ObjectId(),
          completed: true,
        }
      ]
    }).save();

    os.row(`User \`${os.state.data.username}' created!`).end();
  } catch (e) {
    console.error(e);
  }
}