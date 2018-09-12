const { Router } = require('express');
const router = Router();

const controllers = {
    home: require('./controllers/home'),
    account: require('./controllers/account'),
}

for(let i in controllers) {
    router.use(controllers[i]);
}

module.exports = router;