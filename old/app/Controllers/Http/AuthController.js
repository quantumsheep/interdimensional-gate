'use strict'

class AuthController {
    async login({ request, auth }) {
        try {
            const { email, password } = request.all();

            await auth.remember(true).attempt(email, password);

            return true;
        } catch (e) {
            return false;
        }
    }
}

module.exports = AuthController;
