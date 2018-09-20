/** @type {import('@adonisjs/websocket/src/Ws/index')} */
const Ws = use('Ws')

Ws.channel('os', 'OSController')