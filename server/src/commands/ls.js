/**
 * @param {import('../GateOS')} os 
 * @param {string[]} args
 */
exports.call = (os, args) => {
  os.row(['instructions.md']).end();
}