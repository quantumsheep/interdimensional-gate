const { Router } = require('express');
const models = require('../models');
const router = new Router();

const path = require('path');

router.get('/', (req, res) => {
    if (!req.session.account) {
        return res.sendFile(path.resolve('views/login.html'));
    }

    
});

module.exports = router;