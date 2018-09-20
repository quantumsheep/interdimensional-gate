'use strict'

class HomeController {
    async index({ view, auth }) {
        return view.render('index');
    }
}

module.exports = HomeController;
