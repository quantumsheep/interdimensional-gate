'use strict'

class OSController {
  constructor({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  onMessage(fullcmd) {
    if (!fullcmd) {
      return;
    }

    const [cmd, ...args] = fullcmd.trim().split(' ');
    
    args.map(arg => arg.trim());

    if (cmd === 'ls') {
      this.socket.emit('response', ['test']);
    } else {
      this.socket.emit('response', "You can't access this command.");
    }

    this.socket.emit('end');
  }

  onClose() {

  }

  onError(err) {
    console.log(err)
  }
}

module.exports = OSController
