const fs = require('fs');
const path = require('path');

const helpers = require('../helpers');
const { User } = require('../models');

/**
 * @param {import('../GateOS')} os 
 * @param {string[]} args
 */
exports.call = (os, [command]) => {
  const manPath = path.resolve('src/man');

  if (command) {
    fs.readFile(`${manPath}/${command}.md`, (err, data) => {
      if (err) return console.log(err);

      os.row(data.toString());

      os.end();
    });
  } else {
    fs.readdir(manPath, (err, files) => {
      if (err) {
        console.log(err);
        return os.end();
      }

      files.forEach(file => {
        if (file.endsWith('.md')) {
          fs.readFile(`${manPath}/${file}`, (err, data) => {
            if (err) return console.log(err);

            const [, usage] = /^# Usage\S?\r?\n?(.*)/gm.exec(data.toString()) || [];

            if (usage) {
              os.row(usage)
            }
          });
        }
      });

      os.end();
    });
  }
}
