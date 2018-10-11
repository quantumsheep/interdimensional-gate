const mongoose = require('mongoose');
const { Challenge, User } = require('../models')

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
    if (!file) {
        return os.row('cat: No file provided').end();
    }

    if (file.startsWith('./')) {
        file = file.slice(2);
    }

    try {
        if (file === "stats") {
            /**
            | Get user account informations + number of completed challenges
            */
            const [user, [{ challenges_done = 0 } = {}]] = await Promise.all([
                User.entity.findOne({ _id: os.session.user._id }, ['username', 'email']),

                User.entity.aggregate([
                    {
                        $match: {
                            _id: mongoose.Types.ObjectId(os.session.user._id)
                        }
                    },
                    { $project: { challenges: 1 } },
                    { $unwind: "$challenges" },
                    {
                        $match: {
                            "challenges.completed": true,
                        }
                    },
                    { $count: "challenges_done" }
                ])
            ]);

            os.row(`Username: ${user.username}`);
            os.row(`Email: ${user.email}`);
            os.row(`Completed challenges: ${challenges_done}`);
            os.end();
        } else if (file.startsWith('challenges')) {
            const [, name] = file.split('/');

            if (!name) {
                return os.row(`cat: ${file}: Is a directory`).end();
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