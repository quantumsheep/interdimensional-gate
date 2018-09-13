'use strict'

const User = use('App/Models/User')

class AuthController {
    async login({ request, auth }) {
        try {
            const { email, password } = request.all();

            await auth.remember(true).attempt(email, password);

            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

module.exports = AuthController;
