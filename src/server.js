const express = require('express');
const bodyParser = require('body-parser');

const router = require('./router');
const app = express();

const db = require('./services/db');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: `vg*\\ZLM>qYPet^T>XQ#^2.=vGV'x/c=ZP5P6-9;'P.2w=Gm&Lq-{&c\\Js@@-jL^^\\JFtTDj}m2D/B9eK8#6j5^spN7%>4mUvD%mbY.E2-7Zp*XRWW}JbFp4\\C?h:Q3+`,
    store: new MongoStore({ mongooseConnection: db.connection }),
    resave: true,
    saveUninitialized: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/assets', express.static('assets'))

app.use(router);

const port = 3000;
app.listen(port, () => console.log(`HTTP process launched on http://localhost:${port}`));