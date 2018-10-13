const fs = require('fs');
const path = require('path');
const SocketIO = require('socket.io');

const commandsPath = path.resolve('src/commands');

const commands = {};

fs.readdir(commandsPath, (err, files) => {
  if (err) return console.log(err);

  files.forEach(file => {
    if (file.endsWith('.js')) {
      commands[file.slice(0, -3)] = require(`${commandsPath}/${file}`);
    }
  });
});

module.exports = class GateOS {
  /**
   * @param {SocketIO.Server} io 
   * @param {SocketIO.Socket} socket 
   */
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;

    this.session = socket.handshake.session;

    this.state = {
      command: '',
      data: {},
    };

    this.currentCommand = '';

    /**
    | Define the user's terminal prompt
    */
    this.defaultPrefix = 'guest@gate $';

    if (this.session.connected) {
      this.setPrefix(`${this.session.user.username.toLowerCase()}@gate $`);
    } else {
      this.setPrefix(this.defaultPrefix);
    }

    socket.on('start', reconnecting => {
      if (!reconnecting) {
        const greetings = [
          'Linux gate 4.9.0-7-amd64 #1 SMP Gate 4.9.110-3+deb9u2 (2018-08-13) x86_64',
          '',
          'The programs included with the Interdimensional Gate system are free software;',
          'the exact distribution terms for each program are described in the',
          'individual files in /usr/share/doc/*/copyright.',
          '',
          'Interdimensional Gate comes with ABSOLUTELY NO WARRANTY, to the extent',
          'permitted by applicable law.',
          'Last login: Fri Sep 14 14:13:12 2018 from 1.2.3.4',
        ];

        greetings.forEach(row => {
          if (row) {
            this.row(row);
          } else {
            this.linejump();
          }
        });
      }

      socket.emit('ready');
    });

    socket.on('command', command => {
      command = String(command).trim();

      if (this.state.command) {
        return commands[this.state.command].state(this, command);
      }

      if (!command) {
        return this.end();
      }

      const [cmd, ...args] = command.split(' ');

      if (cmd in commands) {
        this.currentCommand = cmd;

        commands[cmd].call(this, args);
      } else {
        this.row(`You can't access this command: ${cmd}`).end();
      }
    });

    socket.on('control', key => {
      const control = String(key).toUpperCase();

      if (control === 'C') {
        this.end();
      }
    });
  }

  row(content) {
    this.socket.emit('row', content);
    return this;
  }

  input(prefix, type = 'text') {
    this.socket.emit('input', prefix, type);
    return this;
  }

  end() {
    this.socket.emit('end');
    this.resetState();

    return this;
  }

  /**
   * @param {string} cmd
   */
  help(cmd) {
    if (commands.help) {
      commands.help.call(this, cmd.split(' '));
    } else {
      this.end();
    }

    return this;
  }

  linejump() {
    this.socket.emit('linejump');
    return this;
  }

  setPrefix(prefix) {
    this.socket.emit('update prefix', prefix);
    return this;
  }

  setState(data = {}) {
    if (this.state.command !== this.currentCommand) {
      this.state = { command: this.currentCommand, data };
    } else {
      this.state.data = Object.assign(this.state.data, data);
    }

    return this;
  }

  resetState() {
    this.state.command = '';
    this.state.data = null;
  }
}