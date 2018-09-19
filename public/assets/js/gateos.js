class GateOs {
    /**
     * 
     * @param {object} terminal 
     * @param {HTMLElement} terminal.form 
     * @param {HTMLElement} terminal.content 
     * @param {object} terminal.cmd 
     * @param {HTMLElement} terminal.cmd.parent 
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
        this.history = [];
        this.selected = -1;
        
        this.terminal.form.addEventListener('click', () => {
            this.terminal.cmd.input.focus();
        });

        this.terminal.cmd.input.addEventListener('keypress', e => {
            this.updateCommandContent();
        });

        this.terminal.cmd.input.addEventListener('keyup', e => {
            this.updateCommandContent();
        });

        this.terminal.cmd.input.addEventListener('keydown', e => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();

                this.selected++;

                if (this.selected >= this.history.length) {
                    this.selected = this.history.length - 1;
                } else {
                    this.terminal.cmd.input.value = this.history[this.history.length - 1 - this.selected] || '';
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();

                this.selected--;

                if (this.selected < -1) {
                    this.selected = -1;
                } else {
                    this.terminal.cmd.input.value = this.history[this.history.length - 1 - this.selected] || '';
                }
            }
        });

        this.terminal.form.addEventListener('submit', e => {
            e.preventDefault();

            if (this.ws && this.ws.subscriptions.os && this.ws.subscriptions.os._state === 'open') {
                const row = document.createElement('div');
                row.innerText = `${this.terminal.cmd.prefix.innerText} ${this.terminal.cmd.input.value}`;

                this.terminal.content.appendChild(row);

                this.terminal.cmd.parent.classList.add('invisible');

                this.sendCommand(this.terminal.cmd.input.value);

                if (this.terminal.cmd.input.value != this.history[this.history.length - 1]) {
                    this.history.push(this.terminal.cmd.input.value);
                }

                this.selected = -1;

                this.terminal.cmd.input.value = '';
                this.terminal.cmd.content.innerText = '';
            }
        });

        this.updatePrefix();
        this.updateCommandContent();
        this.initializeSocket();
    }

    async updateCommandContent() {
        while (this.terminal.cmd.content.firstChild) {
            this.terminal.cmd.content.removeChild(this.terminal.cmd.content.firstChild);
        }

        /** @type {string} */
        const { value: content, selectionStart } = this.terminal.cmd.input;

        const first = document.createElement('span');
        first.innerText = content.slice(0, selectionStart);

        const selector = document.createElement('span');

        if (content[selectionStart]) {
            selector.style.color = '#000';
            selector.innerText = content[selectionStart];
        } else {
            selector.innerText = 'x';
        }

        selector.style.backgroundColor = '#fff';

        const last = document.createElement('span');
        last.innerText = content.slice(selectionStart + 1, content.length);

        this.terminal.cmd.content.appendChild(first);
        this.terminal.cmd.content.appendChild(selector);
        this.terminal.cmd.content.appendChild(last);
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
            });

            os.on('response', res => {
                const row = document.createElement('div');
                row.innerText = res;

                this.terminal.content.appendChild(row);

                this.terminal.form.scrollTo(0, this.terminal.form.scrollHeight)
            });

            os.on('end', () => {
                this.terminal.cmd.parent.classList.remove('invisible');
            });
        })

        this.ws.on('error', err => {
            console.log(err)
        })
    }

    sendCommand(cmd) {
        this.ws.getSubscription('os').emit('message', cmd);
    }
}
