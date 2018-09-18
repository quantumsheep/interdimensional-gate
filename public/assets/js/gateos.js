class GateOs {
    /**
     * 
     * @param {object} terminal 
     * @param {HTMLElement} terminal.form 
     * @param {HTMLElement} terminal.content 
     * @param {object} terminal.cmd 
     * @param {HTMLElement} terminal.cmd.prefix 
     * @param {HTMLElement} terminal.cmd.content 
     * @param {HTMLElement} terminal.cmd.input 
     * @param {object} user 
     * @param {string} user._id 
     * @param {string} user.username 
     */
    constructor(terminal, user) {
        this.terminal = terminal;
        this.user = user;

        window.addEventListener('click', () => {
            this.terminal.cmd.input.focus();
        });

        this.terminal.cmd.input.addEventListener('input', e => {
            this.terminal.cmd.content.innerText = e.target.value;
        });

        this.terminal.form.addEventListener('submit', e => {
            e.preventDefault();

            if (this.ws && this.ws.subscriptions.os && this.ws.subscriptions.os._state === 'open') {
                this.sendCommand(this.terminal.cmd.input.value);

                this.terminal.cmd.input.value = '';
                this.terminal.cmd.content.innerText = '';
            }
        });

        this.updatePrefix();
        this.initializeSocket();
    }

    updatePrefix() {
        this.terminal.cmd.prefix.innerText = `root@${this.user.username}>`;
    }

    initializeSocket() {
        this.ws = adonis.Ws().connect()

        this.ws.on('open', () => {
            console.log('connected')

            const os = this.ws.subscribe('os')

            os.on('error', err => {
                console.log(err)
            })

            os.on('response', res => {
                const row = document.createElement('div');
                row.innerText = res;

                this.terminal.content.appendChild(row);

                this.terminal.form.scrollTo(0, this.terminal.form.scrollHeight)
            })
        })

        this.ws.on('error', err => {
            console.log(err)
        })
    }

    sendCommand(cmd) {
        this.ws.getSubscription('os').emit('message', cmd);
    }
}
