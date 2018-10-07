const helpers = require('../helpers');
const { User } = require('../models');

/**
 * @param {import('../GateOS')} os 
 * @param {string[]} args
 */
exports.call = async (os, [path]) => {
  if (!os.session.connected) {
    return os.row('You need to be connected.').end();
  }

  if (!path) {
    return os.row(os.position).end();
  }

  const directories = path.split('/')

  if (directories.filter(dir => dir).length === 0) {
    os.position = '/';
    os.end();
  }

  try {
    /**
    | Check if the directory exists
    */
    const files = await User.entity.aggregate([
      {
        $match: {
          _id: os.session.user._id,
        }
      },
      {
        $group: {
          children: "$children",
        }
      }
    ]);

    console.log(files);
  } catch (e) {
    console.log(e);
    os.end();
  }
}
