const app = require('express')();
const server = require('http').Server(app);

/**
* Boolean that define if the current environment is development (true) or production (false)
*/
const dev = process.env.NODE_ENV !== 'production';

const cookieSecret = 'hna3StBXRERf4BMJgJw8mEjXfGATrhNMZXGGcvVpzXRW69bULUZMkC2K9hfDbtab3mdyTFjEzQDYqkW2aA6edyQsCRf2TMmPrEwueZtfcqfA29nxCDrhT6Xaw6BELmhw';

/*
| Define express properties
*/
const helmet = require('helmet');

app.use(helmet());

app.set('trust proxy', 1);


/*
| Initialize session handler
*/
const esession = require('express-session');
const MongoStore = require('connect-mongo')(esession);
const { connection } = require('./db');

const day = 24 * 60 * 60 * 1000;

const session = esession({
    name: 'gate',
    secret: cookieSecret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: !dev,
        httpOnly: true,
        expires: new Date(Date.now() + 31 * day)
    },
    store: new MongoStore({ mongooseConnection: connection })
});

app.use(session);

app.get('/identify', (req, res) => {
    res.send('ok');
});

/*
| Handle Gate Operating System WS requests
*/
const io = require('socket.io')(server, {
    path: '/gateos'
});

const ios = require('express-socket.io-session');
const cookieParser = require('cookie-parser');

io.use(ios(session, cookieParser(cookieSecret)));

const GateOS = require('./GateOS');

io.on('connection', socket => new GateOS(io, socket));


/*
| Load HTTP request listener
*/
const port = 3011;

server.listen(port, err => {
    if (err) throw err;

    console.log(`> Ready on http://localhost:${port}`);
});