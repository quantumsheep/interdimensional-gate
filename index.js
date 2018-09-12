const express = require('express');
const path = require('path');

const app = express();

app.use('/assets', express.static('assets'))

app.get('/', (req, res) => {
    res.sendFile(path.resolve('views/login.html'));
});

app.post('/login', (req, res) => {
    console.log(req.body);

    res.send(false);
});

const port = 3000;
app.listen(port, () => console.log(`HTTP process launched on http://localhost:${3000}`));