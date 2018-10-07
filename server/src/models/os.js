const mongoose = require('mongoose');
const db = require('../db');

const FileSchema = new db.Schema();

FileSchema.add({
  name: { type: String, require: true },
  isDir: { type: Boolean, required: true },
  children: [FileSchema],
});

const schema = new db.Schema({
  files: { type: [FileSchema], required: true, default: [] },
});

const entity = db.model('OS', schema);
exports.entity = entity;