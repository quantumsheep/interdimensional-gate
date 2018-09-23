const app = require('express')();
const server = require('http').Server(app);

/**
* Boolean that define if the current environment is development (true) or production (false)
*/
const dev = process.env.NODE_ENV !== 'production';

app.set('trust proxy', 1);


/*
| Initialize session handler
*/
const esession = require('express-session');
const MongoStore = require('connect-mongo')(esession);
const { connection } = require('./db');

const session = esession({
    name: 'gate',
    secret: 'wqUA_>n,u$h|uCcebW,|;4&a}5B)[+ZI0]WUZI/.[S$T4{c%dxs3Bea|Pl96rTc}%=w30W#/=T|^@:h[K$E&5"4WPC7_xE[-PZC%@~JtDx)%%n1EVX2=TEYxz&LE-?=W',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !dev },
    store: new MongoStore({ mongooseConnection: connection })
});

app.use(session);


/*
| Handle Gate Operating System WS requests
*/
const io = require('socket.io')(server, {
    path: '/gateos'
});

const sharedsession = require('express-socket.io-session');

const GateOS = require('./GateOS');

io.use(sharedsession(session, {
    autoSave: true
}));

io.on('connection', socket => new GateOS(io, socket));


/*
| Load HTTP request listener
*/
const port = 3011;

server.listen(port, err => {
    if (err) throw err;

    console.log(`> Ready on http://localhost:${port}`);
});