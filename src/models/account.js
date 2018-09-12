const { Model } = require('mongoose');
const db = require('../services/db');

const schema = new db.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const entity = db.model('Account', schema);
exports.entity = entity;


// -----------------------------------------
// THIS PART IS DEDICATED TO MODEL'S METHODS
// -----------------------------------------
const bcrypt = require('bcrypt');

const validator = require('../services/validator');

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * 
 * @returns {Promise<boolean>} 
 */
exports.checkCredentials = (email, password) => new Promise(async (resolve, reject) => {
    if (!email || !password || !validator.isEmail(email)) {
        return resolve(false);
    }

    try {
        const account = await entity.findOne({ email }, ['password']);

        const valid = await bcrypt.compare(password, account.password);

        resolve(valid);
    } catch (e) {
        reject(e);
    }
});