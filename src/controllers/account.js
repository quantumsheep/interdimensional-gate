const { Router } = require('express');
const models = require('../models');
const router = new Router();

router.post('/login', async ({ session, body: { email, password } }, res) => {
    try {
        const valid = await models.account.checkCredentials(email, password);

        if (valid) {
            session.account = await models.account.entity.findOne({ email }, ['_id', 'email']);
        }

        res.send(valid);
    } catch (e) {
        res.send(false);

        console.log(e);
    }
});

module.exports = router;