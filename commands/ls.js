/**
 * @param {SocketIO.Server} io 
 * @param {SocketIO.Socket} socket 
 * @param {string[]} args
 */
module.exports = (io, socket, args) => {
    socket.emit('row', ['instructions.md'])
    socket.emit('end');
}