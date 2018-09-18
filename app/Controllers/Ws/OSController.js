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

    const [cmd, ...args] = fullcmd.split(' ');

    if (cmd === 'ls') {
      this.socket.emit('response', ['test']);
    }
  }

  onClose() {

  }

  onError(err) {
    console.log(err)
  }
}

module.exports = OSController
