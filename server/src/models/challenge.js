const db = require('../db');

const Answers = new db.Schema({
    name: { type: String, required: true },
    wanted: { type: String, required: true },
});

const schema = new db.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  answers: { type: [Answers], required: true, default: [] },
});

const entity = db.model('Challenge', schema);
exports.entity = entity;
