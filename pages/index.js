import { Component } from 'react';
import io from 'socket.io-client';
import Head from 'next/head';

export default class extends Component {
    state = {
        terminal: {
            prefix: 'guess@gate',
            content: '',
            /** @type {HTMLInputElement} */
            input: null,
        }
    }

    componentDidMount() {
        this.socket = io();
        this.socket.on('test', ({ message, action }) => {
            console.log(message);
        });
    }

    TerminalContent = () => {
        console.log(this)
        if (!this.state.terminal.input) {
            return <span></span>;
        }

        /** @type {string} */
        const { value: content, selectionStart } = this.state.terminal.input;

        return (
            <div className="terminal-input-content">
                <span>{content.slice(0, selectionStart)}</span>
                <span className="terminal-selector" style={{ color: (content[selectionStart] ? '#000000' : '#ffffff') }}>{content[selectionStart] || 'x'}</span>
                <span>{content.slice(selectionStart + 1, content.length)}</span>
            </div>
        )
    }

    focusInput = () => {
        if (this.state.terminal.input) {
            this.state.terminal.input.focus();
        }
    }

    updateState = () => this.forceUpdate();

    render() {
        return (
            <div>
                <Head>
                    <title>Interdimensional Gate</title>
                    <link href="/static/css/normalize/normalize.min.css" rel="stylesheet" />
                    <link href="/static/css/gate.css" rel="stylesheet" />
                </Head>
                <form method="POST" action="/command" className="terminal" id="terminal" onClick={this.focusInput}>
                    <div id="terminal-content">
                        <div>Linux gate 4.9.0-7-amd64 #1 SMP Gate 4.9.110-3+deb9u2 (2018-08-13) x86_64</div>
                        <br />
                        <div>The programs included with the Interdimensional Gate system are free software;</div>
                        <div>the exact distribution terms for each program are described in the</div>
                        <div>individual files in /usr/share/doc/*/copyright.</div>
                        <br />
                        <div>Interdimensional Gate comes with ABSOLUTELY NO WARRANTY, to the extent</div>
                        <div>permitted by applicable law.</div>
                        <div>Last login: Fri Sep 14 14:13:12 2018 from 1.2.3.4</div>
                    </div>
                    <div>{this.state.terminal.prefix} <this.TerminalContent /></div>
                    <input ref={input => this.state.terminal.input = input} type="text" className="input-hiddden" onKeyPress={this.updateState} onKeyUp={this.updateState} autoComplete="off" autoFocus={true} />
                    <button className="hidden" type="submit"></button>
                </form>
            </div>
        )
    }
}