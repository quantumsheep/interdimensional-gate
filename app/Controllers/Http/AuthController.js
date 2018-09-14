'use strict'

class AuthController {
    async login({ request, auth, session }) {
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
