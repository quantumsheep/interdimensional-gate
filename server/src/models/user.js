const db = require('../db');

const Challenge = new db.Schema({
  challengeid: { type: db.Schema.Types.ObjectId, required: true },
  completed: { type: Boolean, required: true, default: false },
  code: { type: String, required: false },
});

const schema = new db.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  challenges: { type: [Challenge], required: true, default: [] },
});

const entity = db.model('User', schema);
exports.entity = entity;


// -----------------------------------------
// THIS PART IS DEDICATED TO MODEL'S METHODS
// -----------------------------------------
const bcrypt = require('bcrypt');

const helpers = require('../helpers');

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * 
 * @returns {Promise<boolean>} 
 */
exports.checkCredentials = (email, password) => new Promise(async (resolve, reject) => {
  if (!email || !password || !helpers.isEmail(email)) {
    return resolve(false);
  }

  try {
    const user = await entity.findOne({ email }, ['password']);

    const valid = await bcrypt.compare(password, user.password);

    resolve(valid);
  } catch (e) {
    reject(e);
  }
});