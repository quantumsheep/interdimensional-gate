document.getElementById('email').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        const emailPrompt = document.querySelector('[data-promp="email"]');

        if (!this.value.match(emailRegex)) {
            emailPrompt.classList.add('danger');
            return;
        }

        emailPrompt.classList.remove('danger');

        const passwordPrompt = document.querySelector('[data-promp="password"]');
        passwordPrompt.classList.remove('hidden');

        const passwordInput = document.getElementById('password');
        passwordInput.classList.remove('hidden');
        passwordInput.focus();
    }
});

document.getElementById('password').addEventListener('keydown', async function (e) {
    if (e.key === 'Enter') {
        try {
            const { data: valid } = await axios.post('/login', {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
            });

            if (!valid) {
                const login = document.getElementById('login');
                login.classList.add('shake-trigger');

                setTimeout(() => {
                    login.classList.remove('shake-trigger');
                }, 250);
            } else {
                window.location.reload();
            }
        } catch (e) {
            console.log(e);
        }
    }
});

document.addEventListener('click', function ({ target }) {
    if (target.tagName === 'INPUT') {
        return;
    }

    const emailInput = document.getElementById('email');

    if (emailInput.value) {
        const passwordInput = document.getElementById('password');
        passwordInput.focus();
    } else {
        emailInput.focus();
    }
});