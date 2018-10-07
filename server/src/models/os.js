const mongoose = require('mongoose');
const db = require('../db');

const FileSchema = new db.Schema();

FileSchema.add({
  name: { type: String, require: true },
  isDir: { type: Boolean, required: true },
  content: { type: String, required: false },
  children: { type: [FileSchema], required: false },
});

const schema = new db.Schema({
  files: { type: [FileSchema], required: true, default: [] },
});

exports.schema = schema;

const entity = db.model('OS', schema);
exports.entity = entity;