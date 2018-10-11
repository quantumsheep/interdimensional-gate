const { Challenge } = require('../models/index')

/**
 * @param {import('../GateOS')} os 
 * @param {string[]} args
 */
exports.call = async (os, [directory]) => {
  if (!directory || directory === '/') {
    return os.row(['challenges', 'stats']).end();
  }

  if (directory.startsWith('./')) {
    directory = directory.slice(2);
  }

  if (directory === 'challenges') {
    try {
      const challenges = await Challenge.entity.find();

      if (!challenges || challenges.length <= 0) {
        return os.row('No challenges available').end();
      }

      os.row('Available challenges:');

      for (challenge of challenges) {
        os.row(challenge.name);
      }

      os.end();
    } catch (e) {
      os.row('An issue occured while fetching the challenges :(');
      os.end();
    }
  } else if (directory === 'stats') {
    os.row('stats').end();
  } else {
    os.row(`ls: cannot access '${directory}': No such file or directory`).end();
  }
}