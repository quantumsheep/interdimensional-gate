const { Challenge, User } = require('../models/index')

/**
 * @param {import('../GateOS')} os 
 * @param {string} file 
 */
const noSuchFileOrDirectory = (os, file) => {
    os.row(`cat: ${file}: No such file or directory`).end();
}

/**
 * @param {import('../GateOS')} os 
 * @param {string[]} args
 */
exports.call = async (os, [file]) => {
    if (file.startsWith('./')) {
        file = file.slice(2);
    }

    if (!file) {
        return os.row('cat: No file provided').end();
    }

    try {
        if (file === "stats") {
            const user = await User.entity.findOne({ _id: os.session.user._id }, ['username', 'email']);

            const challenges = await User.entity.aggregate([
                {
                    $match: {
                        _id: os.session.user._id
                    }
                },
                { $project: { challenges: 1 } }
            ]);

            console.log(challenges);

            os.row(`Username: ${user.username}`);
            os.row(`Email: ${user.email}`);
            os.row(`Completed challenges: ${user.challenges}`);
            os.end();
        } else if (file.startsWith('challenges')) {
            const [, name] = file.split('/');

            if (!name) {
                return os.row(`cat: ${file}: Is a directory`);
            }
            const challenge = Challenge.entity.findOne({ name });

            if (!challenge) {
                return noSuchFileOrDirectory(os, file);
            }

            os.row(`Name: ${challenge.name}`);
            os.row(`Type: ${challenge.type}`);
            os.end();
        } else {
            return noSuchFileOrDirectory(os, file);
        }
    } catch (e) {
        console.log(e);
        os.end();
    }
}