const commands = {
    'ls': require('./commands/ls'),
    'login': require('./commands/login'),
}

/**
 * @param {SocketIO.Server} io 
 * @param {SocketIO.Socket} socket 
 */
module.exports = (io, socket) => {
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
                    socket.emit('row', row);
                } else {
                    socket.emit('linejump');
                }
            });
        }

        socket.emit('ready');
    });

    socket.on('command', command => {
        command = String(command).trim();

        if (!command) {
            return socket.emit('end');
        }

        const [cmd, ...args] = command.split(' ');

        if (cmd in commands) {
            commands[cmd](io, socket, args);
        } else {
            socket.emit('row', `You can't access this command: ${cmd}`);
            socket.emit('end');
        }
    });
}