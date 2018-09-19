'use strict'

class HomeController {
    async index({ view, auth }) {
        try {
            await auth.check();
            
            return view.render('index', { user: auth.user });
        } catch (e) {
            return view.render('login');
        }
    }
}

module.exports = HomeController;
