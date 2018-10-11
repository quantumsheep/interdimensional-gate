/**
 * @param {import('../GateOS')} os 
 * @param {string[]} args
 */
exports.call = (os) => {
  if (os.session.connected) {
    os.setPrefix(os.defaultPrefix);

    os.session.connected = false;
    os.session.user = undefined;
    os.session.save();

    os.end();
  } else {
    os.row('You are already disconnected.').end()
  }
}