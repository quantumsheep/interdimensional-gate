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
const session = require('express-session')({
    name: 'gate',
    secret: 'wqUA_>n,u$h|uCcebW,|;4&a}5B)[+ZI0]WUZI/.[S$T4{c%dxs3Bea|Pl96rTc}%=w30W#/=T|^@:h[K$E&5"4WPC7_xE[-PZC%@~JtDx)%%n1EVX2=TEYxz&LE-?=W',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !dev }
});

app.use(session);


/*
| Handle Gate Operating System WS requests
*/
const io = require('socket.io')(server);
const sharedsession = require('express-socket.io-session');

const GateOS = require('./GateOS');

io.use(sharedsession(session, {
    autoSave: true
}));

io.on('connection', socket => GateOS(io, socket));


/*
| Load NextJS and HTTP request listener
*/
const next = require('next');

const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const port = 3000;

nextApp.prepare().then(() => {
    app.get('*', (req, res) => nextHandler(req, res));

    server.listen(port, err => {
        if (err) throw err;

        console.log(`> Ready on http://localhost:${port}`);
    });
});
